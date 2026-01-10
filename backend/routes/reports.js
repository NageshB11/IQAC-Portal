import express from 'express';
import { verifyToken, checkRole } from '../middleware/auth.js';
import {
    ResearchPublication,
    ProfessionalDevelopment,
    CourseTaught,
    EventOrganized,
    InstitutionalEvent
} from '../models/FacultyActivity.js';
import Document from '../models/Document.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.get('/generate', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
    try {
        const { academicYear, department, activityType, formats } = req.query;
        const User = (await import('../models/User.js')).default;
        const Department = (await import('../models/Department.js')).default;
        const user = await User.findById(req.userId).populate('department');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build queries
        let departmentId = null;
        let departmentName = 'All Departments';

        if (user.role === 'coordinator') {
            departmentId = user.department._id;
            departmentName = user.department.name;
        } else if (department) {
            departmentId = department;
            const dept = await Department.findById(department);
            if (dept) departmentName = dept.name;
        }

        // Helper to get date range from academic year
        const getDateRange = (yearString) => {
            if (!yearString) return null;
            const [startYear, endYear] = yearString.split('-').map(Number);
            // Assuming academic year starts June 1st and ends May 31st
            const startDate = new Date(startYear, 5, 1); // June 1st
            const endDate = new Date(endYear, 4, 31, 23, 59, 59, 999); // May 31st
            return { $gte: startDate, $lte: endDate };
        };

        const dateRange = getDateRange(academicYear);

        // Base queries
        const facultyQuery = {};
        const deptQuery = {};

        if (departmentId) {
            deptQuery.department = departmentId;

            // Find all faculty in this department
            const facultyMembers = await User.find({ department: departmentId });
            const facultyIds = facultyMembers.map(u => u._id);
            facultyQuery.faculty = { $in: facultyIds };
        }

        let reportData = {};
        let reportTitle = '';

        // Fetch data based on activity type
        switch (activityType) {
            case 'research':
                const researchQuery = { ...facultyQuery };
                if (dateRange) researchQuery.publicationDate = dateRange;

                const research = await ResearchPublication.find(researchQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ publicationDate: -1 });
                reportData = research;
                reportTitle = 'Research Publications Report';
                break;

            case 'professional-development':
                const pdQuery = { ...facultyQuery };
                if (dateRange) pdQuery.startDate = dateRange; // Using startDate for filtering

                const pd = await ProfessionalDevelopment.find(pdQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ startDate: -1 });
                reportData = pd;
                reportTitle = 'Professional Development Report';
                break;

            case 'courses':
                const courseQuery = { ...facultyQuery };
                if (academicYear) courseQuery.academicYear = academicYear;

                const courses = await CourseTaught.find(courseQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ academicYear: -1 });
                reportData = courses;
                reportTitle = 'Courses Taught Report';
                break;

            case 'events':
                const eventQuery = { ...deptQuery };
                if (dateRange) eventQuery.eventDate = dateRange;

                const events = await EventOrganized.find(eventQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .populate('department', 'name')
                    .sort({ eventDate: -1 });
                reportData = events;
                reportTitle = 'Events Organized Report';
                break;

            case 'institutional-events':
                const instEventQuery = { ...deptQuery };
                if (academicYear) instEventQuery.academicYear = academicYear;

                const institutionalEvents = await InstitutionalEvent.find(instEventQuery)
                    .populate('department', 'name code')
                    .sort({ startDate: -1 });
                reportData = institutionalEvents;
                reportTitle = 'Institutional Workshops/Seminars/Conferences Report';
                break;


            case 'student-achievements':
                const achieveQuery = { ...deptQuery, documentType: 'achievement' };
                if (dateRange) achieveQuery.createdAt = dateRange;

                const achievements = await Document.find(achieveQuery)
                    .populate({
                        path: 'uploadedBy',
                        select: 'firstName lastName email phoneNumber enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .populate('department', 'name')
                    .sort({ createdAt: -1 });
                reportData = achievements;
                reportTitle = 'Student Achievements Report';
                break;

            case 'student-career':
                const careerQuery = { ...deptQuery, documentType: 'career' };
                if (dateRange) careerQuery.createdAt = dateRange;

                const career = await Document.find(careerQuery)
                    .populate({
                        path: 'uploadedBy',
                        select: 'firstName lastName email phoneNumber enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .populate('department', 'name')
                    .sort({ createdAt: -1 });
                reportData = career;
                reportTitle = 'Student Career Progression Report';
                break;

            case 'all-faculty':
                const researchQueryAll = { ...facultyQuery };
                const pdQueryAll = { ...facultyQuery };
                const courseQueryAll = { ...facultyQuery };
                const eventQueryAll = { ...deptQuery };

                if (dateRange) {
                    researchQueryAll.publicationDate = dateRange;
                    pdQueryAll.startDate = dateRange;
                    eventQueryAll.eventDate = dateRange;
                }
                if (academicYear) courseQueryAll.academicYear = academicYear;

                const [allResearch, allPd, allCourses, allEvents] = await Promise.all([
                    ResearchPublication.find(researchQueryAll).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ publicationDate: -1 }),
                    ProfessionalDevelopment.find(pdQueryAll).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ startDate: -1 }),
                    CourseTaught.find(courseQueryAll).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ academicYear: -1 }),
                    EventOrganized.find(eventQueryAll).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ eventDate: -1 })
                ]);
                reportData = {
                    research: allResearch,
                    professionalDevelopment: allPd,
                    courses: allCourses,
                    events: allEvents
                };
                reportTitle = 'All Faculty Activities Report';
                break;

            case 'all-student':
                const achieveQueryAll = { ...deptQuery, documentType: 'achievement' };
                const careerQueryAll = { ...deptQuery, documentType: 'career' };

                if (dateRange) {
                    achieveQueryAll.createdAt = dateRange;
                    careerQueryAll.createdAt = dateRange;
                }

                const [studentAchievements, studentCareer] = await Promise.all([
                    Document.find(achieveQueryAll).populate({ path: 'uploadedBy', select: 'firstName lastName email phoneNumber enrollmentNumber', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ createdAt: -1 }),
                    Document.find(careerQueryAll).populate({ path: 'uploadedBy', select: 'firstName lastName email phoneNumber enrollmentNumber', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ createdAt: -1 })
                ]);
                reportData = {
                    achievements: studentAchievements,
                    career: studentCareer
                };
                reportTitle = 'All Student Activities Report';
                break;

            case 'comprehensive':
                const researchQueryComp = { ...facultyQuery };
                const pdQueryComp = { ...facultyQuery };
                const courseQueryComp = { ...facultyQuery };
                const eventQueryComp = { ...deptQuery };
                const instEventQueryComp = { ...deptQuery };
                const achieveQueryComp = { ...deptQuery, documentType: 'achievement' };
                const careerQueryComp = { ...deptQuery, documentType: 'career' };

                if (dateRange) {
                    researchQueryComp.publicationDate = dateRange;
                    pdQueryComp.startDate = dateRange;
                    eventQueryComp.eventDate = dateRange;
                    achieveQueryComp.createdAt = dateRange;
                    careerQueryComp.createdAt = dateRange;
                }

                if (academicYear) {
                    courseQueryComp.academicYear = academicYear;
                    instEventQueryComp.academicYear = academicYear;
                }

                const [compResearch, compPd, compCourses, compEvents, compInstEvents, compAchievements, compCareer] = await Promise.all([
                    ResearchPublication.find(researchQueryComp).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ publicationDate: -1 }),
                    ProfessionalDevelopment.find(pdQueryComp).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ startDate: -1 }),
                    CourseTaught.find(courseQueryComp).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).sort({ academicYear: -1 }),
                    EventOrganized.find(eventQueryComp).populate({ path: 'faculty', select: 'firstName lastName email phoneNumber designation', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ eventDate: -1 }),
                    InstitutionalEvent.find(instEventQueryComp).populate('department', 'name code').sort({ startDate: -1 }),
                    Document.find(achieveQueryComp).populate({ path: 'uploadedBy', select: 'firstName lastName email phoneNumber enrollmentNumber', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ createdAt: -1 }),
                    Document.find(careerQueryComp).populate({ path: 'uploadedBy', select: 'firstName lastName email phoneNumber enrollmentNumber', populate: { path: 'department', select: 'name' } }).populate('department', 'name').sort({ createdAt: -1 })
                ]);
                reportData = {
                    research: compResearch,
                    professionalDevelopment: compPd,
                    courses: compCourses,
                    events: compEvents,
                    institutionalEvents: compInstEvents,
                    achievements: compAchievements,
                    career: compCareer
                };
                reportTitle = 'Comprehensive Report';
                break;


            default:
                return res.status(400).json({ message: 'Invalid activity type' });
        }

        // Check if data exists
        let hasData = false;
        if (Array.isArray(reportData)) {
            hasData = reportData.length > 0;
        } else if (typeof reportData === 'object' && reportData !== null) {
            // Check if any key in the object has a non-empty array
            hasData = Object.values(reportData).some(arr => Array.isArray(arr) && arr.length > 0);
        }

        if (!hasData) {
            return res.status(404).json({ message: 'No data found for the selected criteria' });
        }

        // Generate PDF
        const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${reportTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

        doc.pipe(res);

        // Add Metadata
        doc.info['Title'] = reportTitle;
        doc.info['Author'] = 'IQAC Portal';
        doc.info['Subject'] = `Generated Report for ${departmentName}`;

        // Helper to add header
        const addHeader = () => {
            // College Name
            doc.fontSize(18).font('Helvetica-Bold').text("MGM's College of Engineering Nanded", { align: 'center' });
            doc.moveDown(0.3);

            // IQAC Portal subtitle
            doc.fontSize(12).font('Helvetica').text('IQAC Portal', { align: 'center' });
            doc.moveDown(0.5);

            // Document Name (Report Title)
            doc.fontSize(16).font('Helvetica-Bold').text(reportTitle, { align: 'center' });
            doc.moveDown(0.3);

            // Academic Year
            doc.fontSize(14).font('Helvetica-Bold').text(`Academic Year: ${academicYear || 'All Years'}`, { align: 'center' });
            doc.moveDown();

            // Additional Info
            doc.fontSize(10).font('Helvetica');
            doc.text(`Department: ${departmentName}`, { align: 'left' });
            doc.text(`Generated on: ${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}`, { align: 'left' });
            doc.text(`Generated by: ${user.firstName} ${user.lastName} (${user.role})`, { align: 'left' });

            doc.moveDown();
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();
        };

        addHeader();

        // Helper to format date
        const formatDate = (date) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('en-IN');
        };

        // Helper to add table
        const addTableToPDF = (doc, headers, rows) => {
            const tableTop = doc.y;
            const itemHeight = 20;
            const columnWidth = 500 / headers.length;

            doc.font('Helvetica-Bold').fontSize(10);

            // Draw table header background
            doc.fillColor('#f0f0f0').rect(50, tableTop, 500, 20).fill();
            doc.fillColor('black'); // Reset text color

            headers.forEach((header, i) => {
                doc.text(header, 50 + (i * columnWidth) + 5, tableTop + 5, {
                    width: columnWidth - 10,
                    align: 'left'
                });
            });

            // Draw header line
            doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

            // Draw rows
            doc.font('Helvetica').fontSize(9);
            let currentY = tableTop + 25;

            rows.forEach((row, rowIndex) => {
                if (currentY > doc.page.height - 50) {
                    doc.addPage();
                    addHeader(); // Re-add header on new page
                    currentY = doc.y;

                    // Redraw table headers on new page
                    doc.font('Helvetica-Bold').fontSize(10);
                    doc.fillColor('#f0f0f0').rect(50, currentY, 500, 20).fill();
                    doc.fillColor('black');
                    headers.forEach((header, i) => {
                        doc.text(header, 50 + (i * columnWidth) + 5, currentY + 5, {
                            width: columnWidth - 10,
                            align: 'left'
                        });
                    });
                    currentY += 25;
                    doc.font('Helvetica').fontSize(9);
                }

                // Zebra striping
                if (rowIndex % 2 === 1) {
                    doc.fillColor('#f9f9f9').rect(50, currentY - 5, 500, itemHeight).fill();
                    doc.fillColor('black');
                }

                row.forEach((cell, i) => {
                    // Check if cell is an object with link property (for interactive links)
                    if (typeof cell === 'object' && cell !== null && cell.link) {
                        doc.fillColor('blue')
                            .text(cell.text || 'Link', 50 + (i * columnWidth) + 5, currentY, {
                                width: columnWidth - 10,
                                align: 'left',
                                link: cell.link,
                                underline: true
                            });
                        doc.fillColor('black'); // Reset
                    } else {
                        doc.text(cell || 'N/A', 50 + (i * columnWidth) + 5, currentY, {
                            width: columnWidth - 10,
                            align: 'left'
                        });
                    }
                });

                currentY += itemHeight;
            });

            doc.moveDown();
            return currentY;
        };

        // Add data based on type
        if (Array.isArray(reportData) && reportData.length > 0) {
            // Simple report (single activity type)
            doc.fontSize(12).font('Helvetica-Bold').text(`Total Records: ${reportData.length}`);
            doc.moveDown();

            switch (activityType) {
                case 'research':
                    const researchHeaders = ['#', 'Title of Paper', 'Authors', 'Department', 'Journal', 'Year', 'ISSN', 'Link'];
                    const researchRows = reportData.map((item, index) => [
                        (index + 1).toString(),
                        item.title?.substring(0, 30) + '...' || 'N/A',
                        item.authors || 'N/A',
                        item.faculty?.department?.name || 'N/A',
                        item.journalConference?.substring(0, 20) + '...' || 'N/A',
                        new Date(item.publicationDate).getFullYear().toString(),
                        item.issn || item.isbn || 'N/A',
                        item.documentUrl ? { text: 'View', link: item.documentUrl } : 'N/A'
                    ]);
                    addTableToPDF(doc, researchHeaders, researchRows);
                    break;

                case 'professional-development':
                    const pdHeaders = ['#', 'Faculty', 'Designation', 'Program', 'Type', 'Dates', 'Cert'];
                    const pdRows = reportData.map((item, index) => [
                        (index + 1).toString(),
                        `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                        item.faculty?.designation || 'N/A',
                        item.programName?.substring(0, 25) + '...' || 'N/A',
                        item.type || 'N/A',
                        `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
                        item.certificateUrl ? { text: 'View', link: item.certificateUrl } : 'N/A'
                    ]);
                    addTableToPDF(doc, pdHeaders, pdRows);
                    break;

                case 'courses':
                    const courseHeaders = ['#', 'Faculty', 'Designation', 'Course', 'Sem', 'Students'];
                    const courseRows = reportData.map((item, index) => [
                        (index + 1).toString(),
                        `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                        item.faculty?.designation || 'N/A',
                        `${item.courseName} (${item.courseCode})`.substring(0, 25) + '...' || 'N/A',
                        item.semester || 'N/A',
                        item.numberOfStudents?.toString() || 'N/A'
                    ]);
                    addTableToPDF(doc, courseHeaders, courseRows);
                    break;

                case 'events':
                    const eventHeaders = ['#', 'Faculty', 'Designation', 'Event', 'Date', 'Participants', 'Report'];
                    const eventRows = reportData.map((item, index) => [
                        (index + 1).toString(),
                        `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                        item.faculty?.designation || 'N/A',
                        item.eventName?.substring(0, 30) + '...' || 'N/A',
                        formatDate(item.eventDate),
                        item.numberOfParticipants?.toString() || 'N/A',
                        item.reportUrl ? { text: 'View', link: item.reportUrl } : 'N/A'
                    ]);
                    addTableToPDF(doc, eventHeaders, eventRows);
                    break;

                case 'institutional-events':
                    const instEventHeaders = ['#', 'Event Name', 'Type', 'Participants', 'Start Date', 'End Date', 'Link'];
                    const instEventRows = reportData.map((item, index) => [
                        (index + 1).toString(),
                        item.eventName?.substring(0, 35) + '...' || 'N/A',
                        item.eventType?.toUpperCase() || 'N/A',
                        item.participantCount?.toString() || 'N/A',
                        formatDate(item.startDate),
                        formatDate(item.endDate),
                        item.activityReportUrl ? { text: 'View', link: item.activityReportUrl } : 'N/A'
                    ]);
                    addTableToPDF(doc, instEventHeaders, instEventRows);
                    break;


                case 'student-achievements':
                    let achievementHeaders = ['#', 'Student', 'Enrollment', 'Class', 'Title', 'Date', 'Link'];
                    if (departmentId) {
                        achievementHeaders = achievementHeaders.filter(h => h !== 'Class');
                    }
                    const achievementRows = reportData.map((item, index) => {
                        const row = [
                            (index + 1).toString(),
                            `${item.uploadedBy?.firstName || ''} ${item.uploadedBy?.lastName || ''}`.trim() || 'N/A',
                            item.uploadedBy?.enrollmentNumber || 'N/A',
                            item.department?.name || 'N/A',
                            item.title?.substring(0, 30) + '...' || 'N/A',
                            formatDate(item.createdAt),
                            item.fileUrl ? { text: 'View', link: item.fileUrl } : 'N/A'
                        ];
                        if (departmentId) {
                            row.splice(3, 1); // Remove 'Class' at index 3
                        }
                        return row;
                    });
                    addTableToPDF(doc, achievementHeaders, achievementRows);
                    break;

                case 'student-career':
                    let careerHeaders = ['#', 'Student', 'Enrollment', 'Class', 'Title', 'Date', 'Link'];
                    if (departmentId) {
                        careerHeaders = careerHeaders.filter(h => h !== 'Class');
                    }
                    const careerRows = reportData.map((item, index) => {
                        const row = [
                            (index + 1).toString(),
                            `${item.uploadedBy?.firstName || ''} ${item.uploadedBy?.lastName || ''}`.trim() || 'N/A',
                            item.uploadedBy?.enrollmentNumber || 'N/A',
                            item.department?.name || 'N/A',
                            item.title?.substring(0, 30) + '...' || 'N/A',
                            formatDate(item.createdAt),
                            item.fileUrl ? { text: 'View', link: item.fileUrl } : 'N/A'
                        ];
                        if (departmentId) {
                            row.splice(3, 1); // Remove 'Class' at index 3
                        }
                        return row;
                    });
                    addTableToPDF(doc, careerHeaders, careerRows);
                    break;
            }
        } else if (typeof reportData === 'object' && reportData !== null) {
            // Comprehensive report (multiple activity types)
            const totalRecords = Object.values(reportData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);

            // Table of Contents
            doc.fontSize(14).font('Helvetica-Bold').text('Table of Contents', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica');

            const sections = [
                { key: 'research', title: 'Research Publications' },
                { key: 'professionalDevelopment', title: 'Professional Development' },
                { key: 'institutionalEvents', title: 'Workshops/Seminars/Conferences Conducted' },
                { key: 'courses', title: 'Courses Taught' },
                { key: 'events', title: 'Events Organized' },
                { key: 'achievements', title: 'Student Achievements' },
                { key: 'career', title: 'Student Career Progression' }
            ];

            // Create TOC links
            sections.forEach(section => {
                if (reportData[section.key] && reportData[section.key].length > 0) {
                    doc.fillColor('blue').text(section.title, { goTo: section.key, underline: true });
                    doc.moveDown(0.2);
                }
            });
            doc.fillColor('black');
            doc.addPage();

            doc.fontSize(12).font('Helvetica-Bold').text(`Total Records: ${totalRecords}`);
            doc.moveDown();

            // Research Publications
            if (reportData.research && reportData.research.length > 0) {
                doc.addNamedDestination('research');
                doc.fontSize(14).font('Helvetica-Bold').text('Research Publications', { underline: true });
                doc.moveDown(0.5);
                const researchHeaders = ['#', 'Faculty', 'Designation', 'Title', 'Date', 'Link'];
                const researchRows = reportData.research.map((item, index) => [
                    (index + 1).toString(),
                    `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                    item.faculty?.designation || 'N/A',
                    item.title?.substring(0, 40) + '...' || 'N/A',
                    formatDate(item.publicationDate),
                    item.documentUrl ? { text: 'View', link: item.documentUrl } : 'N/A'
                ]);
                addTableToPDF(doc, researchHeaders, researchRows);
                doc.moveDown();
            }

            // Professional Development
            if (reportData.professionalDevelopment && reportData.professionalDevelopment.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('professionalDevelopment');
                doc.fontSize(14).font('Helvetica-Bold').text('Professional Development', { underline: true });
                doc.moveDown(0.5);
                const pdHeaders = ['#', 'Faculty', 'Designation', 'Program', 'Dates', 'Cert'];
                const pdRows = reportData.professionalDevelopment.map((item, index) => [
                    (index + 1).toString(),
                    `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                    item.faculty?.designation || 'N/A',
                    item.programName?.substring(0, 35) + '...' || 'N/A',
                    `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
                    item.certificateUrl ? { text: 'View', link: item.certificateUrl } : 'N/A'
                ]);
                addTableToPDF(doc, pdHeaders, pdRows);
                doc.moveDown();
            }

            // Institutional Events (Workshops/Seminars/Conferences)
            if (reportData.institutionalEvents && reportData.institutionalEvents.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('institutionalEvents');
                doc.fontSize(14).font('Helvetica-Bold').text('Workshops/Seminars/Conferences Conducted', { underline: true });
                doc.moveDown(0.5);
                const instEventHeaders = ['#', 'Event Name', 'Type', 'Participants', 'Dates'];
                const instEventRows = reportData.institutionalEvents.map((item, index) => [
                    (index + 1).toString(),
                    item.eventName?.substring(0, 40) + '...' || 'N/A',
                    item.eventType?.toUpperCase() || 'N/A',
                    item.participantCount?.toString() || 'N/A',
                    `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
                ]);
                addTableToPDF(doc, instEventHeaders, instEventRows);
                doc.moveDown();
            }

            // Courses Taught
            if (reportData.courses && reportData.courses.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('courses');
                doc.fontSize(14).font('Helvetica-Bold').text('Courses Taught', { underline: true });
                doc.moveDown(0.5);
                const courseHeaders = ['#', 'Faculty', 'Designation', 'Course', 'Sem'];
                const courseRows = reportData.courses.map((item, index) => [
                    (index + 1).toString(),
                    `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                    item.faculty?.designation || 'N/A',
                    `${item.courseName} (${item.courseCode})`.substring(0, 30) || 'N/A',
                    item.semester || 'N/A'
                ]);
                addTableToPDF(doc, courseHeaders, courseRows);
                doc.moveDown();
            }

            // Events Organized
            if (reportData.events && reportData.events.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('events');
                doc.fontSize(14).font('Helvetica-Bold').text('Events Organized', { underline: true });
                doc.moveDown(0.5);
                const eventHeaders = ['#', 'Faculty', 'Designation', 'Event', 'Date', 'Report'];
                const eventRows = reportData.events.map((item, index) => [
                    (index + 1).toString(),
                    `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim() || 'N/A',
                    item.faculty?.designation || 'N/A',
                    item.eventName?.substring(0, 40) + '...' || 'N/A',
                    formatDate(item.eventDate),
                    item.reportUrl ? { text: 'View', link: item.reportUrl } : 'N/A'
                ]);
                addTableToPDF(doc, eventHeaders, eventRows);
                doc.moveDown();
            }

            // Student Achievements
            if (reportData.achievements && reportData.achievements.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('achievements');
                doc.fontSize(14).font('Helvetica-Bold').text('Student Achievements', { underline: true });
                doc.moveDown(0.5);
                let achievementHeaders = ['#', 'Student', 'Enrollment', 'Class', 'Title', 'Date', 'Link'];
                if (departmentId) {
                    achievementHeaders = achievementHeaders.filter(h => h !== 'Class');
                }
                const achievementRows = reportData.achievements.map((item, index) => {
                    const row = [
                        (index + 1).toString(),
                        `${item.uploadedBy?.firstName || ''} ${item.uploadedBy?.lastName || ''}`.trim() || 'N/A',
                        item.uploadedBy?.enrollmentNumber || 'N/A',
                        item.department?.name || 'N/A',
                        item.title?.substring(0, 30) + '...' || 'N/A',
                        formatDate(item.createdAt),
                        item.fileUrl ? { text: 'View', link: item.fileUrl } : 'N/A'
                    ];
                    if (departmentId) {
                        row.splice(3, 1);
                    }
                    return row;
                });
                addTableToPDF(doc, achievementHeaders, achievementRows);
                doc.moveDown();
            }

            // Student Career
            if (reportData.career && reportData.career.length > 0) {
                if (doc.y > doc.page.height - 200) doc.addPage();
                doc.addNamedDestination('career');
                doc.fontSize(14).font('Helvetica-Bold').text('Student Career Progression', { underline: true });
                doc.moveDown(0.5);
                let careerHeaders = ['#', 'Student', 'Enrollment', 'Class', 'Title', 'Date', 'Link'];
                if (departmentId) {
                    careerHeaders = careerHeaders.filter(h => h !== 'Class');
                }
                const careerRows = reportData.career.map((item, index) => {
                    const row = [
                        (index + 1).toString(),
                        `${item.uploadedBy?.firstName || ''} ${item.uploadedBy?.lastName || ''}`.trim() || 'N/A',
                        item.uploadedBy?.enrollmentNumber || 'N/A',
                        item.department?.name || 'N/A',
                        item.title?.substring(0, 30) + '...' || 'N/A',
                        formatDate(item.createdAt),
                        item.fileUrl ? { text: 'View', link: item.fileUrl } : 'N/A'
                    ];
                    if (departmentId) {
                        row.splice(3, 1);
                    }
                    return row;
                });
                addTableToPDF(doc, careerHeaders, careerRows);
            }
        } else {
            doc.fontSize(12).text('No records found for the selected criteria.', { align: 'center' });
        }

        // Add Footer with Page Numbers
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).text(
                `Page ${i + 1} of ${range.count}`,
                50,
                doc.page.height - 50,
                { align: 'center' }
            );
        }

        doc.end();
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
});

export default router;

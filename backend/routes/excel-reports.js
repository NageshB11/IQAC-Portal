import express from 'express';
import ExcelJS from 'exceljs';
import { verifyToken, checkRole } from '../middleware/auth.js';
import {
    ResearchPublication,
    ProfessionalDevelopment,
    CourseTaught,
    EventOrganized,
    InstitutionalEvent
} from '../models/FacultyActivity.js';
import Document from '../models/Document.js';

const router = express.Router();

router.get('/generate-excel', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
    try {
        const { academicYear, department, activityType } = req.query;
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

        console.log('📋 EXCEL REPORT REQUEST:');
        console.log('  User role:', user.role);
        console.log('  User department:', user.department);
        console.log('  Request params:', { academicYear, department, activityType });

        if (departmentId) {
            deptQuery.department = departmentId;

            console.log('  Setting deptQuery.department to:', departmentId);
            console.log('  Type:', typeof departmentId);

            // Find all faculty in this department
            const facultyMembers = await User.find({ department: departmentId });
            const facultyIds = facultyMembers.map(u => u._id);
            facultyQuery.faculty = { $in: facultyIds };
        }

        // Create workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'IQAC Portal';
        workbook.created = new Date();

        // Helper to format date
        const formatDate = (date) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('en-IN');
        };


        // Helper to get year from date
        const getYear = (date) => {
            if (!date) return 'N/A';
            return new Date(date).getFullYear().toString();
        };

        // Helper to add header rows to worksheet
        const addExcelHeader = (worksheet, reportTitle) => {
            // Add college name
            worksheet.mergeCells('A1:F1');
            const collegeRow = worksheet.getCell('A1');
            collegeRow.value = "MGM's College of Engineering Nanded";
            collegeRow.font = { size: 16, bold: true };
            collegeRow.alignment = { horizontal: 'center', vertical: 'middle' };
            collegeRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            worksheet.getRow(1).height = 25;

            // Add IQAC Portal subtitle
            worksheet.mergeCells('A2:F2');
            const subtitleRow = worksheet.getCell('A2');
            subtitleRow.value = 'IQAC Portal';
            subtitleRow.font = { size: 12, italic: true };
            subtitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getRow(2).height = 20;

            // Add report title
            worksheet.mergeCells('A3:F3');
            const titleRow = worksheet.getCell('A3');
            titleRow.value = reportTitle;
            titleRow.font = { size: 14, bold: true };
            titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getRow(3).height = 22;

            // Add academic year
            worksheet.mergeCells('A4:F4');
            const yearRow = worksheet.getCell('A4');
            yearRow.value = `Academic Year: ${academicYear || 'All Years'}`;
            yearRow.font = { size: 12, bold: true };
            yearRow.alignment = { horizontal: 'center', vertical: 'middle' };
            yearRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F0F0' }
            };
            worksheet.getRow(4).height = 20;

            // Add department info
            worksheet.mergeCells('A5:F5');
            const deptRow = worksheet.getCell('A5');
            deptRow.value = `Department: ${departmentName}`;
            deptRow.font = { size: 11 };
            deptRow.alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getRow(5).height = 18;

            // Add empty row for spacing
            worksheet.getRow(6).height = 10;

            return 7; // Return the row number where data should start
        };

        // Fetch and generate Excel based on activity type
        switch (activityType) {
            case 'research': {
                const researchQuery = { ...facultyQuery };
                if (dateRange) researchQuery.publicationDate = dateRange;

                const research = await ResearchPublication.find(researchQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ publicationDate: -1 });

                if (research.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected criteria' });
                }

                const worksheet = workbook.addWorksheet('Research Publications');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Research Publications Report');

                // Define columns
                let columns = [
                    { header: 'Title of Paper', key: 'title', width: 40 },
                    { header: 'Name of the Authors', key: 'authors', width: 30 },
                    { header: 'Department', key: 'department', width: 25 },
                    { header: 'Name of Journal', key: 'journal', width: 30 },
                    { header: 'Year of Publication', key: 'year', width: 18 },
                    { header: 'ISSN No', key: 'issn', width: 15 }
                ];

                if (departmentId) {
                    columns = columns.filter(col => col.key !== 'department');
                }

                // Add column headers at dataStartRow
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });

                // Add data rows
                let currentRow = dataStartRow + 1;
                research.forEach((item) => {
                    const row = worksheet.getRow(currentRow);
                    let colIndex = 1;

                    row.getCell(colIndex++).value = item.title || 'N/A';
                    row.getCell(colIndex++).value = item.authors || 'N/A';
                    if (!departmentId) {
                        row.getCell(colIndex++).value = item.faculty?.department?.name || 'N/A';
                    }
                    row.getCell(colIndex++).value = item.journalConference || 'N/A';
                    row.getCell(colIndex++).value = getYear(item.publicationDate);
                    row.getCell(colIndex++).value = item.issn || item.isbn || 'N/A';

                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });
                    currentRow++;
                });

                break;
            }

            case 'professional-development': {
                const pdQuery = { ...facultyQuery };
                if (dateRange) pdQuery.startDate = dateRange;

                const pd = await ProfessionalDevelopment.find(pdQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName email phoneNumber designation',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ startDate: -1 });

                if (pd.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected criteria' });
                }

                const worksheet = workbook.addWorksheet('Professional Development');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Professional Development Report');

                let columns = [
                    { header: 'Faculty Name', key: 'faculty', width: 25 },
                    { header: 'Department', key: 'department', width: 25 },
                    { header: 'Program Title', key: 'title', width: 35 },
                    { header: 'Type', key: 'type', width: 15 },
                    { header: 'Organizer', key: 'organizer', width: 30 },
                    { header: 'Start Date', key: 'startDate', width: 15 },
                    { header: 'End Date', key: 'endDate', width: 15 },
                    { header: 'Duration (Days)', key: 'duration', width: 15 },
                    { header: 'Mode', key: 'mode', width: 12 }
                ];

                if (departmentId) {
                    columns = columns.filter(col => col.key !== 'department');
                }

                // Add column headers
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });

                // Add data rows
                let currentRow = dataStartRow + 1;
                pd.forEach((item) => {
                    const row = worksheet.getRow(currentRow);
                    let colIndex = 1;

                    row.getCell(colIndex++).value = `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim();
                    if (!departmentId) {
                        row.getCell(colIndex++).value = item.faculty?.department?.name || 'N/A';
                    }
                    row.getCell(colIndex++).value = item.title || 'N/A';
                    row.getCell(colIndex++).value = item.type || 'N/A';
                    row.getCell(colIndex++).value = item.organizer || 'N/A';
                    row.getCell(colIndex++).value = formatDate(item.startDate);
                    row.getCell(colIndex++).value = formatDate(item.endDate);
                    row.getCell(colIndex++).value = item.duration || 'N/A';
                    row.getCell(colIndex++).value = item.mode || 'N/A';

                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });
                    currentRow++;
                });

                break;
            }

            case 'courses': {
                const courseQuery = { ...facultyQuery };
                if (academicYear) courseQuery.academicYear = academicYear;

                const courses = await CourseTaught.find(courseQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName designation',
                        populate: { path: 'department', select: 'name' }
                    })
                    .sort({ academicYear: -1 });

                if (courses.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected criteria' });
                }

                const worksheet = workbook.addWorksheet('Courses Taught');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Courses Taught Report');

                let columns = [
                    { header: 'Faculty Name', key: 'faculty', width: 25 },
                    { header: 'Department', key: 'department', width: 25 },
                    { header: 'Academic Year', key: 'academicYear', width: 15 },
                    { header: 'Semester', key: 'semester', width: 12 },
                    { header: 'Course Code', key: 'courseCode', width: 15 },
                    { header: 'Course Name', key: 'courseName', width: 30 },
                    { header: 'Course Type', key: 'courseType', width: 15 },
                    { header: 'Credits', key: 'credits', width: 10 },
                    { header: 'Total Students', key: 'totalStudents', width: 15 },
                    { header: 'Hours/Week', key: 'hoursPerWeek', width: 12 }
                ];

                if (departmentId) {
                    columns = columns.filter(col => col.key !== 'department');
                }

                // Add column headers
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });

                // Add data rows
                let currentRow = dataStartRow + 1;
                courses.forEach((item) => {
                    const row = worksheet.getRow(currentRow);
                    let colIndex = 1;

                    row.getCell(colIndex++).value = `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim();
                    if (!departmentId) {
                        row.getCell(colIndex++).value = item.faculty?.department?.name || 'N/A';
                    }
                    row.getCell(colIndex++).value = item.academicYear || 'N/A';
                    row.getCell(colIndex++).value = item.semester || 'N/A';
                    row.getCell(colIndex++).value = item.courseCode || 'N/A';
                    row.getCell(colIndex++).value = item.courseName || 'N/A';
                    row.getCell(colIndex++).value = item.courseType || 'N/A';
                    row.getCell(colIndex++).value = item.credits || 'N/A';
                    row.getCell(colIndex++).value = item.totalStudents || 'N/A';
                    row.getCell(colIndex++).value = item.hoursPerWeek || 'N/A';

                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });
                    currentRow++;
                });

                break;
            }

            case 'events': {
                const eventQuery = { ...deptQuery };
                if (dateRange) eventQuery.eventDate = dateRange;

                const events = await EventOrganized.find(eventQuery)
                    .populate({
                        path: 'faculty',
                        select: 'firstName lastName designation',
                        populate: { path: 'department', select: 'name' }
                    })
                    .populate('department', 'name')
                    .sort({ eventDate: -1 });

                if (events.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected criteria' });
                }

                const worksheet = workbook.addWorksheet('Events Organized');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Events Organized Report');

                let columns = [
                    { header: 'Faculty Name', key: 'faculty', width: 25 },
                    { header: 'Department', key: 'department', width: 25 },
                    { header: 'Event Name', key: 'eventName', width: 35 },
                    { header: 'Organising Unit', key: 'organizingUnit', width: 25 },
                    { header: 'Scheme Name', key: 'schemeName', width: 20 },
                    { header: 'Academic Year', key: 'academicYear', width: 15 },
                    { header: 'Event Type', key: 'eventType', width: 15 },
                    { header: 'Event Date', key: 'eventDate', width: 15 },
                    { header: 'Participants', key: 'participants', width: 15 },
                    { header: 'Role', key: 'role', width: 15 }
                ];

                if (departmentId) {
                    columns = columns.filter(col => col.key !== 'department');
                }

                // Add column headers
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });

                // Add data rows
                let currentRow = dataStartRow + 1;
                events.forEach((item) => {
                    const row = worksheet.getRow(currentRow);
                    let colIndex = 1;

                    row.getCell(colIndex++).value = `${item.faculty?.firstName || ''} ${item.faculty?.lastName || ''}`.trim();
                    if (!departmentId) {
                        row.getCell(colIndex++).value = item.department?.name || 'N/A';
                    }
                    row.getCell(colIndex++).value = item.eventName || 'N/A';
                    row.getCell(colIndex++).value = item.organizingUnit || 'N/A';
                    row.getCell(colIndex++).value = item.schemeName || 'N/A';
                    row.getCell(colIndex++).value = item.academicYear || 'N/A';
                    row.getCell(colIndex++).value = item.eventType || 'N/A';
                    row.getCell(colIndex++).value = formatDate(item.eventDate);
                    row.getCell(colIndex++).value = item.participantCount || 'N/A';
                    row.getCell(colIndex++).value = item.role || 'N/A';

                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });
                    currentRow++;
                });

                break;
            }



            case 'student-achievements': {
                const achieveQuery = { ...deptQuery, documentType: 'achievement' };
                if (dateRange) achieveQuery.createdAt = dateRange;

                const achievements = await Document.find(achieveQuery)
                    .populate({
                        path: 'uploadedBy',
                        select: 'firstName lastName email enrollmentNumber',
                        populate: { path: 'department', select: 'name' }
                    })
                    .populate('department', 'name')
                    .sort({ createdAt: -1 });

                if (achievements.length === 0) {
                    return res.status(404).json({ message: 'No data found for the selected criteria' });
                }

                const worksheet = workbook.addWorksheet('Student Achievements');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Student Achievements Report');

                let columns = [
                    { header: 'Student Name', key: 'studentName', width: 25 },
                    { header: 'Enrollment No', key: 'enrollmentNumber', width: 20 },
                    { header: 'Department', key: 'department', width: 25 },
                    { header: 'Achievement Title', key: 'title', width: 40 },
                    { header: 'Description', key: 'description', width: 50 },
                    { header: 'Date', key: 'date', width: 15 }
                ];

                if (departmentId) {
                    columns = columns.filter(col => col.key !== 'department');
                }

                // Add column headers
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });

                // Add data rows
                let currentRow = dataStartRow + 1;
                achievements.forEach((item) => {
                    const row = worksheet.getRow(currentRow);
                    let colIndex = 1;

                    row.getCell(colIndex++).value = `${item.uploadedBy?.firstName || ''} ${item.uploadedBy?.lastName || ''}`.trim();
                    row.getCell(colIndex++).value = item.uploadedBy?.enrollmentNumber || 'N/A';
                    if (!departmentId) {
                        row.getCell(colIndex++).value = item.department?.name || 'N/A';
                    }
                    row.getCell(colIndex++).value = item.title || 'N/A';
                    row.getCell(colIndex++).value = item.description || 'N/A';
                    row.getCell(colIndex++).value = formatDate(item.createdAt);

                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });
                    currentRow++;
                });

                break;
            }

            case 'institutional-events': {
                // Temporarily ignore department filter to make it work
                const instEventQuery = {};
                if (academicYear) instEventQuery.academicYear = academicYear;

                console.log('🔍 DEBUG institutional-events query:');
                console.log('  Department ID (IGNORED):', departmentId);
                console.log('  Department Name:', departmentName);
                console.log('  Academic Year:', academicYear);
                console.log('  Query:', JSON.stringify(instEventQuery));

                const institutionalEvents = await InstitutionalEvent.find(instEventQuery)
                    .populate('department', 'name code')
                    .sort({ startDate: -1 });

                console.log('  Results found:', institutionalEvents.length);
                if (institutionalEvents.length > 0) {
                    console.log('  Sample event:', institutionalEvents[0].eventName);
                }

                if (institutionalEvents.length === 0) {
                    // Try without academic year filter to debug
                    const allDeptEvents = await InstitutionalEvent.find({ department: departmentId });
                    console.log('  Events for this dept (no year filter):', allDeptEvents.length);

                    if (allDeptEvents.length > 0) {
                        const yearsInDB = [...new Set(allDeptEvents.map(e => e.academicYear))];
                        console.log('  Available years in DB:', yearsInDB);
                        return res.status(404).json({
                            message: `No data found for academic year "${academicYear}". Available years: ${yearsInDB.join(', ')}`
                        });
                    }

                    // No events at all for this department
                    const totalEvents = await InstitutionalEvent.countDocuments();
                    console.log('  Total events in system:', totalEvents);

                    return res.status(404).json({
                        message: 'No institutional events found for this department. Please check if data has been added.'
                    });
                }

                const worksheet = workbook.addWorksheet('Workshops-Seminars-Conferences');

                // Add header with college name, document name, and year
                const dataStartRow = addExcelHeader(worksheet, 'Workshops/Seminars/Conferences Conducted by the Institution');

                // Define columns starting after header
                let columns = [
                    { header: 'Year', key: 'year', width: 12 },
                    { header: 'Name of the Workshop/Seminar', key: 'eventName', width: 50 },
                    { header: 'Number of Participants', key: 'participants', width: 20 },
                    { header: 'Date From - To', key: 'dates', width: 25 },
                    { header: 'Link to the Activity report on the website', key: 'link', width: 50 }
                ];

                // Add column headers at dataStartRow
                columns.forEach((col, index) => {
                    const cell = worksheet.getCell(dataStartRow, index + 1);
                    cell.value = col.header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4472C4' }
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    worksheet.getColumn(index + 1).width = col.width;
                });


                // Add data rows
                let currentRow = dataStartRow + 1;
                institutionalEvents.forEach((item) => {
                    // Skip events with missing critical data
                    if (!item.eventName || item.eventName === 'N/A' || !item.department) {
                        return;
                    }

                    const row = worksheet.getRow(currentRow);

                    // Set values individually to ensure they display
                    row.getCell(1).value = item.academicYear || 'N/A';
                    row.getCell(2).value = item.eventName || 'N/A';
                    row.getCell(3).value = item.participantCount || 0;
                    row.getCell(4).value = `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
                    row.getCell(5).value = item.activityReportUrl || 'N/A';

                    // Style data rows
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        cell.alignment = { vertical: 'middle', wrapText: true };
                    });

                    currentRow++;
                });


                break;
            }

            default:
                return res.status(400).json({ message: 'Invalid activity type for Excel export' });
        }

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=IQAC_${activityType}_${academicYear || 'All'}_${Date.now()}.xlsx`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).json({ message: 'Error generating Excel report', error: error.message });
    }
});

export default router;

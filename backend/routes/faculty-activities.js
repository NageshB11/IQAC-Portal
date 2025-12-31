import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    ResearchPublication,
    ProfessionalDevelopment,
    CourseTaught,
    EventOrganized,
    InstitutionalEvent
} from '../models/FacultyActivity.js';
import { verifyToken, checkRole } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/faculty-activities/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ==================== RESEARCH PUBLICATIONS ====================

// Create research publication
router.post('/research', verifyToken, checkRole(['faculty']), upload.single('document'), async (req, res) => {
    try {
        const publicationData = {
            ...req.body,
            faculty: req.userId,
            createdBy: req.userId,
            documentUrl: req.file ? `/uploads/faculty-activities/${req.file.filename}` : undefined,
            status: 'approved'
        };

        // Parse indexing if it's a JSON string
        if (publicationData.indexing && typeof publicationData.indexing === 'string') {
            try {
                publicationData.indexing = JSON.parse(publicationData.indexing);
            } catch (e) {
                // If parsing fails, treat it as a single value array
                publicationData.indexing = [publicationData.indexing];
            }
        }

        // Remove empty optional fields to prevent validation errors
        if (!publicationData.impactFactor || publicationData.impactFactor === '') {
            delete publicationData.impactFactor;
        }
        if (!publicationData.citationCount || publicationData.citationCount === '') {
            delete publicationData.citationCount;
        }
        if (!publicationData.doi || publicationData.doi === '') {
            delete publicationData.doi;
        }
        if (!publicationData.issn || publicationData.issn === '') {
            delete publicationData.issn;
        }
        if (!publicationData.isbn || publicationData.isbn === '') {
            delete publicationData.isbn;
        }

        const publication = new ResearchPublication(publicationData);
        await publication.save();

        await logActivity(
            req.userId,
            'CREATE',
            'ResearchPublication',
            publication._id,
            { title: publication.title }
        );

        res.status(201).json({ message: 'Research publication added successfully', publication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all research publications for a faculty
router.get('/research', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let query = {};
        if (user.role === 'faculty') {
            query.faculty = req.userId;
        } else if (user.role === 'coordinator') {
            // Get all faculty in coordinator's department
            const facultyInDept = await User.find({ department: user.department, role: 'faculty' });
            query.faculty = { $in: facultyInDept.map(f => f._id) };
        }
        // Admin sees all

        const publications = await ResearchPublication.find(query)
            .populate('faculty', 'firstName lastName email')
            .sort({ publicationDate: -1 });
        res.json(publications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update research publication
router.put('/research/:id', verifyToken, checkRole(['faculty']), upload.single('document'), async (req, res) => {
    try {
        const publication = await ResearchPublication.findOne({ _id: req.params.id, faculty: req.userId });

        if (!publication) {
            return res.status(404).json({ message: 'Publication not found or unauthorized' });
        }

        // Parse indexing if it's a JSON string
        if (req.body.indexing && typeof req.body.indexing === 'string') {
            try {
                req.body.indexing = JSON.parse(req.body.indexing);
            } catch (e) {
                req.body.indexing = [req.body.indexing];
            }
        }

        // Remove empty optional fields to prevent validation errors
        if (!req.body.impactFactor || req.body.impactFactor === '') {
            delete req.body.impactFactor;
        }
        if (!req.body.citationCount || req.body.citationCount === '') {
            delete req.body.citationCount;
        }
        if (!req.body.doi || req.body.doi === '') {
            delete req.body.doi;
        }
        if (!req.body.issn || req.body.issn === '') {
            delete req.body.issn;
        }
        if (!req.body.isbn || req.body.isbn === '') {
            delete req.body.isbn;
        }

        Object.assign(publication, req.body);
        if (req.file) {
            publication.documentUrl = `/uploads/faculty-activities/${req.file.filename}`;
        }
        publication.updatedBy = req.userId;
        publication.updatedAt = new Date();

        await publication.save();

        await logActivity(
            req.userId,
            'UPDATE',
            'ResearchPublication',
            publication._id,
            { title: publication.title, changes: req.body }
        );

        res.json({ message: 'Publication updated successfully', publication });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete research publication
router.delete('/research/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const publication = await ResearchPublication.findOneAndDelete({ _id: req.params.id, faculty: req.userId });

        if (!publication) {
            return res.status(404).json({ message: 'Publication not found or unauthorized' });
        }

        await logActivity(
            req.userId,
            'DELETE',
            'ResearchPublication',
            req.params.id,
            { title: publication.title }
        );

        res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== PROFESSIONAL DEVELOPMENT ====================

// Create professional development entry
router.post('/professional-development', verifyToken, checkRole(['faculty']), upload.single('certificate'), async (req, res) => {
    try {
        const pdData = {
            ...req.body,
            faculty: req.userId,
            createdBy: req.userId,
            certificateUrl: req.file ? `/uploads/faculty-activities/${req.file.filename}` : undefined
        };

        const pd = new ProfessionalDevelopment(pdData);
        await pd.save();

        await logActivity(
            req.userId,
            'CREATE',
            'ProfessionalDevelopment',
            pd._id,
            { title: pd.title }
        );

        res.status(201).json({ message: 'Professional development activity added successfully', pd });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all professional development activities
router.get('/professional-development', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let query = {};
        if (user.role === 'faculty') {
            query.faculty = req.userId;
        } else if (user.role === 'coordinator') {
            const facultyInDept = await User.find({ department: user.department, role: 'faculty' });
            query.faculty = { $in: facultyInDept.map(f => f._id) };
        }

        const activities = await ProfessionalDevelopment.find(query)
            .populate('faculty', 'firstName lastName email')
            .sort({ startDate: -1 });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update professional development
router.put('/professional-development/:id', verifyToken, checkRole(['faculty']), upload.single('certificate'), async (req, res) => {
    try {
        const pd = await ProfessionalDevelopment.findOne({ _id: req.params.id, faculty: req.userId });

        if (!pd) {
            return res.status(404).json({ message: 'Activity not found or unauthorized' });
        }

        Object.assign(pd, req.body);
        if (req.file) {
            pd.certificateUrl = `/uploads/faculty-activities/${req.file.filename}`;
        }
        pd.updatedBy = req.userId;
        pd.updatedAt = new Date();

        await pd.save();

        await logActivity(
            req.userId,
            'UPDATE',
            'ProfessionalDevelopment',
            pd._id,
            { title: pd.title, changes: req.body }
        );

        res.json({ message: 'Activity updated successfully', pd });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete professional development
router.delete('/professional-development/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const pd = await ProfessionalDevelopment.findOneAndDelete({ _id: req.params.id, faculty: req.userId });

        if (!pd) {
            return res.status(404).json({ message: 'Activity not found or unauthorized' });
        }

        await logActivity(
            req.userId,
            'DELETE',
            'ProfessionalDevelopment',
            req.params.id,
            { title: pd.title }
        );

        res.json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== COURSES TAUGHT ====================

// Create course taught entry
router.post('/courses', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            faculty: req.userId,
            createdBy: req.userId
        };

        const course = new CourseTaught(courseData);
        await course.save();

        await logActivity(
            req.userId,
            'CREATE',
            'CourseTaught',
            course._id,
            { courseName: course.courseName, courseCode: course.courseCode }
        );

        res.status(201).json({ message: 'Course added successfully', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all courses taught
router.get('/courses', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let query = {};
        if (user.role === 'faculty') {
            query.faculty = req.userId;
        } else if (user.role === 'coordinator') {
            const facultyInDept = await User.find({ department: user.department, role: 'faculty' });
            query.faculty = { $in: facultyInDept.map(f => f._id) };
        }

        const courses = await CourseTaught.find(query)
            .populate('faculty', 'firstName lastName email')
            .sort({ academicYear: -1, semester: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update course taught
router.put('/courses/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const course = await CourseTaught.findOne({ _id: req.params.id, faculty: req.userId });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }

        Object.assign(course, req.body);
        course.updatedBy = req.userId;
        course.updatedAt = new Date();

        await course.save();

        await logActivity(
            req.userId,
            'UPDATE',
            'CourseTaught',
            course._id,
            { courseName: course.courseName, changes: req.body }
        );

        res.json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete course taught
router.delete('/courses/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const course = await CourseTaught.findOneAndDelete({ _id: req.params.id, faculty: req.userId });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or unauthorized' });
        }

        await logActivity(
            req.userId,
            'DELETE',
            'CourseTaught',
            req.params.id,
            { courseName: course.courseName }
        );

        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== EVENTS ORGANIZED ====================

// Create event organized entry
router.post('/events', verifyToken, checkRole(['faculty']), upload.array('photos', 5), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        const eventData = {
            ...req.body,
            faculty: req.userId,
            department: user.department,
            createdBy: req.userId,
            photosUrl: req.files ? req.files.map(f => `/uploads/faculty-activities/${f.filename}`) : []
        };

        const event = new EventOrganized(eventData);
        await event.save();

        await logActivity(
            req.userId,
            'CREATE',
            'EventOrganized',
            event._id,
            { eventName: event.eventName }
        );

        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all events organized
router.get('/events', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let query = {};
        if (user.role === 'faculty') {
            query.faculty = req.userId;
        } else if (user.role === 'coordinator') {
            query.department = user.department;
        }

        const events = await EventOrganized.find(query)
            .populate('faculty', 'firstName lastName email')
            .populate('department', 'name code')
            .sort({ eventDate: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update event organized
router.put('/events/:id', verifyToken, checkRole(['faculty']), upload.array('photos', 5), async (req, res) => {
    try {
        const event = await EventOrganized.findOne({ _id: req.params.id, faculty: req.userId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        Object.assign(event, req.body);
        if (req.files && req.files.length > 0) {
            event.photosUrl = req.files.map(f => `/uploads/faculty-activities/${f.filename}`);
        }
        event.updatedBy = req.userId;
        event.updatedAt = new Date();

        await event.save();

        await logActivity(
            req.userId,
            'UPDATE',
            'EventOrganized',
            event._id,
            { eventName: event.eventName, changes: req.body }
        );

        res.json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete event organized
router.delete('/events/:id', verifyToken, checkRole(['faculty']), async (req, res) => {
    try {
        const event = await EventOrganized.findOneAndDelete({ _id: req.params.id, faculty: req.userId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        await logActivity(
            req.userId,
            'DELETE',
            'EventOrganized',
            req.params.id,
            { eventName: event.eventName }
        );

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== INSTITUTIONAL EVENTS ====================

// Get all institutional events (workshops/seminars/conferences)
router.get('/institutional-events', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let query = {};
        if (user.role === 'coordinator') {
            query.department = user.department;
        }
        // Admin sees all, faculty sees all (institutional events are department-level, not faculty-level)

        const events = await InstitutionalEvent.find(query)
            .populate('department', 'name code')
            .sort({ startDate: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// ==================== DASHBOARD STATISTICS ====================

// Get faculty activity statistics
router.get('/statistics', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        let facultyId = req.userId;
        let facultyIds = [req.userId];

        if (user.role === 'coordinator') {
            const facultyInDept = await User.find({ department: user.department, role: 'faculty' });
            facultyIds = facultyInDept.map(f => f._id);
        }
        // Admin logic removed from here as we will handle it in query construction

        let query = {};
        if (user.role === 'faculty') {
            query = { faculty: req.userId };
        } else if (user.role === 'coordinator') {
            // Coordinator sees their department faculty AND themselves (if they created any)
            facultyIds.push(req.userId);
            query = { faculty: { $in: facultyIds } };
        } else if (user.role === 'admin') {
            query = {}; // Admin sees ALL data
        }

        const institutionalEventsQuery = user.role === 'coordinator' ? { department: user.department } : {};
        console.log('📊 Statistics Query:');
        console.log('  User role:', user.role);
        console.log('  Main Query:', JSON.stringify(query));
        console.log('  Inst Event Query:', JSON.stringify(institutionalEventsQuery));

        const [
            researchCount,
            pdCount,
            coursesCount,
            eventsCount,
            institutionalEventsCount
        ] = await Promise.all([
            ResearchPublication.countDocuments(query),
            ProfessionalDevelopment.countDocuments(query),
            CourseTaught.countDocuments(query),
            EventOrganized.countDocuments(query),
            InstitutionalEvent.countDocuments(institutionalEventsQuery)
        ]);

        console.log('  Institutional Events Count:', institutionalEventsCount);

        res.json({
            research: researchCount,
            professionalDevelopment: pdCount,
            courses: coursesCount,
            events: eventsCount,
            institutionalEvents: institutionalEventsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

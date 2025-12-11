import express from 'express';
import path from 'path';
import fs from 'fs';
import {
    ResearchPublication,
    ProfessionalDevelopment,
    CourseTaught,
    EventOrganized,
    InstitutionalEvent
} from '../models/FacultyActivity.js';
import Document from '../models/Document.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Download research publication document
router.get('/research/:id/download', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const publication = await ResearchPublication.findById(req.params.id);

        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        if (!publication.documentUrl) {
            return res.status(404).json({ message: 'No document attached to this publication' });
        }

        // Check permissions
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (user.role === 'coordinator') {
            // Coordinator can only download from their department
            const facultyUser = await User.findById(publication.faculty);
            if (!facultyUser || facultyUser.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: 'Unauthorized to download this document' });
            }
        } else if (user.role === 'faculty') {
            // Faculty can only download their own documents
            if (publication.faculty.toString() !== req.userId) {
                return res.status(403).json({ message: 'Unauthorized to download this document' });
            }
        }
        // Admin can download any document

        // Construct file path
        const filePath = path.join(process.cwd(), publication.documentUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Get original filename
        const originalName = `${publication.title.substring(0, 50)}_document${path.extname(filePath)}`;

        // Send file
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error downloading file' });
                }
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Download professional development certificate
router.get('/professional-development/:id/download', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const pd = await ProfessionalDevelopment.findById(req.params.id);

        if (!pd) {
            return res.status(404).json({ message: 'Professional development record not found' });
        }

        if (!pd.certificateUrl) {
            return res.status(404).json({ message: 'No certificate attached to this record' });
        }

        // Check permissions
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (user.role === 'coordinator') {
            // Coordinator can only download from their department
            const facultyUser = await User.findById(pd.faculty);
            if (!facultyUser || facultyUser.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: 'Unauthorized to download this certificate' });
            }
        } else if (user.role === 'faculty') {
            // Faculty can only download their own certificates
            if (pd.faculty.toString() !== req.userId) {
                return res.status(403).json({ message: 'Unauthorized to download this certificate' });
            }
        }
        // Admin can download any certificate

        // Construct file path
        const filePath = path.join(process.cwd(), pd.certificateUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Get original filename
        const originalName = `${pd.title.substring(0, 50)}_certificate${path.extname(filePath)}`;

        // Send file
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error downloading file' });
                }
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Download event report
router.get('/events/:id/download-report', verifyToken, checkRole(['faculty', 'coordinator', 'admin']), async (req, res) => {
    try {
        const event = await EventOrganized.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!event.reportUrl) {
            return res.status(404).json({ message: 'No report attached to this event' });
        }

        // Check permissions
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (user.role === 'coordinator') {
            // Coordinator can only download from their department
            if (event.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: 'Unauthorized to download this report' });
            }
        } else if (user.role === 'faculty') {
            // Faculty can only download their own event reports
            if (event.faculty.toString() !== req.userId) {
                return res.status(403).json({ message: 'Unauthorized to download this report' });
            }
        }
        // Admin can download any report

        // Construct file path
        const filePath = path.join(process.cwd(), event.reportUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Get original filename
        const originalName = `${event.eventName.substring(0, 50)}_report${path.extname(filePath)}`;

        // Send file
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error downloading file' });
                }
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Download institutional event report
router.get('/institutional-events/:id/download', verifyToken, checkRole(['coordinator', 'admin']), async (req, res) => {
    try {
        const event = await InstitutionalEvent.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Institutional event not found' });
        }

        if (!event.activityReportUrl) {
            return res.status(404).json({ message: 'No report attached to this event' });
        }

        // Check permissions
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId);

        if (user.role === 'coordinator') {
            // Coordinator can only download from their department
            if (event.department.toString() !== user.department.toString()) {
                return res.status(403).json({ message: 'Unauthorized to download this report' });
            }
        }
        // Admin can download any report

        // Construct file path
        const filePath = path.join(process.cwd(), event.activityReportUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        // Get original filename
        const originalName = `${event.eventName.substring(0, 50)}_report${path.extname(filePath)}`;

        // Send file
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error('Download error:', err);
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error downloading file' });
                }
            }
        });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;

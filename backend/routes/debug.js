import express from 'express';
import { EventOrganized, InstitutionalEvent, ResearchPublication } from '../models/FacultyActivity.js';

const router = express.Router();

router.get('/debug-stats', async (req, res) => {
    try {
        const events = await EventOrganized.countDocuments({});
        const inst = await InstitutionalEvent.countDocuments({});
        const research = await ResearchPublication.countDocuments({});

        console.log('DEBUG STATS:', { events, inst, research });

        res.json({
            events,
            inst,
            research,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

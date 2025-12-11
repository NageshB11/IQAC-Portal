import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/test-query', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const { InstitutionalEvent } = await import('./models/FacultyActivity.js');
        const Department = (await import('./models/Department.js')).default;

        // Get CSE department
        const cseDept = await Department.findOne({ code: 'CSE' });

        // Test query
        const query = {
            department: cseDept._id,
            academicYear: '2023-2024'
        };

        console.log('Query:', query);
        console.log('CSE Dept ID:', cseDept._id.toString());

        const events = await InstitutionalEvent.find(query);

        res.json({
            query: query,
            cseDeptId: cseDept._id.toString(),
            eventCount: events.length,
            events: events.map(e => ({
                name: e.eventName,
                year: e.academicYear,
                deptId: e.department.toString()
            }))
        });

        await mongoose.connection.close();
    } catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

app.listen(5001, () => {
    console.log('Test server running on http://localhost:5001');
    console.log('Visit: http://localhost:5001/test-query');
});

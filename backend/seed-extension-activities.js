import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EventOrganized } from './models/FacultyActivity.js';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const activities = [
    { name: "Celebration of International Yoga day", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 42, type: "cultural", date: "2023-06-21" },
    { name: "Stress Management activity", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 76, type: "seminar", date: "2023-08-15" },
    { name: "Tree Plantation Programme", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 37, type: "other", date: "2023-07-05" },
    { name: 'Paper model making workshop on "Chandrayan -III"', unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 42, type: "workshop", date: "2023-08-25" },
    { name: "Eco-Friendly Ganesh Idol Making Workshop", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 57, type: "workshop", date: "2023-09-15" },
    { name: "Campus Cleaning Programme", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 76, type: "other", date: "2023-10-02" },
    { name: "Nirmalya Sankalan Prakalp", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 76, type: "other", date: "2023-09-29" },
    { name: "Trek Activity : Kalsubai Peak, Durgwadi Waterfall, Trimbekeshwar & harihargad", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 53, type: "other", date: "2024-01-10" },
    { name: "Traffic awareness programme", unit: "MGM", scheme: "Tech Life", year: "2023-2024", count: 73, type: "seminar", date: "2024-02-04" },
    { name: "Blood Donation Camp", unit: "MGM", scheme: "NSS", year: "2023-2024", count: 118, type: "other", date: "2023-12-15" },
    { name: "Campus Cleaning Activity", unit: "MGM", scheme: "NSS(Swachh Bharat Abhiyan)", year: "2023-2024", count: 94, type: "other", date: "2023-10-02" }
];

async function seedActivities() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.error('✗ MONGODB_URI not set in .env file');
            process.exit(1);
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Find a suitable department (CSE)
        const cseDept = await Department.findOne({ code: 'CSE' });
        if (!cseDept) {
            throw new Error('CSE Department not found. Please ensure database is seeded with departments.');
        }

        // Find the coordinator for this department to assign events to
        const coordinator = await User.findOne({ department: cseDept._id, role: 'coordinator' });
        if (!coordinator) {
            throw new Error('CSE Coordinator not found. Please ensure database is seeded with users.');
        }

        console.log(`Using Department: ${cseDept.name}`);
        console.log(`Using Coordinator: ${coordinator.firstName} ${coordinator.lastName}`);

        let addedCount = 0;

        for (const activity of activities) {
            // Check if exists to avoid duplicates
            const exists = await EventOrganized.findOne({
                eventName: activity.name,
                academicYear: activity.year,
                department: cseDept._id
            });

            if (exists) {
                console.log(`Skipping existing activity: ${activity.name}`);
                continue;
            }

            const newEvent = new EventOrganized({
                faculty: coordinator._id,
                department: cseDept._id,
                eventName: activity.name,
                eventType: activity.type,
                eventDate: new Date(activity.date),
                duration: 4, // Default assumption
                participantCount: activity.count,
                role: 'coordinator', // Assigned to the coordinator
                organizingUnit: activity.unit,
                schemeName: activity.scheme,
                academicYear: activity.year,
                description: `Activity conducted under ${activity.scheme} by ${activity.unit}`,
                status: 'approved',
                createdBy: coordinator._id
            });

            await newEvent.save();
            console.log(`✓ Added activity: ${activity.name}`);
            addedCount++;
        }

        console.log(`\nSuccessfully added ${addedCount} activities.`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('Error seeding activities:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seedActivities();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ProfessionalDevelopment } from './models/FacultyActivity.js';
import User from './models/User.js';

dotenv.config();

// Dummy professional development activities based on the uploaded image
const professionalDevelopmentData = [
    {
        title: 'Concrete Mix Design Workshop',
        type: 'workshop',
        organizer: 'Institution',
        duration: 1,
        startDate: new Date('2024-05-22'),
        endDate: new Date('2024-05-22'),
        mode: 'offline',
        participants: 107,
        description: 'Workshop on concrete mix design conducted by the institution',
        activityReportUrl: 'https://mgmcen.ac.in/civil-engineering/departmental-activity.html'
    },
    {
        title: 'Two Days Hands-on Workshop on Front-end Development',
        type: 'workshop',
        organizer: 'Institution',
        duration: 2,
        startDate: new Date('2024-02-26'),
        endDate: new Date('2024-02-27'),
        mode: 'offline',
        participants: 70,
        description: 'Two-day hands-on workshop focusing on front-end development technologies',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'Two-Days Hands-on Workshop on Machine Learning using Python',
        type: 'workshop',
        organizer: 'Institution',
        duration: 2,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-02'),
        mode: 'offline',
        participants: 64,
        description: 'Hands-on workshop on machine learning concepts and implementation using Python',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'One-Day Hands-on Workshop on Git and GitHub',
        type: 'workshop',
        organizer: 'Institution',
        duration: 1,
        startDate: new Date('2024-04-03'),
        endDate: new Date('2024-04-03'),
        mode: 'offline',
        participants: 70,
        description: 'One-day hands-on workshop on version control using Git and GitHub',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'A Live Online Session on "Getting Jobs and Internship in the Domain of AI Development"',
        type: 'seminar',
        organizer: 'Institution',
        duration: 1,
        startDate: new Date('2024-05-15'),
        endDate: new Date('2024-05-15'),
        mode: 'online',
        participants: 232,
        description: 'Online session focused on career opportunities in AI development',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'Two-days Hands-on Workshop on Data nAnalytics with Python',
        type: 'workshop',
        organizer: 'Institution',
        duration: 2,
        startDate: new Date('2024-05-16'),
        endDate: new Date('2024-05-17'),
        mode: 'offline',
        participants: 68,
        description: 'Two-day hands-on workshop on data analytics using Python',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'An Online Workshop on "Intellectual Property Rights"',
        type: 'workshop',
        organizer: 'Institution',
        duration: 1,
        startDate: new Date('2024-05-17'),
        endDate: new Date('2024-05-17'),
        mode: 'online',
        participants: 80,
        description: 'Online workshop on intellectual property rights',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'Network Programming using Python by Mr. Malhar Lathkar',
        type: 'workshop',
        organizer: 'Institution',
        duration: 2,
        startDate: new Date('2024-05-17'),
        endDate: new Date('2024-05-18'),
        mode: 'offline',
        participants: 130,
        description: 'Two-day workshop on network programming using Python conducted by Mr. Malhar Lathkar',
        activityReportUrl: 'https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html'
    },
    {
        title: 'Metal forming and analysis by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla',
        type: 'seminar',
        organizer: 'BITS Pilani K. K. Birla',
        duration: 1,
        startDate: new Date('2023-10-28'),
        endDate: new Date('2023-10-28'),
        mode: 'offline',
        participants: 65,
        description: 'Seminar on metal forming and analysis by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla',
        activityReportUrl: 'http://mgmcen.ac.in/mechanical-engineering/mesa.aspx'
    },
    {
        title: 'Seminar on "Career Opportunities for Mechanical, Computer and Electronic Engineer in Software, Electronics oil refinery\'s companies" by Mr. Santosh Kulkarni, Sr. Engineer & Data Scientist, ABB Bangalore',
        type: 'seminar',
        organizer: 'ABB Bangalore',
        duration: 1,
        startDate: new Date('2023-12-02'),
        endDate: new Date('2023-12-02'),
        mode: 'offline',
        participants: 85,
        description: 'Seminar on career opportunities for Mechanical, Computer and Electronic Engineers in Software, Electronics oil refinery\'s companies by Mr. Santosh Kulkarni, Sr. Engineer & Data Scientist, ABB Bangalore',
        activityReportUrl: 'http://mgmcen.ac.in/mechanical-engineering/mesa.aspx'
    },
    {
        title: 'Online webinar on "Importance of Millets" by Food and Agriculture Organisation, Government of India',
        type: 'seminar',
        organizer: 'Food and Agriculture Organisation, Government of India',
        duration: 1,
        startDate: new Date('2023-11-29'),
        endDate: new Date('2023-11-29'),
        mode: 'online',
        participants: 95,
        description: 'Online webinar on "Importance of Millets" by Food and Agriculture Organisation, Government of India',
        activityReportUrl: 'http://mgmcen.ac.in/mechanical-engineering/mesa.aspx'
    },
    {
        title: 'Seminar on "Composite Materials" by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla',
        type: 'seminar',
        organizer: 'BITS Pilani K. K. Birla',
        duration: 1,
        startDate: new Date('2023-12-07'),
        endDate: new Date('2023-12-07'),
        mode: 'offline',
        participants: 55,
        description: 'Seminar on "Composite Materials" by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla',
        activityReportUrl: 'http://mgmcen.ac.in/mechanical-engineering/mesa.aspx'
    },
    {
        title: 'One week Workshop on Applications of Arduino Board',
        type: 'workshop',
        organizer: 'Institution',
        duration: 6,
        startDate: new Date('2023-10-30'),
        endDate: new Date('2023-11-05'),
        mode: 'offline',
        participants: 66,
        description: 'One week workshop on applications of Arduino Board',
        activityReportUrl: 'http://www.mgmcen.ac.in/pdf/ECT%20dept%20-%20Activity%20?.pdf'
    }
];

async function seedProfessionalDevelopment() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ Connected to MongoDB');

        // Find a faculty user to associate these activities with
        // You can modify this to use specific faculty members
        const facultyUsers = await User.find({ role: 'faculty' }).limit(5);

        if (facultyUsers.length === 0) {
            console.log('✗ No faculty users found. Please create faculty users first.');
            return;
        }

        console.log(`✓ Found ${facultyUsers.length} faculty users`);

        // Clear existing professional development data (optional)
        const deleteResult = await ProfessionalDevelopment.deleteMany({});
        console.log(`✓ Cleared ${deleteResult.deletedCount} existing professional development records`);

        // Create professional development activities
        let createdCount = 0;
        for (const activity of professionalDevelopmentData) {
            // Randomly assign to one of the faculty users
            const randomFaculty = facultyUsers[Math.floor(Math.random() * facultyUsers.length)];

            const newActivity = new ProfessionalDevelopment({
                faculty: randomFaculty._id,
                title: activity.title,
                type: activity.type,
                organizer: activity.organizer,
                duration: activity.duration,
                startDate: activity.startDate,
                endDate: activity.endDate,
                mode: activity.mode,
                description: activity.description,
                status: 'approved' // Set as approved for demo purposes
            });

            await newActivity.save();
            createdCount++;
            console.log(`✓ Created: ${activity.title}`);
        }

        console.log(`\n✓ Successfully created ${createdCount} professional development activities!`);
        console.log('\nSummary:');
        console.log('========================================');
        console.log(`Total Activities: ${createdCount}`);
        console.log(`Workshops: ${professionalDevelopmentData.filter(a => a.type === 'workshop').length}`);
        console.log(`Seminars: ${professionalDevelopmentData.filter(a => a.type === 'seminar').length}`);
        console.log(`Total Participants: ${professionalDevelopmentData.reduce((sum, a) => sum + a.participants, 0)}`);

    } catch (error) {
        console.error('✗ Error seeding professional development data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
    }
}

seedProfessionalDevelopment();

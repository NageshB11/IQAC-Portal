import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { InstitutionalEvent } from './models/FacultyActivity.js';
import Department from './models/Department.js';

dotenv.config();

const workshopData = [
    {
        year: "2023-2024",
        name: "Concrete Mix Design Workshop",
        type: "workshop",
        department: "Civil Engineering",
        participants: 107,
        dateFrom: "2024-05-22",
        dateTo: "2024-05-22",
        url: "https://mgmcen.ac.in/civil-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Two Days Hands-on Workshop on Front-end Development",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 70,
        dateFrom: "2024-02-26",
        dateTo: "2024-02-27",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Two-Days Hands-on Workshop on Machine Learning using Python",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 64,
        dateFrom: "2024-03-01",
        dateTo: "2024-03-02",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "One-Day Hands-on Workshop on Git and GitHub",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 70,
        dateFrom: "2024-04-03",
        dateTo: "2024-04-03",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "A Live Online Session on 'Getting Jobs and Internship in the Domain of AI Development'",
        type: "seminar",
        department: "Computer Science & Engineering",
        participants: 232,
        dateFrom: "2024-05-15",
        dateTo: "2024-05-15",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Two-days Hands-on Workshop on Data Analytics with Python",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 68,
        dateFrom: "2024-05-16",
        dateTo: "2024-05-17",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "An Online Workshop on 'Intellectual Property Rights'",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 80,
        dateFrom: "2024-05-17",
        dateTo: "2024-05-17",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Network Programming using Python by Mr. Malhar Lathkar",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 130,
        dateFrom: "2024-05-17",
        dateTo: "2024-05-18",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Two days workshop on Advanced Internet of Things conducted by Innovians Technologies in association with IIT, Varanasi",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 51,
        dateFrom: "2024-05-20",
        dateTo: "2024-05-21",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Seminar on Women Empowerment",
        type: "seminar",
        department: "Information Technology",
        participants: 240,
        dateFrom: "2024-03-07",
        dateTo: "2024-03-07",
        url: "https://mgmcen.ac.in/information-technology/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Workshop on Employability skills",
        type: "workshop",
        department: "Information Technology",
        participants: 60,
        dateFrom: "2024-04-13",
        dateTo: "2024-04-13",
        url: "https://mgmcen.ac.in/information-technology/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Seminar on on GATE Exam Preparation by Mr. Modh. Shahab from ACE Engineering Academy Hyderabad",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 35,
        dateFrom: "2024-08-16",
        dateTo: "2024-08-16",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on on ' MPSC Preparation ' Dy. Director, Directorate of Account and Treasuries, Finance Department, Government of Maharashtra",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 65,
        dateFrom: "2024-05-04",
        dateTo: "2024-05-04",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' Advance Manufacturing ' by Mr.Rohit Vadgaonkar The managing Director, Urvil Steels, Nanded",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 80,
        dateFrom: "2024-02-29",
        dateTo: "2024-02-29",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on 'IIOT Application' by Dr. Santosh Choudhary, HOD Mechanical engineering Department, Govt. polytechnic, Nanded",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 75,
        dateFrom: "2024-02-24",
        dateTo: "2024-02-24",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Introduction for Automotive Steel in Industry by Mr. Atul Bhalerao, Divisional Mager, JCAPCPL Jamshedpur",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 70,
        dateFrom: "2024-02-19",
        dateTo: "2024-02-19",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Workshop on 'Internet of Things'",
        type: "workshop",
        department: "Electronics & Communication Engineering",
        participants: 74,
        dateFrom: "2024-05-20",
        dateTo: "2024-05-21",
        url: "http://www.mgmcen.ac.in/pdFECT%20dept%20-%20Activity%202.pdf"
    },
    {
        year: "2023-2024",
        name: "Two day workshop on Machine Learning Concepts using Python programming",
        type: "workshop",
        department: "Electronics & Communication Engineering",
        participants: 74,
        dateFrom: "2024-03-20",
        dateTo: "2024-03-21",
        url: "http://www.mgmcen.ac.in/pdFECT%20dept%20-%20Activity%202.pdf"
    },
    {
        year: "2023-2024",
        name: "Workshop on 'How to start a Start-up'",
        type: "workshop",
        department: "Electronics & Communication Engineering",
        participants: 178,
        dateFrom: "2024-04-24",
        dateTo: "2024-04-24",
        url: "http://www.mgmcen.ac.in/pdFECT%20dept%20-%20Activity%202.pdf"
    },
    {
        year: "2023-2024",
        name: "Insights on CLoud Security: Intel Corporation Workshop",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 90,
        dateFrom: "2023-10-16",
        dateTo: "2023-10-16",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Webinar on Hanshake with NLP",
        type: "seminar",
        department: "Computer Science & Engineering",
        participants: 115,
        dateFrom: "2023-11-24",
        dateTo: "2023-11-24",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Two days workshop on Internet of Things conducted by Innovians Technologies in association with IIT, Varanasi",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 57,
        dateFrom: "2023-09-15",
        dateTo: "2023-09-16",
        url: "https://mgmcen.ac.in/computer-science-engineering/departmental-activity.html"
    },
    {
        year: "2023-2024",
        name: "Hands-On Generative AI Workshop",
        type: "workshop",
        department: "Computer Science & Engineering",
        participants: 312,
        dateFrom: "2023-08-24",
        dateTo: "2023-08-24",
        url: "https://mgmcen.ac.in/computer-science-engineering/csi.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' PLM- Product Life Cycle Management ' by Mt.Siraj Khan",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 45,
        dateFrom: "2023-12-13",
        dateTo: "2023-12-13",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' Robotics and Digitalization in manufacturing ' by Mr.Ashish Kamble from L&T Edu",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 53,
        dateFrom: "2023-09-07",
        dateTo: "2023-09-07",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' Green Energy System ' by Mr.Ashish Kamble from L&T Edu",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 48,
        dateFrom: "2023-09-07",
        dateTo: "2023-09-07",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "' Metal forming and analysis ' by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 65,
        dateFrom: "2023-10-28",
        dateTo: "2023-10-28",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' Career Opportunities for Mechanical, Computer and Electronic Engineer in Software, Electronics oil refinery's companies' by Mr. Santosh Kulkarni,Sr. Engineer & Data Scientist, ABB Bangalore",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 85,
        dateFrom: "2023-12-02",
        dateTo: "2023-12-02",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Online webinar on ' importance of Millets ' by Food and Agriculture Organisation, Government of India",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 95,
        dateFrom: "2023-11-29",
        dateTo: "2023-11-29",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "Seminar on ' Composite Materials ' by Dr. Sachin Waigaonkar, Professor in Department of Mechanical Engineering at BITS Pilani K. K. Birla",
        type: "seminar",
        department: "Mechanical Engineering",
        participants: 55,
        dateFrom: "2023-12-07",
        dateTo: "2023-12-07",
        url: "http://mgmcen.ac.in/mechanical-engineering/mesa.aspx"
    },
    {
        year: "2023-2024",
        name: "One week Workshop on Applications of Arduino Board",
        type: "workshop",
        department: "Electronics & Communication Engineering",
        participants: 66,
        dateFrom: "2023-09-30",
        dateTo: "2023-10-05",
        url: "http://www.mgmcen.ac.in/pdFECT%20dept%20-%20Activity%202.pdf"
    }
];

async function seedInstitutionalEvents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all departments
        const departments = await Department.find();
        const deptMap = {};

        // Create a flexible mapping
        departments.forEach(dept => {
            deptMap[dept.name] = dept._id;
            // Also map common variations
            if (dept.name.includes('Computer Science')) {
                deptMap['Computer Science & Engineering'] = dept._id;
            }
            if (dept.name.includes('Information Technology')) {
                deptMap['Information Technology'] = dept._id;
            }
            if (dept.name.includes('Mechanical')) {
                deptMap['Mechanical Engineering'] = dept._id;
            }
            if (dept.name.includes('Electronics')) {
                deptMap['Electronics & Communication Engineering'] = dept._id;
                deptMap['Electronics & Communication'] = dept._id;
            }
            if (dept.name.includes('Civil')) {
                deptMap['Civil Engineering'] = dept._id;
            }
            if (dept.name.includes('Electrical')) {
                deptMap['Electrical & Electronics Engineering'] = dept._id;
            }
        });

        console.log('Department mapping created for:', Object.keys(deptMap));

        // Clear existing institutional events
        await InstitutionalEvent.deleteMany({});
        console.log('Cleared existing institutional events');

        // Insert new events
        const eventsToInsert = workshopData.map(event => {
            const deptId = deptMap[event.department];
            if (!deptId) {
                console.warn(`⚠️  Department not found: ${event.department}`);
                return null;
            }

            return {
                department: deptId,
                academicYear: event.year,
                eventName: event.name,
                eventType: event.type,
                participantCount: event.participants,
                startDate: new Date(event.dateFrom),
                endDate: new Date(event.dateTo),
                activityReportUrl: event.url,
                description: `${event.type.charAt(0).toUpperCase() + event.type.slice(1)} conducted by the department`,
                status: 'approved'
            };
        }).filter(event => event !== null);

        const insertedEvents = await InstitutionalEvent.insertMany(eventsToInsert);
        console.log(`✅ Successfully inserted ${insertedEvents.length} institutional events`);

        // Show summary by department
        const summary = {};
        insertedEvents.forEach(event => {
            const deptName = Object.keys(deptMap).find(key => deptMap[key].toString() === event.department.toString());
            if (!summary[deptName]) {
                summary[deptName] = { workshops: 0, seminars: 0, conferences: 0, total: 0 };
            }
            summary[deptName][event.eventType + 's']++;
            summary[deptName].total++;
        });

        console.log('\n📊 Summary by Department:');
        Object.keys(summary).forEach(dept => {
            console.log(`\n${dept}:`);
            console.log(`  - Workshops: ${summary[dept].workshops}`);
            console.log(`  - Seminars: ${summary[dept].seminars}`);
            console.log(`  - Conferences: ${summary[dept].conferences}`);
            console.log(`  - Total: ${summary[dept].total}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error seeding institutional events:', error);
        process.exit(1);
    }
}

seedInstitutionalEvents();


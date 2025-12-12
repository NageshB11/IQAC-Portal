import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ResearchPublication } from './models/FacultyActivity.js';
import User from './models/User.js';
import Department from './models/Department.js';

dotenv.config();

const researchData = [
    {
        title: "An Accurate And Efficient Multi-Task Brain Tumor Detection with Segmented MRI Images using Auto-Metric Adolescent Neural Network",
        authors: "Ms. A. K. Salve and Dr. K. C. Jondhale",
        departmentCode: "ENTC", // Electronics & Telecommunication
        journalConference: "International Journal of Computational Vision and Robotics Scopus Index Journal",
        year: 2024,
        issn: "1752-914X",
        doi: "https://doi.org/10.1016/j.bspc.2023.104972"
    },
    {
        title: "Study and Analysis of Flat Slab System",
        authors: "Ms. Shruti Barbade and Halbandge S. D.",
        departmentCode: "CE", // Civil Engineering
        journalConference: "International Journal for Research in Engineering Application & Management",
        year: 2024,
        issn: "2454-9150",
        doi: "10.35291/2454-9150.2024.0080"
    },
    {
        title: "Performance-based evaluation of reinforced concrete buildings at vertical geometric regularity limit",
        authors: "Karanpal Singh, Hardeep Singh Hazuria, Arshad K Hashmi and Lakshmanagouda G Patil",
        departmentCode: "CE", // Civil Engineering
        journalConference: "Innovative Infrastructure Solutions",
        year: 2023,
        issn: "2364-4176",
        doi: "https://link.springer.com/journal/41062"
    },
    {
        title: "Evaluation of Engineering Demand Parameters of RC Multistoreyed Building Subjected to Extreme Blast Event",
        authors: "Sneha Hirekhan, Mohd. Zameeruddin and P. S. Charpe",
        departmentCode: "CE", // Civil Engineering
        journalConference: "Journal of Aeronautical Materials",
        year: 2023,
        issn: "1005-5053",
        doi: "Journal of Aeronautical Materials (hkcbcb.cn)"
    },
    {
        title: "Predicting Safety of the Building Subjected to Blast Loading Using Performance-based Seismic Framework",
        authors: "Sneha Hirekhan, Mohd. Zameeruddin and P. S. Charpe",
        departmentCode: "CE", // Civil Engineering
        journalConference: "Journal of Aeronautical Materials",
        year: 2023,
        issn: "1005-5053",
        doi: "Journal of Aeronautical Materials (hkcbcb.cn)"
    }
];

async function seedResearchPublications() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Get all departments
        const departments = await Department.find();
        console.log(`✓ Found ${departments.length} departments`);

        // Create a map of department codes to department objects
        const deptMap = {};
        departments.forEach(dept => {
            deptMap[dept.code] = dept;
        });

        console.log('\nAvailable departments:');
        departments.forEach(dept => {
            console.log(`  - ${dept.name} (${dept.code})`);
        });
        console.log('');

        // Clear existing research publications (optional - comment out if you want to keep existing data)
        // await ResearchPublication.deleteMany({});
        // console.log('✓ Cleared existing research publications');

        let successCount = 0;
        let errorCount = 0;

        // Process each research paper
        for (const paper of researchData) {
            try {
                // Find department by code
                const dept = deptMap[paper.departmentCode];
                if (!dept) {
                    console.log(`✗ Department not found: ${paper.departmentCode}`);
                    errorCount++;
                    continue;
                }

                // Find a faculty member from this department
                const faculty = await User.findOne({
                    department: dept._id,
                    role: 'faculty'
                });

                if (!faculty) {
                    console.log(`✗ No faculty found for department: ${dept.name} (${paper.departmentCode})`);
                    errorCount++;
                    continue;
                }

                // Create publication date from year
                const publicationDate = new Date(`${paper.year}-01-01`);

                // Create research publication
                const publication = new ResearchPublication({
                    faculty: faculty._id,
                    title: paper.title,
                    authors: paper.authors,
                    journalConference: paper.journalConference,
                    publicationType: 'journal',
                    publicationDate: publicationDate,
                    doi: paper.doi,
                    issn: paper.issn,
                    status: 'approved',
                    indexing: ['scopus'],
                    citationCount: Math.floor(Math.random() * 50) // Random citation count
                });

                await publication.save();
                console.log(`✓ Added: ${paper.title.substring(0, 50)}... (${dept.name})`);
                successCount++;

            } catch (error) {
                console.error(`✗ Error adding paper: ${paper.title.substring(0, 30)}...`);
                console.error(`  Error: ${error.message}`);
                errorCount++;
            }
        }

        console.log('\n=== Summary ===');
        console.log(`✓ Successfully added: ${successCount} publications`);
        console.log(`✗ Errors: ${errorCount}`);
        console.log('===============\n');

    } catch (error) {
        console.error('✗ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('✓ Disconnected from MongoDB');
    }
}

// Run the seed function
seedResearchPublications();

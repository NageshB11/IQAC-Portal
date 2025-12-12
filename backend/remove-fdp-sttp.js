import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function removeFDPSTTP() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const { ProfessionalDevelopment } = await import('./models/FacultyActivity.js');

        // Count before deletion
        const countBefore = await ProfessionalDevelopment.countDocuments();
        console.log(`📊 Current FDP/STTP records: ${countBefore}`);

        if (countBefore === 0) {
            console.log('\n✅ No FDP/STTP data to remove.');
            await mongoose.connection.close();
            return;
        }

        // Show sample data before deletion
        console.log('\nSample records to be deleted:');
        const samples = await ProfessionalDevelopment.find().limit(5).populate('faculty', 'firstName lastName');
        samples.forEach((item, i) => {
            console.log(`${i + 1}. ${item.title}`);
            console.log(`   Faculty: ${item.faculty?.firstName} ${item.faculty?.lastName}`);
            console.log(`   Type: ${item.type}`);
        });

        // Delete all FDP/STTP records
        console.log('\n⚠️  Deleting all FDP/STTP (Professional Development) records...');
        const result = await ProfessionalDevelopment.deleteMany({});

        console.log(`\n✅ Successfully deleted ${result.deletedCount} FDP/STTP records`);

        // Verify deletion
        const countAfter = await ProfessionalDevelopment.countDocuments();
        console.log(`📊 Remaining FDP/STTP records: ${countAfter}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

removeFDPSTTP();

import fetch from 'node-fetch';

async function testReportGeneration() {
    try {
        // You'll need to replace this with an actual token from localStorage
        // For now, let's just test if the endpoint is reachable

        const url = 'http://localhost:5000/api/excel-reports/generate-excel?academicYear=2023-2024&activityType=institutional-events';

        console.log('Testing report generation...');
        console.log('URL:', url);

        const response = await fetch(url, {
            headers: {
                // You would need a real token here
                'Authorization': 'Bearer YOUR_TOKEN_HERE'
            }
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.ok) {
            console.log('✅ Report generated successfully!');
            const blob = await response.blob();
            console.log('File size:', blob.size, 'bytes');
        } else {
            const error = await response.json();
            console.log('❌ Error:', error);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testReportGeneration();

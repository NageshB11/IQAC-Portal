// Test script to verify faculty activities API
const testAPI = async () => {
    const baseURL = 'http://localhost:5000';

    // You need to replace this with a valid faculty token
    const token = 'YOUR_FACULTY_TOKEN_HERE';

    console.log('Testing Faculty Activities API...\n');

    // Test 1: Add Research Publication
    console.log('1. Testing Add Research Publication...');
    try {
        const response = await fetch(`${baseURL}/api/faculty-activities/research`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Test Publication',
                authors: 'John Doe, Jane Smith',
                journalConference: 'IEEE Conference',
                publicationType: 'conference',
                publicationDate: '2024-01-15',
                citationCount: 0
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
        console.log('');
    } catch (error) {
        console.error('Error:', error.message);
    }

    // Test 2: Get All Research Publications
    console.log('2. Testing Get Research Publications...');
    try {
        const response = await fetch(`${baseURL}/api/faculty-activities/research`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Count:', Array.isArray(data) ? data.length : 'N/A');
        console.log('');
    } catch (error) {
        console.error('Error:', error.message);
    }

    // Test 3: Get Statistics
    console.log('3. Testing Get Statistics...');
    try {
        const response = await fetch(`${baseURL}/api/faculty-activities/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Statistics:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Run tests
testAPI();

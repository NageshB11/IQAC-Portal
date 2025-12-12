// Test the institutional events API endpoint
// Run this with: node server/test-api.js

import fetch from 'node-fetch';

async function testAPI() {
    try {
        // First login to get a token
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            console.log('❌ Login failed');
            return;
        }

        const { token } = await loginRes.json();
        console.log('✅ Login successful\n');

        // Test the institutional events endpoint
        const eventsRes = await fetch('http://localhost:5000/api/faculty-activities/institutional-events', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!eventsRes.ok) {
            const error = await eventsRes.text();
            console.log('❌ API call failed:', eventsRes.status, error);
            return;
        }

        const events = await eventsRes.json();
        console.log(`✅ API returned ${events.length} events\n`);

        if (events.length > 0) {
            console.log('Sample events:');
            events.slice(0, 3).forEach((e, i) => {
                console.log(`${i + 1}. ${e.eventName}`);
                console.log(`   Type: ${e.eventType}, Year: ${e.academicYear}`);
                console.log(`   Dept: ${e.department?.name}\n`);
            });
        } else {
            console.log('⚠️  No events returned from API');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testAPI();

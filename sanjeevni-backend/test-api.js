// Simple API testing script
// Run with: node test-api.js (make sure server is running)

const BASE_URL = 'http://192.168.1.108:3000/api';

async function testAPI() {
  console.log('🧪 Testing Sanjeevni API...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 2: Get Doctors
  console.log('\n2️⃣ Testing Get Doctors...');
  try {
    const response = await fetch(`${BASE_URL}/doctors`);
    const data = await response.json();
    console.log(`✅ Found ${data.data.length} doctors`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 3: Book Appointment
  console.log('\n3️⃣ Testing Book Appointment...');
  try {
    const response = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'p123',
        patientName: 'John Doe',
        doctorId: '1',
        doctorName: 'Dr. Priya Sharma',
        date: '2025-10-10',
        time: '10:00 AM',
        reason: 'Regular checkup'
      })
    });
    const data = await response.json();
    console.log('✅ Appointment booked:', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 4: Add Medical Record
  console.log('\n4️⃣ Testing Add Medical Record...');
  try {
    const response = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'p123',
        type: 'prescription',
        title: 'Fever Treatment',
        description: 'Prescribed for viral fever',
        doctorName: 'Dr. Amit Patel',
        medicines: ['Paracetamol 500mg', 'Vitamin C']
      })
    });
    const data = await response.json();
    console.log('✅ Record added:', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 5: Create Reminder
  console.log('\n5️⃣ Testing Create Reminder...');
  try {
    const response = await fetch(`${BASE_URL}/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'p123',
        type: 'medicine',
        title: 'Take Paracetamol',
        description: 'After breakfast',
        time: '09:00',
        frequency: 'daily'
      })
    });
    const data = await response.json();
    console.log('✅ Reminder created:', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 6: Book Lab Test
  console.log('\n6️⃣ Testing Book Lab Test...');
  try {
    const response = await fetch(`${BASE_URL}/tests/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: 'p123',
        patientName: 'John Doe',
        testId: 't1',
        date: '2025-10-08',
        time: '08:00 AM',
        homeCollection: true
      })
    });
    const data = await response.json();
    console.log('✅ Test booked:', data.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  // Test 7: Chatbot
  console.log('\n7️⃣ Testing Chatbot...');
  try {
    const response = await fetch(`${BASE_URL}/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I have a fever',
        patientId: 'p123'
      })
    });
    const data = await response.json();
    console.log('✅ Bot replied:', data.data.botReply);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n✨ All tests completed!');
}

testAPI();
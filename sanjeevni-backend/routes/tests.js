const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock lab tests catalog
const testsCatalog = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    description: 'Measures different components of blood',
    category: 'Blood Test',
    price: 400,
    preparationRequired: false,
    reportTime: '24 hours'
  },
  {
    id: 't2',
    name: 'Lipid Profile',
    description: 'Cholesterol and triglycerides test',
    category: 'Blood Test',
    price: 600,
    preparationRequired: true,
    preparationNote: '12-14 hours fasting required',
    reportTime: '24 hours'
  },
  {
    id: 't3',
    name: 'Blood Sugar (Fasting)',
    description: 'Measures blood glucose levels',
    category: 'Blood Test',
    price: 300,
    preparationRequired: true,
    preparationNote: '8-12 hours fasting required',
    reportTime: '6 hours'
  },
  {
    id: 't4',
    name: 'Thyroid Profile',
    description: 'T3, T4, and TSH levels',
    category: 'Blood Test',
    price: 800,
    preparationRequired: false,
    reportTime: '48 hours'
  },
  {
    id: 't5',
    name: 'Liver Function Test (LFT)',
    description: 'Checks liver health',
    category: 'Blood Test',
    price: 700,
    preparationRequired: false,
    reportTime: '24 hours'
  },
  {
    id: 't6',
    name: 'X-Ray Chest',
    description: 'Chest radiography',
    category: 'Radiology',
    price: 500,
    preparationRequired: false,
    reportTime: '4 hours'
  }
];

// Mock test bookings storage
let testBookings = [];

// GET all available tests
router.get('/catalog', (req, res) => {
  const { category, search } = req.query;
  let filtered = testsCatalog;

  if (category) {
    filtered = filtered.filter(test => test.category === category);
  }

  if (search) {
    filtered = filtered.filter(test => 
      test.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({ success: true, data: filtered });
});

// GET test categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(testsCatalog.map(t => t.category))];
  res.json({ success: true, data: categories });
});

// GET all bookings for a patient
router.get('/bookings', (req, res) => {
  const { patientId, status } = req.query;
  let filtered = testBookings;

  if (patientId) {
    filtered = filtered.filter(booking => booking.patientId === patientId);
  }

  if (status) {
    filtered = filtered.filter(booking => booking.status === status);
  }

  res.json({ success: true, data: filtered });
});

// POST - Book a test
router.post('/bookings', (req, res) => {
  const { 
    patientId, 
    patientName,
    testId, 
    date, 
    time,
    address,
    homeCollection 
  } = req.body;

  if (!patientId || !testId || !date || !time) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const test = testsCatalog.find(t => t.id === testId);
  if (!test) {
    return res.status(404).json({ 
      success: false, 
      error: 'Test not found' 
    });
  }

  const newBooking = {
    id: uuidv4(),
    patientId,
    patientName,
    testId,
    testName: test.name,
    testCategory: test.category,
    price: test.price,
    date,
    time,
    address: address || '',
    homeCollection: homeCollection || false,
    status: 'scheduled', // 'scheduled', 'completed', 'cancelled'
    reportUrl: null,
    createdAt: new Date().toISOString()
  };

  testBookings.push(newBooking);
  res.status(201).json({ 
    success: true, 
    data: newBooking,
    message: 'Test booked successfully' 
  });
});

// PUT - Update test booking
router.put('/bookings/:id', (req, res) => {
  const index = testBookings.findIndex(booking => booking.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  testBookings[index] = { 
    ...testBookings[index], 
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ 
    success: true, 
    data: testBookings[index],
    message: 'Booking updated successfully' 
  });
});

// DELETE - Cancel test booking
router.delete('/bookings/:id', (req, res) => {
  const index = testBookings.findIndex(booking => booking.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  testBookings.splice(index, 1);
  res.json({ 
    success: true, 
    message: 'Booking cancelled successfully' 
  });
});

module.exports = router;
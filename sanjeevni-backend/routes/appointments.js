const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock appointments storage
let appointments = [];

// GET all appointments for a patient
router.get('/', (req, res) => {
  const { patientId, status } = req.query;
  let filtered = appointments;

  if (patientId) {
    filtered = filtered.filter(app => app.patientId === patientId);
  }

  if (status) {
    filtered = filtered.filter(app => app.status === status);
  }

  res.json({ success: true, data: filtered });
});

// GET appointment by ID
router.get('/:id', (req, res) => {
  const appointment = appointments.find(app => app.id === req.params.id);
  if (!appointment) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }
  res.json({ success: true, data: appointment });
});

// POST - Book new appointment
router.post('/', (req, res) => {
  const { patientId, patientName, doctorId, doctorName, date, time, reason } = req.body;

  if (!patientId || !doctorId || !date || !time) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const newAppointment = {
    id: uuidv4(),
    patientId,
    patientName,
    doctorId,
    doctorName,
    date,
    time,
    reason: reason || 'General consultation',
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };

  appointments.push(newAppointment);
  res.status(201).json({ 
    success: true, 
    data: newAppointment,
    message: 'Appointment booked successfully' 
  });
});

// PUT - Update appointment
router.put('/:id', (req, res) => {
  const index = appointments.findIndex(app => app.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  appointments[index] = { 
    ...appointments[index], 
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ 
    success: true, 
    data: appointments[index],
    message: 'Appointment updated successfully' 
  });
});

// DELETE - Cancel appointment
router.delete('/:id', (req, res) => {
  const index = appointments.findIndex(app => app.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Appointment not found' });
  }

  appointments.splice(index, 1);
  res.json({ 
    success: true, 
    message: 'Appointment cancelled successfully' 
  });
});

module.exports = router;
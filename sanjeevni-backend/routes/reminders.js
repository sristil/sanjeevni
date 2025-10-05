const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock reminders storage
let reminders = [];

// GET all reminders for a patient
router.get('/', (req, res) => {
  const { patientId, type, active } = req.query;
  let filtered = reminders;

  if (patientId) {
    filtered = filtered.filter(rem => rem.patientId === patientId);
  }

  if (type) {
    filtered = filtered.filter(rem => rem.type === type);
  }

  if (active !== undefined) {
    filtered = filtered.filter(rem => rem.active === (active === 'true'));
  }

  // Sort by time
  filtered.sort((a, b) => a.time.localeCompare(b.time));

  res.json({ success: true, data: filtered });
});

// GET reminder by ID
router.get('/:id', (req, res) => {
  const reminder = reminders.find(rem => rem.id === req.params.id);
  if (!reminder) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }
  res.json({ success: true, data: reminder });
});

// POST - Create new reminder
router.post('/', (req, res) => {
  const { 
    patientId, 
    type, 
    title, 
    description,
    time,
    frequency,
    startDate,
    endDate,
    daysOfWeek 
  } = req.body;

  if (!patientId || !type || !title || !time) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const newReminder = {
    id: uuidv4(),
    patientId,
    type, // 'medicine', 'appointment', 'test', 'refill'
    title,
    description: description || '',
    time, // Format: "HH:MM" (24-hour)
    frequency: frequency || 'daily', // 'daily', 'weekly', 'monthly', 'custom'
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || null,
    daysOfWeek: daysOfWeek || [0, 1, 2, 3, 4, 5, 6], // 0=Sunday, 6=Saturday
    active: true,
    createdAt: new Date().toISOString()
  };

  reminders.push(newReminder);
  res.status(201).json({ 
    success: true, 
    data: newReminder,
    message: 'Reminder created successfully' 
  });
});

// PUT - Update reminder
router.put('/:id', (req, res) => {
  const index = reminders.findIndex(rem => rem.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }

  reminders[index] = { 
    ...reminders[index], 
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ 
    success: true, 
    data: reminders[index],
    message: 'Reminder updated successfully' 
  });
});

// PATCH - Toggle reminder active status
router.patch('/:id/toggle', (req, res) => {
  const index = reminders.findIndex(rem => rem.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }

  reminders[index].active = !reminders[index].active;
  reminders[index].updatedAt = new Date().toISOString();

  res.json({ 
    success: true, 
    data: reminders[index],
    message: `Reminder ${reminders[index].active ? 'activated' : 'deactivated'}` 
  });
});

// DELETE - Delete reminder
router.delete('/:id', (req, res) => {
  const index = reminders.findIndex(rem => rem.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Reminder not found' });
  }

  reminders.splice(index, 1);
  res.json({ 
    success: true, 
    message: 'Reminder deleted successfully' 
  });
});

module.exports = router;
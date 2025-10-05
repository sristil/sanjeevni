const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock medical records storage
let records = [];

// GET all records for a patient
router.get('/', (req, res) => {
  const { patientId, type } = req.query;
  let filtered = records;

  if (patientId) {
    filtered = filtered.filter(rec => rec.patientId === patientId);
  }

  if (type) {
    filtered = filtered.filter(rec => rec.type === type);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({ success: true, data: filtered });
});

// GET record by ID
router.get('/:id', (req, res) => {
  const record = records.find(rec => rec.id === req.params.id);
  if (!record) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  res.json({ success: true, data: record });
});

// POST - Add new medical record
router.post('/', (req, res) => {
  const { 
    patientId, 
    type, 
    title, 
    description, 
    doctorName, 
    hospital,
    date,
    fileUrl,
    medicines 
  } = req.body;

  if (!patientId || !type || !title) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }

  const newRecord = {
    id: uuidv4(),
    patientId,
    type, // 'prescription', 'test_result', 'diagnosis', 'vaccine'
    title,
    description: description || '',
    doctorName: doctorName || 'N/A',
    hospital: hospital || 'N/A',
    date: date || new Date().toISOString(),
    fileUrl: fileUrl || null,
    medicines: medicines || [],
    createdAt: new Date().toISOString()
  };

  records.push(newRecord);
  res.status(201).json({ 
    success: true, 
    data: newRecord,
    message: 'Record added successfully' 
  });
});

// PUT - Update record
router.put('/:id', (req, res) => {
  const index = records.findIndex(rec => rec.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  records[index] = { 
    ...records[index], 
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({ 
    success: true, 
    data: records[index],
    message: 'Record updated successfully' 
  });
});

// DELETE - Delete record
router.delete('/:id', (req, res) => {
  const index = records.findIndex(rec => rec.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }

  records.splice(index, 1);
  res.json({ 
    success: true, 
    message: 'Record deleted successfully' 
  });
});

module.exports = router;
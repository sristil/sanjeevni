const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock data for doctors (replace with DB later)
let doctors = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD (Cardiology)',
    experience: 15,
    fee: 800,
    hospital: 'Apollo Hospital',
    availability: ['Monday', 'Wednesday', 'Friday'],
    timings: '10:00 AM - 5:00 PM',
    rating: 4.8,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Orthopedic',
    qualification: 'MBBS, MS (Ortho)',
    experience: 12,
    fee: 700,
    hospital: 'Fortis Hospital',
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    timings: '9:00 AM - 4:00 PM',
    rating: 4.6,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    name: 'Dr. Anjali Verma',
    specialty: 'Pediatrician',
    qualification: 'MBBS, MD (Pediatrics)',
    experience: 10,
    fee: 600,
    hospital: 'Max Healthcare',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timings: '11:00 AM - 6:00 PM',
    rating: 4.9,
    image: 'https://via.placeholder.com/150'
  },
  {
    id: '4',
    name: 'Dr. Amit Patel',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    experience: 20,
    fee: 500,
    hospital: 'Manipal Hospital',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timings: '8:00 AM - 2:00 PM',
    rating: 4.7,
    image: 'https://via.placeholder.com/150'
  }
];

// GET all doctors
router.get('/', (req, res) => {
  const { specialty, hospital } = req.query;
  let filtered = doctors;

  if (specialty) {
    filtered = filtered.filter(doc => 
      doc.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  if (hospital) {
    filtered = filtered.filter(doc => 
      doc.hospital.toLowerCase().includes(hospital.toLowerCase())
    );
  }

  res.json({ success: true, data: filtered });
});

// GET doctor by ID
router.get('/:id', (req, res) => {
  const doctor = doctors.find(d => d.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, error: 'Doctor not found' });
  }
  res.json({ success: true, data: doctor });
});

// GET specialties list
router.get('/list/specialties', (req, res) => {
  const specialties = [...new Set(doctors.map(d => d.specialty))];
  res.json({ success: true, data: specialties });
});

module.exports = router;
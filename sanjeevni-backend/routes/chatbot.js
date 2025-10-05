const express = require('express');
const router = express.Router();

// Simple rule-based chatbot responses
const responses = {
  symptoms: {
    keywords: ['fever', 'cold', 'cough', 'headache', 'pain', 'sick'],
    response: 'I understand you\'re not feeling well. For persistent symptoms, I recommend booking an appointment with a doctor. Would you like me to help you find a doctor?'
  },
  appointment: {
    keywords: ['appointment', 'book', 'schedule', 'doctor', 'consult'],
    response: 'I can help you book an appointment! You can browse available doctors in the "Doctors" section. What specialty are you looking for?'
  },
  medicine: {
    keywords: ['medicine', 'medication', 'prescription', 'drug', 'tablet'],
    response: 'You can view all your prescriptions in the "Medical Records" section. Would you like to set up a reminder for your medications?'
  },
  test: {
    keywords: ['test', 'lab', 'blood test', 'checkup', 'report'],
    response: 'You can book lab tests from the "Tests" section. We offer home collection services too. What test are you looking for?'
  },
  reminder: {
    keywords: ['reminder', 'remind', 'alert', 'notification'],
    response: 'I can help set up reminders for medications, appointments, or tests. Go to the "Reminders" section to create a new reminder.'
  },
  emergency: {
    keywords: ['emergency', 'urgent', 'critical', 'serious', 'ambulance'],
    response: '🚨 For medical emergencies, please call 108 (ambulance) or visit the nearest emergency room immediately. This app is not for emergency situations.'
  }
};

// POST - Send message to chatbot
router.post('/message', (req, res) => {
  const { message, patientId } = req.body;

  if (!message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Message is required' 
    });
  }

  const lowerMessage = message.toLowerCase();
  let reply = 'I\'m here to help! You can ask me about:\n• Booking appointments\n• Finding doctors\n• Viewing medical records\n• Setting reminders\n• Booking lab tests';

  // Check for matching keywords
  for (const [category, data] of Object.entries(responses)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      reply = data.response;
      break;
    }
  }

  // Greetings
  if (['hi', 'hello', 'hey', 'namaste'].some(g => lowerMessage.includes(g))) {
    reply = 'Hello! I\'m Sanjeevni Assistant. How can I help you today?';
  }

  // Thanks
  if (['thank', 'thanks'].some(t => lowerMessage.includes(t))) {
    reply = 'You\'re welcome! Feel free to ask if you need anything else.';
  }

  res.json({ 
    success: true, 
    data: {
      userMessage: message,
      botReply: reply,
      timestamp: new Date().toISOString()
    }
  });
});

// GET - Health tips
router.get('/tips', (req, res) => {
  const tips = [
    {
      id: 1,
      category: 'Nutrition',
      tip: 'Drink at least 8 glasses of water daily to stay hydrated.',
      icon: '💧'
    },
    {
      id: 2,
      category: 'Exercise',
      tip: 'Get at least 30 minutes of physical activity most days of the week.',
      icon: '🏃'
    },
    {
      id: 3,
      category: 'Sleep',
      tip: 'Aim for 7-9 hours of quality sleep each night.',
      icon: '😴'
    },
    {
      id: 4,
      category: 'Mental Health',
      tip: 'Practice stress management through meditation or deep breathing.',
      icon: '🧘'
    },
    {
      id: 5,
      category: 'Preventive Care',
      tip: 'Schedule regular health checkups and screenings.',
      icon: '🏥'
    }
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ success: true, data: randomTip });
});

module.exports = router;
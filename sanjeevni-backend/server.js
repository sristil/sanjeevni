const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const recordsRouter = require('./routes/records');
const remindersRouter = require('./routes/reminders');
const testsRouter = require('./routes/tests');
const chatbotRouter = require('./routes/chatbot');

// Use routes
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/records', recordsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/tests', testsRouter);
app.use('/api/chatbot', chatbotRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sanjeevni API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 Sanjeevni API running on port ${PORT}`);
});
require('dotenv').config();
console.log('--- BACKEND v1.0.2 (Sarvam-M Fix) BOOTING ---');

process.on('uncaughtException', (err) => {
  console.error('CRITICAL ERROR (Uncaught Exception):', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL ERROR (Unhandled Rejection):', reason);
  process.exit(1);
});
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/expenses', expenseRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

process.on('exit', (code) => {
  console.log(`Process is exiting with code: ${code}`);
});

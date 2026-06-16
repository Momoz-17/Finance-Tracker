require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  // LOCAL ORIGIN (Vite default port)
  origin: 'http://localhost:5173', 
  
  // PRODUCTION ORIGIN (Commented out for now)
  // origin: 'https://finance-tracker-1-qawj.onrender.com', 
  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); 

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Finance Tracker API is running locally...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
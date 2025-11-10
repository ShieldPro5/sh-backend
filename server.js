// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import complaintRoutes from './routes/complaintRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============================
// 🔧 Middleware Setup
// =============================

// Disable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Security headers
app.use(helmet());

// Parse JSON
app.use(express.json({ limit: '2mb' }));

// Logging
app.use(morgan('dev'));

// ✅ CORS — no wildcard path needed!
app.use(cors({
  origin: '*', // or e.g. 'http://localhost:3000' for your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// =============================
// 🚀 Routes
// =============================
app.get('/', (req, res) => {
  res.json({ message: 'CORS is open to everyone 🚀' });
});

app.use('/api/complaints', complaintRoutes);

// =============================
// ⚠️ Error Handling Middleware
// =============================
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// =============================
// 🧠 MongoDB Connection & Server Start
// =============================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

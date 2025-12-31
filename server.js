// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import complaintRoutes from './routes/complaintRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json({ limit: '2mb' }));

app.use(morgan('dev'));


const allowedOrigins = [
  'http://localhost:5173',
  'chttps://fedexshippingcenter.vercel.app',
  'https://www.fedexshippingcenter.vercel.app',
  'https://www.fedexshippingcenter.com',
  'http://localhost:8080',
  'http://localhost:8081',
  'https://fundrecoverpro.vercel.app',
  'https://www.coinmarketrecovery.net',
  'https://coinmarketrecovery.net',
  process.env.CLIENT_URL,  
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log blocked origin for debugging
    console.log(`⚠️ CORS blocked for origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'FedEx Backend API is running 🚀',
    version: '1.0.0',
    endpoints: {
      complaints: '/api/complaints',
      shipments: '/api/shipments',
      shipmentStats: '/api/shipments/stats'
    }
  });
});

app.use('/api/complaints', complaintRoutes);
app.use('/api/shipments', shipmentRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
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
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

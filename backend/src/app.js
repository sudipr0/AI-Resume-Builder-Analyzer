// backend/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ======================
// SECURITY & MIDDLEWARE
// ======================
app.use(helmet({
    contentSecurityPolicy: false, // Set to true in production if needed
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({
    origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'X-Application',
        'X-API-Key',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
    ]
}));


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(compression());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

// ======================
// STATIC FILES
// ======================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ======================
// API ROUTES
// ======================
app.use('/api', apiLimiter, apiRoutes);

// Health check (Legacy root check)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// Root route - friendly API landing for quick checks
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Server is running',
        routes: {
            health: '/health',
            api: '/api'
        },
        timestamp: new Date().toISOString()
    });
});

// ======================
// ERROR HANDLING
// ======================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

// backend/server.js
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import app from './src/app.js';
import socketService from './src/services/socketService.js';
import maintenanceService from './src/services/maintenanceService.js';

dotenv.config();

const PORT = parseInt(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io via Service
socketService.initialize(server);

// Database Connection & Server Start
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        
        // Start maintenance service
        maintenanceService.start();

        server.listen(PORT, HOST, () => {
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    });

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', err.name, err.message);
    process.exit(1);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...', err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

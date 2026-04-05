// backend/server.js
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import app from './src/app.js';
import maintenanceService from './src/services/maintenanceService.js';

dotenv.config();

const PORT = parseInt(process.env.PORT) || 5001;
const HOST = process.env.HOST || '0.0.0.0';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CLIENT_URL?.split(',') || ["http://localhost:3000", "http://localhost:5173"],
        credentials: true
    }
});

// Socket logic
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    socket.on('join-resume', (resumeId) => {
        socket.join(`resume-${resumeId}`);
        console.log(`👤 User joined resume: ${resumeId}`);
    });

    socket.on('resume-change', (data) => {
        socket.to(`resume-${data.resumeId}`).emit('resume-updated', data);
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
    });
});

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

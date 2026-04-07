import express from 'express';
import multer from 'multer';
import { extractResumeContent } from '../controllers/resumeExtraction.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


// Configure multer for temp storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'image/jpeg',
            'image/png'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, JPG, and PNG are allowed.'));
        }
    }
});

// Use authentication middleware when in production. For development we allow a mock/dev upload flow
// so it's easy to test file uploads without an auth token.
const middlewares = [];
if (process.env.NODE_ENV === 'production') {
    middlewares.push(protect);
} else {
    console.log('⚠️ Development: resume upload route is open (no auth required)');
}
middlewares.push(upload.single('resumeFile'));

router.post('/resume', ...middlewares, extractResumeContent);

export default router;

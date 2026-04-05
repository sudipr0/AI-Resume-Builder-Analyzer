// src/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ValidationError } from '../utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadDirs = [
    '../../uploads/profiles',
    '../../uploads/resumes',
    '../../uploads/temp'
];

uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = '../../uploads/temp';
        if (file.fieldname === 'avatar') dest = '../../uploads/profiles';
        if (file.fieldname === 'resume') dest = '../../uploads/resumes';
        cb(null, path.join(__dirname, dest));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new ValidationError('Only images are allowed for profile photo'), false);
        }
    } else if (file.fieldname === 'resume') {
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new ValidationError('Only PDF, DOC, DOCX and TXT files are allowed'), false);
        }
    }
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

export default upload;

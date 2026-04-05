import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { extractTextFromDOCX } from '../utils/docxParser.js';
import { extractTextFromImage } from '../utils/imageOCR.js';
import aiService from '../ai/ai.service.js';
import logger from '../utils/logger.js';
import SocketService from '../services/socketService.js';
import FileUpload from '../models/FileUpload.js';

/**
 * Handle document upload (PDF, DOCX, Image), extract text, and build structured JS data.
 */
export const extractResumeContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.file;
        const filePath = file.path;
        const mimeType = file.mimetype;
        const originalName = file.originalname;

        const userId = req.user ? (req.user._id ? req.user._id.toString() : req.user.id) : null;

        logger.info(`Extracting resume: ${originalName} (${mimeType})`);

        if (userId) {
            SocketService.notifyUser(userId, 'upload:progress', {
                step: 'uploading',
                progress: 10,
                message: 'Analyzing document structure...'
            });
        }

        let rawText = '';
        const fileBuffer = fs.readFileSync(filePath);

        // 1. Text Extraction based on file type
        try {
            if (mimeType === 'application/pdf') {
                rawText = await extractTextFromPDF(fileBuffer);
            } else if (
                mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                mimeType === 'application/msword'
            ) {
                rawText = await extractTextFromDOCX(fileBuffer);
            } else if (mimeType.startsWith('image/')) {
                rawText = await extractTextFromImage(fileBuffer);
            } else if (mimeType === 'text/plain') {
                rawText = fileBuffer.toString('utf-8');
            } else {
                throw new Error('Unsupported file type');
            }
        } catch (err) {
            fs.unlinkSync(filePath); // Cleanup
            if (userId) {
                SocketService.notifyUser(userId, 'upload:error', {
                    message: 'Failed to parse file text',
                    error: err.message
                });
            }
            return res.status(400).json({ success: false, message: 'Failed to parse file text', error: err.message });
        }

        if (!rawText || rawText.trim().length < 50) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Cleanup
            if (userId) {
                SocketService.notifyUser(userId, 'upload:error', {
                    message: 'Could not extract enough text from document'
                });
            }
            return res.status(400).json({ success: false, message: 'Could not extract enough text from document' });
        }

        // 2. Upload raw file to Cloudinary (optional but requested)
        let cloudinaryUrl = '';
        try {
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: 'resumes/raw',
                resource_type: mimeType === 'application/pdf' ? 'image' : 'auto' 
            });
            cloudinaryUrl = uploadResult.secure_url;
        } catch (err) {
            logger.warn('Failed to upload raw resume to Cloudinary (continuing without it):', err);
        }

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Cleanup local temp file

        // 3. AI Extraction
        logger.info('Calling AI to extract structured data...');
        if (userId) {
            SocketService.notifyUser(userId, 'upload:progress', {
                step: 'parsing',
                progress: 60,
                message: 'Extracting your information using AI...'
            });
        }

        let extractedData;
        try {
            // Use the new aiService extract method
            const aiResponse = await aiService.extract(rawText);
            
            // Ensure we have a valid object
            extractedData = typeof aiResponse === 'string' ? JSON.parse(aiResponse) : aiResponse;
            
            // Basic validation of the structure
            if (!extractedData || (!extractedData.personal && !extractedData.experience)) {
                throw new Error('AI returned invalid or empty structure');
            }
        } catch (err) {
            logger.error('AI Extraction failed:', err);
            if (userId) {
                SocketService.notifyUser(userId, 'upload:error', {
                    message: 'AI failed to structure resume data'
                });
            }
            return res.status(500).json({ success: false, message: 'AI failed to structure resume data' });
        }

        let fileUploadRecord = null;
        if (userId) {
            try {
                fileUploadRecord = await FileUpload.create({
                    userId,
                    originalFilename: originalName,
                    storedFilename: file.filename,
                    fileType: mimeType,
                    fileSize: file.size,
                    storagePath: cloudinaryUrl || filePath,
                    extractionStatus: 'completed',
                    extractionData: extractedData,
                    rawText: rawText
                });
            } catch (dbErr) {
                logger.error('Failed to save FileUpload record:', dbErr);
            }

            SocketService.notifyUser(userId, 'upload:complete', {
                step: 'completed',
                progress: 100,
                message: 'Successfully processed your resume!',
                extractedData,
                uploadId: fileUploadRecord ? fileUploadRecord._id : null
            });
        }

        // Return structured data
        return res.status(200).json({
            success: true,
            extractedData,
            rawText: process.env.NODE_ENV === 'development' ? rawText : undefined, // Useful for debugging locally
            confidence: 0.95, // mock or derived
            fileUrl: cloudinaryUrl,
            uploadId: fileUploadRecord ? fileUploadRecord._id : null
        });

    } catch (error) {
        logger.error('Extraction error:', error);
        
        const userId = req.user ? (req.user._id ? req.user._id.toString() : req.user.id) : null;
        if (userId) {
            SocketService.notifyUser(userId, 'upload:error', {
                message: 'Internal server error during extraction'
            });
        }
        
        return res.status(500).json({ success: false, message: 'Internal server error during extraction' });
    }
};

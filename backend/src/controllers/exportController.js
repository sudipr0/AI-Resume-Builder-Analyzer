import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import { generatePDF } from '../utils/pdfExporter.js';

export const exportPdfController = asyncHandler(async (req, res) => {
    const { htmlContent } = req.body;
    const { resumeId } = req.params;

    if (!htmlContent) {
        return res.status(400).json({ success: false, message: 'HTML content is required' });
    }

    // Verify ownership if resumeId is provided
    if (resumeId && resumeId !== 'temp') {
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found or access denied' });
        }
    }

    // Generate the PDF from HTML and optionally upload to Cloudinary
    // Set uploadToCloudinary to true if you want to store it securely online
    const { pdfBuffer, url } = await generatePDF(htmlContent, false); 

    // Send the buffer back to client as a downloadable file
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${Date.now()}.pdf"`,
        'Content-Length': pdfBuffer.length
    });

    res.status(200).end(pdfBuffer);
});

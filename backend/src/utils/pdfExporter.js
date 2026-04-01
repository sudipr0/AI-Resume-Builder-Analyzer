import puppeteer from 'puppeteer';
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';

/**
 * Generates a PDF from HTML content using Puppeteer and optionally uploads it to Cloudinary.
 * @param {string} htmlContent - Full HTML string of the resume.
 * @param {boolean} uploadToCloudinary - Whether to upload the resulting PDF to Cloudinary.
 * @returns {Promise<{pdfBuffer: Buffer, url?: string}>}
 */
export const generatePDF = async (htmlContent, uploadToCloudinary = false) => {
    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Setting the content and waiting until there are no more than 2 network connections for at least 500 ms
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0', right: '0', bottom: '0', left: '0' }
        });

        const result = { pdfBuffer: Buffer.from(pdfBuffer) };

        if (uploadToCloudinary) {
            // We need to use cloudinary uploader with buffer
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'resumes',
                        public_id: `resume-${nanoid(10)}`,
                        resource_type: 'raw',
                        format: 'pdf',
                        access_mode: 'public'
                    },
                    (error, cloudinaryResult) => {
                        if (error) reject(error);
                        else resolve(cloudinaryResult);
                    }
                );
                uploadStream.end(pdfBuffer);
            });
            result.url = uploadResult.secure_url;
        }

        return result;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error('Failed to generate PDF from HTML');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

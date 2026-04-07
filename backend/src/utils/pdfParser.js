import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// Support CJS/ESM interop for pdf-parse
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule && pdfParseModule.default ? pdfParseModule.default : pdfParseModule;

/**
 * Extracts raw text from a PDF buffer
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>}
 */
export const extractTextFromPDF = async (fileBuffer) => {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text;
    } catch (error) {
        console.error('PDF Parsing Error:', error);

        // Fallback: attempt naive extraction from the raw buffer (useful for some simple PDFs)
        try {
            const raw = fileBuffer.toString('utf8');
            // Find long human-readable runs of characters (printable ascii and whitespace)
            const runs = raw.match(/[\x20-\x7E\n\r]{50,}/g);
            if (runs && runs.length) {
                const candidate = runs.join(' ').replace(/\s{2,}/g, ' ').trim();
                if (candidate.length > 50) {
                    console.warn('PDF fallback: extracted text from raw buffer');
                    return candidate;
                }
            }
        } catch (fallbackErr) {
            console.warn('PDF fallback failed:', fallbackErr);
        }

        throw new Error('Failed to parse PDF document');
    }
};

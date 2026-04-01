import Tesseract from 'tesseract.js';

/**
 * Extracts text from an image buffer using OCR
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>}
 */
export const extractTextFromImage = async (fileBuffer) => {
    try {
        const { data: { text } } = await Tesseract.recognize(fileBuffer, 'eng', {
            // logger: m => console.log(m) // Optional: for debugging OCR progress
        });
        return text;
    } catch (error) {
        console.error('OCR Parsing Error:', error);
        throw new Error('Failed to parse image document via OCR');
    }
};

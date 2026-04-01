import pdfParse from 'pdf-parse';

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
        throw new Error('Failed to parse PDF document');
    }
};

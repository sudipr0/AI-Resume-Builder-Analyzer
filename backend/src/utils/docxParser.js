import mammoth from 'mammoth';

/**
 * Extracts raw text from a DOCX buffer
 * @param {Buffer} fileBuffer 
 * @returns {Promise<string>}
 */
export const extractTextFromDOCX = async (fileBuffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value || '';
    } catch (error) {
        console.error('DOCX Parsing Error:', error);
        throw new Error('Failed to parse DOCX document');
    }
};

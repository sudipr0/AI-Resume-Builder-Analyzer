import express from 'express';
import { 
    createResume, getMyResumes, getResumeById, 
    updateResume, deleteResume, duplicateResume 
} from '../controllers/resumeController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateUser, createResume);
router.get('/my-resumes', authenticateUser, getMyResumes);
router.post('/:id/duplicate', authenticateUser, duplicateResume);

// These need to be placed carefully to not match 'create' or 'my-resumes'
router.get('/:id', getResumeById); // Can be public
router.put('/:id', authenticateUser, updateResume);
router.delete('/:id', authenticateUser, deleteResume);

export default router;

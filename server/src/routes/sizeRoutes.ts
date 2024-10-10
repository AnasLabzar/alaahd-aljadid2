import { Router } from 'express';
import { createSize, getAllSizes } from '../controllers/sizeController';

const router = Router();

// Create a new size
router.post('/sizes', createSize);

// Get all sizes
router.get('/sizes', getAllSizes);

export default router;

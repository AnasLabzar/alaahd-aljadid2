import { Router } from 'express';
import { createSKU, getAllSKUs } from '../controllers/skuControllers';

const router = Router();

// Create a new SKU
router.post('/skus', createSKU);

// Get all SKUs
router.get('/skus', getAllSKUs);

export default router;

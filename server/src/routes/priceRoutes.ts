import { Router } from 'express';
import { createPrice, getPriceById, getAllPrices } from '../controllers/priceController';

const router = Router();

router.post('/prices', createPrice);
router.get('/prices/:id', getPriceById);
router.get('/prices', getAllPrices);

export default router;

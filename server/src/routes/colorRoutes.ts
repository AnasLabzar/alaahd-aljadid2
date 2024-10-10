import { Router } from 'express';
import { createColor, getColors, getColorsById } from '../controllers/colorController';

const router = Router();

router.post('/colors', createColor);
router.get('/colors', getColors);
router.get('/colors/:id', getColorsById);

export default router;

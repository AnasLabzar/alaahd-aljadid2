import { Router } from 'express';
import { createProduct, getProductById, getAllProducts } from '../controllers/productController';

const router = Router();

router.post('/products', createProduct);
router.get('/products/:id', getProductById);
router.get('/products', getAllProducts);

export default router;

import { Router } from 'express';
import { createOrder, getOrderById, getAllOrders } from '../controllers/orderController';

const router = Router();

// Route to create a new order
router.post('/orders', createOrder);

// Route to get an order by ID
router.get('/orders/:id', getOrderById);

// Route to get all orders
router.get('/orders', getAllOrders);

export default router;

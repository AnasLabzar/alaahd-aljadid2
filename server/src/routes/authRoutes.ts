import express from 'express';
import { registerUser, loginUser, getUserById, getUserByCustom, getAllUser } from '../controllers/authController';
import { authorizeRole } from '../middlewares/roleMiddleware';

const router = express.Router();

// Open routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (e.g., only admins can access this)
router.get('/admin', authorizeRole(['admin']), (req, res) => {
  res.send('Admin access granted');
});

router.get('/users/:id', getUserById);
router.get('/users', getAllUser);
router.get('/users/custom', getUserByCustom);


export default router;

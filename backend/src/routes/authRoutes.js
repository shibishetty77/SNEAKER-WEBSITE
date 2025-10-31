import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { requireFields } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', requireFields(['name', 'email', 'password']), register);
router.post('/login', requireFields(['email', 'password']), login);
router.get('/me', protect, me);

export default router;

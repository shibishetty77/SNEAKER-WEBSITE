import { Router } from 'express';
import { addReview, getReviewsByProduct, getRatingSummary } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/product/:id', getReviewsByProduct);
router.get('/product/:id/summary', getRatingSummary);
router.post('/', protect, requireFields(['productId', 'rating']), addReview);

export default router;

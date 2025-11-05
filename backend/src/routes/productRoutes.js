import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  seedProducts, 
  createProduct, 
  deleteProduct, 
  purchaseProduct,
  customizeProduct 
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/seed', seedProducts);
router.post('/', protect, createProduct);
router.post('/customize', protect, customizeProduct); // New customization endpoint
router.delete('/:id', protect, deleteProduct);
router.post('/:id/purchase', protect, purchaseProduct);

export default router;

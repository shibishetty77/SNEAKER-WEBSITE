import { Router } from 'express'
import { listByBrand, importBrand } from '../controllers/brandController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/:brand', listByBrand)
router.post('/:brand/import', protect, importBrand)

export default router

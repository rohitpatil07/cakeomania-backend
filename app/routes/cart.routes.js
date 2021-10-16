import { Router } from 'express';
const router = Router();
import cartControllers from '../controllers/cart.controllers.js';

router.get('/getcart/:user', cartControllers.getCart);
router.post('/addtocart', cartControllers.addToCart);
router.post('/delete', cartControllers.removeFromCart);

export default router;

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import cartRoutes from './cart.routes.js';
import searchRoutes from './search.routes.js';
import cakeRoutes from './cake.routes.js';
import userRoutes from './user.route.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/search', searchRoutes);
router.use('/api', cakeRoutes);
router.use('/users', userRoutes);

export default router;

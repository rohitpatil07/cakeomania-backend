import { Router } from 'express';
import cakeControllers from '../controllers/cake.controllers.js';

const router = Router();

router.get('/cakes', cakeControllers.getallcakes);
router.get('/cakes/:limit', cakeControllers.getbestsellers);
router.get('/cake/:id', cakeControllers.getcakebyid);

export default router;

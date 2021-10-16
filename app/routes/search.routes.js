import { Router } from 'express';
const router = Router();
import searchControllers from '../controllers/search.controllers.js';

router.get('/', searchControllers.searchpattern);

export default router;

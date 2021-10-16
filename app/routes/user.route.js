import { Router } from 'express';
const router = Router();
import userControllers from '../controllers/user.controllers.js';

router.get('/getuser/:user', userControllers.getuser);

export default router;

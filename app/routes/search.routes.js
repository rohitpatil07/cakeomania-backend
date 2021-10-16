import { Router } from 'express';
const router = Router();
import searchControllers from '../controllers/search.controllers.js';

router.get('/', searchControllers.searchpattern);
router.get('/message', (req,res)=>{
    res.json("THIS IS A NEW ADDITTION MESSAGE TO VERIFY GITHUB ACTONS");
})

export default router;

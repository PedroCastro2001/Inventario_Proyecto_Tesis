import { Router } from 'express';
import { getKardexStockPrincipal } from '../controllers/kardex.controller.js';
const router = Router();

router.get("/kardex", getKardexStockPrincipal);

export default router;
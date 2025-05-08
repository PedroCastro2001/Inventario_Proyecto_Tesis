import { Router } from 'express';
import { getResumenStock, getExistenciasYConsumos } from '../controllers/stock.controller.js';
import { requireLogin } from '../middlewares/requireLogin.js';

const router = Router();

router.post("/stock", requireLogin, getResumenStock);
router.get("/existencias-consumos", requireLogin, getExistenciasYConsumos);

export default router;
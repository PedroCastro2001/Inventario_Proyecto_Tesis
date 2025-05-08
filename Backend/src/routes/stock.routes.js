import { Router } from 'express';
import { getResumenStock, getExistenciasYConsumos } from '../controllers/stock.controller.js';
import { requireLogin } from '../middlewares/requireLogin.js';

const router = Router();

router.post("/stock", getResumenStock);
router.get("/existencias-consumos", getExistenciasYConsumos);

export default router;
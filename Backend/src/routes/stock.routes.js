import { Router } from 'express';
import { verificarToken } from "../middlewares/requireLogin.js";
import { getResumenStock, getExistenciasYConsumos, getBalanceStock } from '../controllers/stock.controller.js';

const router = Router();
router.use(verificarToken);

router.post("/stock", getResumenStock);
router.get("/existencias-consumos", getExistenciasYConsumos);
router.get("/stock/balance-stock", getBalanceStock);

export default router;
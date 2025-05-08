import { pool } from "../DB/db.js";
import { Router } from "express";

import {
    createEgreso,
    deleteEgreso,
    getEgreso,
    getEgresos,
    createEgresosConTransaccion,
    getLotesPorInsumoYPresentacion,
} from "../controllers/egresos.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/egresos", requireLogin, getEgresos);
router.get("/egresos/:cod_egreso", requireLogin ,getEgreso);
router.delete("/egresos/:cod_egreso", requireLogin, deleteEgreso);
router.post("/egresos", requireLogin, createEgreso);
router.post('/egresos/lote',requireLogin, createEgresosConTransaccion);
router.get('/lotes/:cod_insumo/:cod_presentacion', requireLogin, getLotesPorInsumoYPresentacion);

export default router;
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

const router = Router();

router.get("/egresos", getEgresos);
router.get("/egresos/:cod_egreso", getEgreso);
router.delete("/egresos/:cod_egreso", deleteEgreso);
router.post("/egresos", createEgreso);
router.post('/egresos/lote', createEgresosConTransaccion);
router.get('/lotes/:cod_insumo/:cod_presentacion', getLotesPorInsumoYPresentacion);

export default router;
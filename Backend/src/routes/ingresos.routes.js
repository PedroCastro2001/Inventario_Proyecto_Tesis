import { pool } from "../DB/db.js";
import { Router } from "express";

import {
    createIngreso,
    deleteIngreso,
    getIngreso,
    getIngresos,
    createIngresosConTransaccion,
} from "../controllers/ingresos.controller.js";

const router = Router();

router.get("/ingresos", getIngresos);
router.get("/ingresos/:cod_ingreso", getIngreso);
router.delete("/ingresos/:cod_ingreso", deleteIngreso);
router.post("/ingresos", createIngreso);
router.post('/ingresos/lote', createIngresosConTransaccion);

export default router;
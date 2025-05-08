import { pool } from "../DB/db.js";
import { Router } from "express";

import {
    createIngreso,
    deleteIngreso,
    getIngreso,
    getIngresos,
    createIngresosConTransaccion,
} from "../controllers/ingresos.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/ingresos", requireLogin, getIngresos);
router.get("/ingresos/:cod_ingreso", requireLogin, getIngreso);
router.delete("/ingresos/:cod_ingreso", requireLogin, deleteIngreso);
router.post("/ingresos", requireLogin, createIngreso);
router.post('/ingresos/lote', requireLogin, createIngresosConTransaccion);

export default router;
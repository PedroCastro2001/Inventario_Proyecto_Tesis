import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";

import {
    createIngreso,
    deleteIngreso,
    getIngreso,
    getIngresos,
    createIngresosConTransaccion,
    getIngresosReqTemporal,
    updateNoRequisicion,
} from "../controllers/ingresos.controller.js";

const router = Router();
router.use(verificarToken);

router.get("/ingresos", getIngresos);
router.get("/ingresos/req_temporales", getIngresosReqTemporal)
router.get("/ingresos/:cod_ingreso", getIngreso);
router.delete("/ingresos/:cod_ingreso", deleteIngreso);
router.post("/ingresos", createIngreso);
router.post('/ingresos/lote', createIngresosConTransaccion);
router.post("/ingresos/actualizar_no_requisicion", updateNoRequisicion);

export default router;
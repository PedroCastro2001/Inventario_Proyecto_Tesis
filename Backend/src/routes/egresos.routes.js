import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";
import {
    createEgreso,
    deleteEgreso,
    getEgreso,
    getEgresos,
    createEgresosConTransaccion,
    getLotesPorInsumoYPresentacion,
    getCantidadDisponiblePorLote
} from "../controllers/egresos.controller.js";

const router = Router();
router.use(verificarToken);

router.get("/egresos", getEgresos);
router.get("/egresos/:cod_egreso"  ,getEgreso);
router.delete("/egresos/:cod_egreso",  deleteEgreso);
router.post("/egresos",  createEgreso);
router.post('/egresos/lote', createEgresosConTransaccion);
router.get('/lotes/:cod_insumo/:cod_presentacion',  getLotesPorInsumoYPresentacion);
router.get('/lotes/:cod_insumo/:cod_presentacion/:cod_lote', getCantidadDisponiblePorLote);

export default router;
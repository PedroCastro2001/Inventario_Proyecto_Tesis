import { Router } from "express";

import {
    getInsumosCercanosCantidadMinima,
    getLotesProximosAVencer,
    getInsumosAgotados,
    getCantidadInsumosAgotados,
    getCantidadReqTemporales,
    getCantidadLotesVencidos,
    getLotesVencidos,
    getTransaccionesHoy
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/dashboard/insumos-por-agotarse", getInsumosCercanosCantidadMinima);
router.get("/dashboard/lotes-proximos-a-vencer", getLotesProximosAVencer);
router.get("/dashboard/insumos-agotados", getInsumosAgotados);
router.get("/dashboard/cantidad-insumos-agotados", getCantidadInsumosAgotados);
router.get("/dashboard/cantidad-requisiciones-temporales", getCantidadReqTemporales);
router.get("/dashboard/cantidad-lotes-vencidos", getCantidadLotesVencidos);
router.get("/dashboard/lotes-vencidos", getLotesVencidos);
router.get("/dashboard/transacciones-hoy", getTransaccionesHoy);
export default router;

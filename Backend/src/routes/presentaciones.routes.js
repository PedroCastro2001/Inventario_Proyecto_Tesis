import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";
import {
  createPresentacion,
  deletePresentacion,
  getPresentacion,
  getPresentaciones,
  getPresentacionesInsumo,
  updatePresentacion,
} from "../controllers/presentaciones.controller.js";

const router = Router();
router.use(verificarToken);

router.get("/presentaciones", getPresentaciones);
router.get("/presentaciones/:cod_presentacion", getPresentacion);
router.get("/presentaciones/insumo/:cod_insumo", getPresentacionesInsumo);
router.delete("/presentaciones/:cod_presentacion", deletePresentacion);
router.post("/presentaciones", createPresentacion);
router.patch("/presentaciones/:cod_presentacion", updatePresentacion);

export default router;
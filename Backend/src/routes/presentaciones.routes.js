import { Router } from "express";
import {
  createPresentacion,
  deletePresentacion,
  getPresentacion,
  getPresentaciones,
  getPresentacionesInsumo,
  updatePresentacion,
} from "../controllers/presentaciones.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/presentaciones", requireLogin, getPresentaciones);
router.get("/presentaciones/:cod_presentacion", requireLogin, getPresentacion);
router.get("/presentaciones/insumo/:cod_insumo", requireLogin, getPresentacionesInsumo);
router.delete("/presentaciones/:cod_presentacion", requireLogin, deletePresentacion);
router.post("/presentaciones", requireLogin, createPresentacion);
router.patch("/presentaciones/:cod_presentacion", requireLogin, updatePresentacion);

export default router;
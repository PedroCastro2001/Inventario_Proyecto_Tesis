import { Router } from "express";
import {
  createInsumo,
  deleteInsumo,
  getInsumo,
  getInsumos,
  updateInsumo,
} from "../controllers/insumos.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/insumos", getInsumos);
router.get("/insumos/:cod_insumo", getInsumo);
router.delete("/insumos/:cod_insumo",  deleteInsumo);
router.post("/insumos", createInsumo);
router.patch("/insumos/:cod_insumo",  updateInsumo);

export default router;
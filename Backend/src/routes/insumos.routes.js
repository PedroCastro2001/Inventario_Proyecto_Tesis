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

router.get("/insumos", requireLogin, getInsumos);
router.get("/insumos/:cod_insumo",requireLogin, getInsumo);
router.delete("/insumos/:cod_insumo", requireLogin, deleteInsumo);
router.post("/insumos", requireLogin, createInsumo);
router.patch("/insumos/:cod_insumo", requireLogin, updateInsumo);

export default router;
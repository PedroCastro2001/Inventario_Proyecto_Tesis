import { Router } from "express";
import {
  createArea,
  deleteArea,
  getArea,
  getAreas,
  updateArea,
} from "../controllers/areas.controller.js";
import { verificarToken } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/areas", verificarToken, getAreas);
router.get("/areas/:cod_area", verificarToken, getArea);
router.delete("/areas/:cod_area", verificarToken, deleteArea);
router.post("/areas", verificarToken, createArea);
router.put("/areas/:cod_area", verificarToken, updateArea);

export default router;
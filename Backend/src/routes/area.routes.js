import { Router } from "express";
import {
  createArea,
  deleteArea,
  getArea,
  getAreas,
  updateArea,
} from "../controllers/areas.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/areas", requireLogin, getAreas);
router.get("/areas/:cod_area", requireLogin, getArea);
router.delete("/areas/:cod_area", requireLogin, requireLogin, deleteArea);
router.post("/areas", requireLogin, createArea);
router.patch("/areas/:cod_area", requireLogin, updateArea);

export default router;
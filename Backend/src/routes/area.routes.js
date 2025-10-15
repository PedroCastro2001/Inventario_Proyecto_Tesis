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

router.get("/areas", getAreas);
router.get("/areas/:cod_area", getArea);
router.delete("/areas/:cod_area", deleteArea);
router.post("/areas", createArea);
router.put("/areas/:cod_area", updateArea);

export default router;
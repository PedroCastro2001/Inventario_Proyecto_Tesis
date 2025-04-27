import { Router } from "express";
import {
  createArea,
  deleteArea,
  getArea,
  getAreas,
  updateArea,
} from "../controllers/areas.controller.js";

const router = Router();

router.get("/areas", getAreas);
router.get("/areas/:cod_area", getArea);
router.delete("/areas/:cod_area", deleteArea);
router.post("/areas", createArea);
router.patch("/areas/:cod_area", updateArea);

export default router;
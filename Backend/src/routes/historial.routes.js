import { Router } from "express";

import {
    getHistorialMovimientos,
} from "../controllers/historial.controller.js";
import { requireLogin } from "../middlewares/requireLogin.js";

const router = Router();

router.get("/historial", getHistorialMovimientos);

export default router;
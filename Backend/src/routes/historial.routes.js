import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";
import {
    getHistorialMovimientos,
} from "../controllers/historial.controller.js";

const router = Router();

router.get("/historial", verificarToken, getHistorialMovimientos);

export default router;
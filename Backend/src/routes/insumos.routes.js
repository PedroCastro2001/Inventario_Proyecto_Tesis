import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";
import {
  createInsumo,
  deleteInsumo,
  getInsumo,
  getInsumos,
  updateInsumo,
  cargaMasivaInsumos
} from "../controllers/insumos.controller.js";
import multer from 'multer';

const router = Router();
router.use(verificarToken);
const upload = multer({ dest: 'uploads/' }); // carpeta temporal

router.get("/insumos", getInsumos);
router.get("/insumos/:cod_insumo", getInsumo);
router.delete("/insumos/:cod_insumo",  deleteInsumo);
router.post("/insumos", createInsumo);
router.patch("/insumos/:cod_insumo",  updateInsumo);
router.post('/insumos/carga-masiva', upload.single('archivo'), cargaMasivaInsumos);

export default router;
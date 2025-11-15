import { Router } from "express";
import { verificarToken } from "../middlewares/requireLogin.js";
import {
  getUsuarios,
  crearUsuario,
  cambiarContrasena,
  actualizarEstadoUsuario,
  eliminarUsuario
} from "../controllers/usuarios.controller.js";

const router = Router();
router.use(verificarToken);

// Obtener todos los usuarios
router.get("/usuarios", getUsuarios);

// Crear un nuevo usuario
router.post("/usuarios", crearUsuario);

// Cambiar contraseña (por ID)
router.put("/usuarios/:id_usuario/password", cambiarContrasena);

// Activar o desactivar usuario
router.put("/usuarios/:id_usuario/estado", actualizarEstadoUsuario);

// Eliminar usuario
router.delete("/usuarios/:id_usuario", eliminarUsuario);

export default router;
import { pool } from "../DB/db.js";
import { Router } from "express";
import {
    createUser,
    login,
    profile,
    logout,
    registrarNombreInvitado,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/crearUsuario", createUser);
router.post("/auth/login", login);
router.get("/auth/profile", profile);
router.get("/auth/logout", logout);
router.post("/auth/registrarNombreInvitado", registrarNombreInvitado);
/*router.get('/auth/verificarSesion', (req, res) => {
    if (req.session && req.session.user) {
      res.status(200).json({ usuario: req.session.user });
    } else {
      res.status(401).json({ error: 'No hay sesión activa' });
    }
  });*/


export default router;

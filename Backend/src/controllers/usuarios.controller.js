import { getPool } from "../DB/db.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const [rows] = await pool.query("SELECT id_usuario, nombre_usuario, nombre_completo, rol, activo FROM usuario");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Crear nuevo usuario
export const crearUsuario = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { nombre_usuario, contrasena, rol, nombre_completo } = req.body;

    /*if (!nombre_usuario || !contrasena || !confirmar_contrasena || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (contrasena !== confirmar_contrasena) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }*/

    // Verificar si el usuario ya existe
    const [existe] = await pool.query("SELECT * FROM usuario WHERE nombre_usuario = ?", [nombre_usuario]);
    if (existe.length > 0) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    await pool.query(
      "INSERT INTO usuario (nombre_usuario, contrasena, rol, activo, nombre_completo) VALUES (?, ?, ?, TRUE, ?)",
      [nombre_usuario, hash, rol, nombre_completo || null]
    );

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { id_usuario } = req.params;
    const { contrasena_actual, nueva_contrasena, confirmar_contrasena } = req.body;

    if (!nueva_contrasena || !confirmar_contrasena) {
      return res.status(400).json({ message: "Debe ingresar la nueva contraseña y su confirmación" });
    }

    if (nueva_contrasena !== confirmar_contrasena) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    // Obtener la contraseña actual
    const [rows] = await pool.query("SELECT contrasena FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si envía la actual, se valida
    if (contrasena_actual) {
      const esValida = await bcrypt.compare(contrasena_actual, rows[0].contrasena);
      if (!esValida) {
        return res.status(400).json({ message: "La contraseña actual es incorrecta" });
      }
    }

    // Guardar nueva contraseña
    const hash = await bcrypt.hash(nueva_contrasena, 10);
    await pool.query("UPDATE usuario SET contrasena = ? WHERE id_usuario = ?", [hash, id_usuario]);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};

// Activar o desactivar usuario
export const actualizarEstadoUsuario = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { id_usuario } = req.params;
    const { activo } = req.body;

    await pool.query("UPDATE usuario SET activo = ? WHERE id_usuario = ?", [activo, id_usuario]);
    res.json({ message: `Usuario ${activo ? "activado" : "desactivado"} correctamente` });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar estado del usuario" });
  }
};

// Eliminar usuario definitivamente
export const eliminarUsuario = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { id_usuario } = req.params;
    await pool.query("DELETE FROM usuario WHERE id_usuario = ?", [id_usuario]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
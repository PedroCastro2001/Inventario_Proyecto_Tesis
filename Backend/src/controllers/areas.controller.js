import { getPool } from "../DB/db.js";

export const getAreas = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const [rows] = await pool.query("SELECT * FROM area");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

export const getArea = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { cod_area } = req.params;
    const [rows] = await pool.query("SELECT * FROM area WHERE cod_area = ?", [
      cod_area,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

export const createArea = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { nombre } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO area (nombre) VALUES (?)",
      [nombre]
    );
    res.status(201).json({ nombre });
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" , error: error.message});
  }
};

export const updateArea = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { cod_area } = req.params;
    const { nombre } = req.body;

    const [result] = await pool.query(
      "UPDATE area SET nombre = IFNULL(?, nombre) WHERE cod_area = ?",
      [nombre, cod_area]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Área no encontrada" });

    const [rows] = await pool.query("SELECT * FROM area WHERE cod_area = ?", [
      cod_area,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    const { cod_area } = req.params;
    const [rows] = await pool.query("DELETE FROM area WHERE cod_area = ?", [
      cod_area,
    ]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Área no encontrada" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Algo salió mal" });
  }
};
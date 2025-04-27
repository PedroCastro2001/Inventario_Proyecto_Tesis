import { pool } from "../DB/db.js";

export const getInsumos = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM insumo");
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const getInsumo = async (req, res) => {
    try {
      const { cod_insumo } = req.params;
      const [rows] = await pool.query("SELECT * FROM insumo WHERE cod_insumo = ?", [
        cod_insumo,
      ]);
  
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Insumo no encontrado" });
      }
  
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };
  
  export const deleteInsumo = async (req, res) => {
    try {
      const { cod_insumo } = req.params;
      const [rows] = await pool.query("DELETE FROM insumo WHERE cod_insumo = ?", [cod_insumo]);
  
      if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "Insumo no encontrado" });
      }
  
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };
  
  export const createInsumo = async (req, res) => {

    const fecha_creacion = new Date(); 

    try {
      const { cod_insumo, nombre, cant_min, cant_max } = req.body;
      const [rows] = await pool.query(
        "INSERT INTO insumo (cod_insumo, nombre, "+
        "fecha_creacion, cant_min, cant_max) VALUES (?, ?, ?, ?, ?)",
        [cod_insumo, nombre, fecha_creacion, cant_min, cant_max]
      );
      res.status(201).json({ cod_insumo, nombre, fecha_creacion, cant_min, cant_max });
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" , error: error.message});
    }
  };
  
  export const updateInsumo = async (req, res) => {
    try {
      const { cod_insumo } = req.params;
      const { nombre, fecha_creacion, cant_min, cant_max } = req.body;
  
      const [result] = await pool.query(
        "UPDATE insumo SET nombre = IFNULL(?, nombre), "+
        "fecha_creacion = IFNULL(?, fecha_creacion), "+
        " cant_min = IFNULL(?, cant_min), "+
        " cant_max = IFNULL(?, cant_max) WHERE cod_insumo = ?"+
        [nombre,fecha_creacion, cant_min, cant_max, cod_insumo]
      );
  
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Insumo no encontrado" });
  
      const [rows] = await pool.query("SELECT * FROM insumo WHERE cod_insumo = ?", [
        cod_insumo,
      ]);
  
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };


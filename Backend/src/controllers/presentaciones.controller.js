import { pool } from "../DB/db.js";

export const getPresentaciones = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM presentacion");
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const getPresentacion = async (req, res) => {
    try {
        const { cod_presentacion } = req.params;
        const [rows] = await pool.query("SELECT * FROM presentacion WHERE cod_presentacion = ?", [
            cod_presentacion,
        ]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Presentación no encontrada" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const getPresentacionesInsumo = async (req, res) => {
    try {
        const { cod_insumo } = req.params;
        const [rows] = await pool.query("SELECT * FROM presentacion WHERE cod_insumo = ?", [
            cod_insumo,
        ]);

        if (rows.length <= 0) {
            return res.status(404).json({ message: "Presentaciones no encontradas" });
        }

        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const createPresentacion = async (req, res) => {
    try {
        const { cod_presentacion, nombre, cod_insumo } = req.body;
        const fecha_creacion = new Date(); 
        const [result] = await pool.query(
            "INSERT INTO presentacion (cod_presentacion, nombre, cod_insumo, fecha_creacion) VALUES (?, ?, ?, ?)",
            [cod_presentacion, nombre, cod_insumo, fecha_creacion]
        );

        res.status(201).json({ cod_presentacion, nombre, cod_insumo, fecha_creacion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const updatePresentacion = async (req, res) => {
    try {
        const { cod_presentacion } = req.params;
        const { nombre, cod_insumo, fecha_creacion } = req.body;

        const [result] = await pool.query(
            "UPDATE presentacion SET nombre = IFNULL(?, nombre), cod_insumo = IFNULL(?, cod_insumo), fecha_creacion = IFNULL(?, fecha_creacion), WHERE cod_presentacion = ?",
            [nombre, cod_insumo, fecha_creacion, cod_presentacion]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Presentación no encontrada" });
        }

        const [rows] = await pool.query("SELECT * FROM presentacion WHERE cod_presentacion = ?", [
            cod_presentacion,
        ]);

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const deletePresentacion = async (req, res) => {
    try {
        const { cod_presentacion } = req.params;
        const [result] = await pool.query("DELETE FROM presentacion WHERE cod_presentacion = ?", [
            cod_presentacion,
        ]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: "Presentación no encontrada" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal" });
    }
};
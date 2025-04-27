import { pool } from "../DB/db.js";

export const getEgresos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, t.tipo_transaccion, t.fecha 
            FROM egreso e
            JOIN transaccion t ON e.cod_transaccion = t.cod_transaccion
        `);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const getEgreso = async (req, res) => {
    try {
        const { cod_egreso } = req.params;
        const [rows] = await pool.query(`
            SELECT e.*, t.tipo_transaccion, t.fecha 
            FROM egreso e
            JOIN transaccion t ON e.cod_transaccion = t.cod_transaccion
            WHERE e.cod_egreso = ?
        `, [cod_egreso]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Egreso no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const deleteEgreso = async (req, res) => {
    try {
        const { cod_egreso } = req.params;

        const [egreso] = await pool.query("SELECT cod_transaccion FROM egreso WHERE cod_egreso = ?", [cod_egreso]);
        if (egreso.length === 0) {
            return res.status(404).json({ message: "Egreso no encontrado" });
        }
        const cod_transaccion = egreso[0].cod_transaccion;

        await pool.query("DELETE FROM egreso WHERE cod_egreso = ?", [cod_egreso]);

        await pool.query("DELETE FROM transaccion WHERE cod_transaccion = ?", [cod_transaccion]);

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const createEgreso = async (req, res) => {
    const fechaActual = new Date();

    try {
        const {
            cod_area,
            cod_insumo,
            cantidad
        } = req.body;

        // 1. Crear transacción
        const [transaccionResult] = await pool.query(
            "INSERT INTO transaccion (tipo_transaccion, fecha) VALUES (?, ?)",
            ['Egreso', fechaActual]
        );

        const cod_transaccion = transaccionResult.insertId;

        // 2. Crear egreso
        const [egresoResult] = await pool.query(
            `INSERT INTO egreso 
            (cod_transaccion, cod_area, cod_insumo, cantidad) 
            VALUES (?, ?, ?, ?)`,
            [
                cod_transaccion,
                cod_area,
                cod_insumo,
                cantidad
            ]
        );

        res.status(201).json({
            message: 'Egreso creado exitosamente',
            cod_egreso: egresoResult.insertId,
            cod_transaccion
        });
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

//Agregar varios egresos en una sola transacción.
export const createEgresosConTransaccion = async (req, res) => {
    const fechaActual = new Date();

    try {
        const { egresos } = req.body;

        if (!Array.isArray(egresos) || egresos.length === 0) {
            return res.status(400).json({ message: 'No hay egresos para registrar' });
        }

        // 1. Crear transacción
        const [transaccionResult] = await pool.query(
            "INSERT INTO transaccion (tipo_transaccion, fecha) VALUES (?, ?)",
            ['Egreso', fechaActual]
        );
        const cod_transaccion = transaccionResult.insertId;

        // 2. Insertar todos los egresos con ese cod_transaccion
        for (const egreso of egresos) {
            const {
                cod_area,
                cod_insumo,
                cod_presentacion,
                cod_lote,
                cantidad,
                observaciones,
            } = egreso;

            await pool.query(
                `INSERT INTO egreso 
                (cod_transaccion, cod_area, cod_insumo, cod_presentacion, cod_lote, cantidad, observaciones) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    cod_transaccion,
                    cod_area,
                    cod_insumo,
                    cod_presentacion,
                    cod_lote,
                    cantidad,
                    observaciones
                ]
            );
        }

        res.status(201).json({
            message: 'Egresos guardados exitosamente',
            cod_transaccion,
        });

    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const getLotesPorInsumoYPresentacion = async (req, res) => {
    const { cod_insumo, cod_presentacion } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT cod_lote, fecha_vencimiento, 
                    SUM(cantidad_ingresada) AS cantidad_disponible
             FROM ingreso
             WHERE cod_insumo = ? AND cod_presentacion = ?
             GROUP BY cod_lote, fecha_vencimiento`,
            [cod_insumo, cod_presentacion]
        );

        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los lotes', error: error.message });
    }
};
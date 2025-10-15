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
            `
            SELECT 
                i.cod_lote,
                i.fecha_vencimiento,
                SUM(i.cantidad_ingresada) - COALESCE(SUM(e.cantidad), 0) AS cantidad_disponible
            FROM ingreso i
            LEFT JOIN egreso e 
                ON i.cod_insumo = e.cod_insumo
                AND i.cod_presentacion = e.cod_presentacion
                AND i.cod_lote = e.cod_lote
            WHERE i.cod_insumo = ? 
              AND i.cod_presentacion = ?
              AND i.fecha_vencimiento >= CURDATE()
            GROUP BY i.cod_lote, i.fecha_vencimiento
            HAVING cantidad_disponible > 0
            ORDER BY i.fecha_vencimiento ASC
            `,
            [cod_insumo, cod_presentacion]
        );

        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener los lotes', error: error.message });
    }
};

export const getCantidadDisponiblePorLote = async (req, res) => {
    const { cod_insumo, cod_presentacion, cod_lote } = req.params;

    try {
        const [rows] = await pool.query(
            `
            SELECT 
                i.cod_insumo,
                i.cod_presentacion,
                i.cod_lote,
                COALESCE(ingresos.total_ingresado, 0) AS total_ingresado,
                COALESCE(egresos.total_egresado, 0) AS total_egresado,
                COALESCE(ingresos.total_ingresado, 0) - COALESCE(egresos.total_egresado, 0) AS cantidad_disponible
            FROM ingreso i
            LEFT JOIN (
                SELECT cod_insumo, cod_presentacion, cod_lote, SUM(cantidad_ingresada) AS total_ingresado
                FROM ingreso
                GROUP BY cod_insumo, cod_presentacion, cod_lote
            ) ingresos ON i.cod_insumo = ingresos.cod_insumo 
                      AND i.cod_presentacion = ingresos.cod_presentacion
                      AND i.cod_lote = ingresos.cod_lote
            LEFT JOIN (
                SELECT cod_insumo, cod_presentacion, cod_lote, SUM(cantidad) AS total_egresado
                FROM egreso
                GROUP BY cod_insumo, cod_presentacion, cod_lote
            ) egresos ON i.cod_insumo = egresos.cod_insumo 
                      AND i.cod_presentacion = egresos.cod_presentacion
                      AND i.cod_lote = egresos.cod_lote
            WHERE i.cod_insumo = ? AND i.cod_presentacion = ? AND i.cod_lote = ?
            GROUP BY i.cod_insumo, i.cod_presentacion, i.cod_lote, ingresos.total_ingresado, egresos.total_egresado
            `,
            [cod_insumo, cod_presentacion, cod_lote]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Lote no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error en getCantidadDisponiblePorLote:", error);
        return res.status(500).json({ message: 'Error al obtener la cantidad disponible', error: error.message });
    }
};
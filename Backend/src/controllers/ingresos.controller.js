import { pool } from "../DB/db.js";

export const getIngresos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT i.*, t.tipo_transaccion, t.fecha 
            FROM ingreso i
            JOIN transaccion t ON i.cod_transaccion = t.cod_transaccion
        `);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const getIngreso = async (req, res) => {
    try {
        const { cod_ingreso } = req.params;
        const [rows] = await pool.query(`
            SELECT i.*, t.tipo_transaccion, t.fecha 
            FROM ingreso i
            JOIN transaccion t ON i.cod_transaccion = t.cod_transaccion
            WHERE i.cod_ingreso = ?
        `, [cod_ingreso]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const deleteIngreso = async (req, res) => {
    try {
        const { cod_ingreso } = req.params;

        const [ingreso] = await pool.query("SELECT cod_transaccion FROM ingreso WHERE cod_ingreso = ?", [cod_ingreso]);
        if (ingreso.length === 0) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }
        const cod_transaccion = ingreso[0].cod_transaccion;

        await pool.query("DELETE FROM ingreso WHERE cod_ingreso = ?", [cod_ingreso]);

        await pool.query("DELETE FROM transaccion WHERE cod_transaccion = ?", [cod_transaccion]);

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const createIngreso = async (req, res) => {
    const fechaActual = new Date();

    try {
        const {
            no_requisicion,
            cod_insumo,
            cod_presentacion,
            cod_lote,
            fecha_vencimiento,
            cantidad_ingresada,
            cantidad_solicitada,
            demanda_insatisfecha,
            observaciones
        } = req.body;

        const [transaccionResult] = await pool.query(
            "INSERT INTO transaccion (tipo_transaccion, fecha) VALUES (?, ?)",
            ['Ingreso', fechaActual]
        );

        const cod_transaccion = transaccionResult.insertId;

        const [ingresoResult] = await pool.query(
            `INSERT INTO ingreso 
            (cod_transaccion, no_requisicion, cod_insumo, cod_presentacion, cod_lote, fecha_vencimiento, cantidad_ingresada, cantidad_solicitada, demanda_insatisfecha, observaciones) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cod_transaccion,
                no_requisicion,
                cod_insumo,
                cod_presentacion,
                cod_lote,
                fecha_vencimiento,
                cantidad_ingresada,
                cantidad_solicitada,
                demanda_insatisfecha,
                observaciones
            ]
        );

        res.status(201).json({
            message: 'Ingreso creado exitosamente',
            cod_ingreso: ingresoResult.insertId,
            cod_transaccion
        });
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const updateIngreso = async (req, res) => {
    try {
        const { cod_ingreso } = req.params;
        const {
            no_requisicion,
            cod_insumo,
            cod_presentacion,
            cod_lote,
            fecha_vencimiento,
            cantidad_ingresada,
            cantidad_solicitada,
            demanda_insatisfecha,
            observaciones
        } = req.body;

        const [result] = await pool.query(
            `UPDATE ingreso SET 
            no_requisicion = IFNULL(?, no_requisicion),
            cod_insumo = IFNULL(?, cod_insumo),
            cod_presentacion = IFNULL(?, cod_presentacion),
            cod_lote = IFNULL(?, cod_lote),
            fecha_vencimiento = IFNULL(?, fecha_vencimiento),
            cantidad_ingresada = IFNULL(?, cantidad_ingresada),
            cantidad_solicitada = IFNULL(?, cantidad_solicitada),
            demanda_insatisfecha = IFNULL(?, demanda_insatisfecha),
            observaciones = IFNULL(?, observaciones)
            WHERE cod_ingreso = ?`,
            [
                no_requisicion,
                cod_insumo,
                cod_presentacion,
                cod_lote,
                fecha_vencimiento,
                cantidad_ingresada,
                cantidad_solicitada,
                demanda_insatisfecha,
                observaciones,
                cod_ingreso
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ingreso no encontrado" });
        }

        res.json({ message: "Ingreso actualizado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

//Agregar varios ingresos en una sola transacción.
export const createIngresosConTransaccion = async (req, res) => {
    const fechaActual = new Date();

    try {
        const { no_requisicion, ingresos } = req.body;

        if (!Array.isArray(ingresos) || ingresos.length === 0) {
            return res.status(400).json({ message: 'No hay ingresos para registrar' });
        }

        // 1. Crear transacción
        const [transaccionResult] = await pool.query(
            "INSERT INTO transaccion (tipo_transaccion, fecha) VALUES (?, ?)",
            ['Ingreso', fechaActual]
        );
        const cod_transaccion = transaccionResult.insertId;

        // 2. Insertar todos los ingresos con ese cod_transaccion
        for (const ingreso of ingresos) {
            const {
                cod_insumo,
                cod_presentacion,
                cod_lote,
                fecha_vencimiento,
                cantidad_ingresada,
                cantidad_solicitada,
                demanda_insatisfecha,
                observaciones
            } = ingreso;

            await pool.query(
                `INSERT INTO ingreso 
                (cod_transaccion, no_requisicion, cod_insumo, cod_presentacion, cod_lote, fecha_vencimiento, cantidad_ingresada, cantidad_solicitada, demanda_insatisfecha, observaciones) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    cod_transaccion,
                    no_requisicion,
                    cod_insumo,
                    cod_presentacion,
                    cod_lote,
                    fecha_vencimiento,
                    cantidad_ingresada,
                    cantidad_solicitada,
                    demanda_insatisfecha,
                    observaciones
                ]
            );
        }

        res.status(201).json({
            message: 'Ingresos guardados exitosamente',
            cod_transaccion,
        });

    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const getIngresosReqTemporal = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                i.no_requisicion, 
                COUNT(*) as cantidad_ingresos,
                MIN(t.fecha) as fecha
            FROM ingreso i
            JOIN transaccion t ON i.cod_transaccion = t.cod_transaccion
            WHERE i.no_requisicion LIKE 'TMP-%'
            GROUP BY i.no_requisicion;
        `);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};

export const updateNoRequisicion = async (req, res) => {
    try {
        const { tempNoRequisicion, newNoRequisicion } = req.body;

        if (!tempNoRequisicion || !newNoRequisicion) {
            return res.status(400).json({ message: "Debes enviar el número de requisición temporal y el nuevo número de requisición" });
        }

        const [result] = await pool.query(
            "UPDATE ingreso SET no_requisicion = ? WHERE no_requisicion = ?",
            [newNoRequisicion, tempNoRequisicion]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontraron ingresos con ese no_requisicion" });
        }

        res.json({ 
            message: "Número de requisición actualizado exitosamente",
            tempNoRequisicion,
            newNoRequisicion,
            updatedRows: result.affectedRows
        });
    } catch (error) {
        return res.status(500).json({ message: "Algo salió mal", error: error.message });
    }
};
import { pool } from "../DB/db.js";

export const getInsumosCercanosCantidadMinima = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
          i.cod_insumo,
          i.nombre AS insumo,
          p.nombre AS presentacion,
          COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0) AS existencia_actual,
          i.cant_min,
          i.cant_max
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo
      LEFT JOIN (
          SELECT cod_insumo, cod_presentacion, SUM(cantidad_ingresada) AS total_ingresado
          FROM ingreso
          GROUP BY cod_insumo, cod_presentacion
      ) ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN (
          SELECT cod_insumo, cod_presentacion, SUM(cantidad) AS total_egresado
          FROM egreso
          GROUP BY cod_insumo, cod_presentacion
      ) egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
      WHERE (COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0)) <= i.cant_min + 10
      ORDER BY existencia_actual ASC;
      `
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los insumos cercanos a su cantidad mínima:', error);
    res.status(500).json({ message: 'Error al obtener insumos', error: error.message });
  }
};

export const getLotesProximosAVencer = async (req, res) => {
    const dias = req.query.dias || 30; // Por defecto próximos 30 días

    try {
        const [rows] = await pool.query(
            `
            SELECT 
                i.cod_insumo,
                ins.nombre AS nombre_insumo,
                p.nombre AS presentacion,
                i.cod_lote,
                i.fecha_vencimiento
            FROM ingreso i
            JOIN insumo ins ON ins.cod_insumo = i.cod_insumo
            JOIN presentacion p ON p.cod_presentacion = i.cod_presentacion
            WHERE i.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            ORDER BY i.fecha_vencimiento ASC;
            `,
            [dias]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No hay lotes próximos a vencer' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener lotes próximos a vencer:', error);
        return res.status(500).json({ 
            message: 'Error al obtener lotes próximos a vencer', 
            error: error.message 
        });
    }
};

export const getInsumosAgotados = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
          i.cod_insumo,
          i.nombre AS nombre_insumo,
          p.nombre AS presentacion,
          COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0) AS existencia_actual
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo
      LEFT JOIN (
          SELECT cod_insumo, cod_presentacion, SUM(cantidad_ingresada) AS total_ingresado
          FROM ingreso
          GROUP BY cod_insumo, cod_presentacion
      ) ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN (
          SELECT cod_insumo, cod_presentacion, SUM(cantidad) AS total_egresado
          FROM egreso
          GROUP BY cod_insumo, cod_presentacion
      ) egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
      WHERE (COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0)) = 0
      ORDER BY i.cod_insumo, p.nombre;
      `
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No hay insumos agotados' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener insumos agotados:', error);
    res.status(500).json({ message: 'Error al obtener insumos agotados', error: error.message });
  }
};

export const getCantidadInsumosAgotados = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad_agotados
      FROM (
        SELECT i.cod_insumo, p.cod_presentacion
        FROM insumo i
        JOIN presentacion p ON i.cod_insumo = p.cod_insumo
        LEFT JOIN (
            SELECT cod_insumo, cod_presentacion, SUM(cantidad_ingresada) AS total_ingresado
            FROM ingreso
            GROUP BY cod_insumo, cod_presentacion
        ) ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
        LEFT JOIN (
            SELECT cod_insumo, cod_presentacion, SUM(cantidad) AS total_egresado
            FROM egreso
            GROUP BY cod_insumo, cod_presentacion
        ) egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
        WHERE (COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0)) = 0
      ) AS subquery;
      `
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener cantidad de insumos agotados:', error);
    res.status(500).json({ message: 'Error al obtener cantidad de insumos agotados', error: error.message });
  }
};

export const getCantidadReqTemporales = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(DISTINCT i.no_requisicion) AS cant_req_temporales
            FROM ingreso i
            WHERE i.no_requisicion LIKE 'TMP-%';
        `);

        res.json(rows[0]); // devolvemos directamente el objeto con el total
    } catch (error) {
        console.error("Error al contar requisiciones temporales:", error);
        return res.status(500).json({ 
            message: "Error al contar requisiciones temporales", 
            error: error.message 
        });
    }
};

export const getCantidadLotesVencidos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) AS cantidad_lotes_vencidos
      FROM ingreso
      WHERE fecha_vencimiento < CURDATE();
      `
    );

    res.json(rows[0]); // devuelve { cantidad_lotes_vencidos: X }
  } catch (error) {
    console.error('Error al contar lotes vencidos:', error);
    return res.status(500).json({ 
      message: 'Error al contar lotes vencidos', 
      error: error.message 
    });
  }
};

export const getLotesVencidos = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `
            SELECT 
                i.cod_insumo,
                ins.nombre AS nombre_insumo,
                p.nombre AS presentacion,
                i.cod_lote,
                i.fecha_vencimiento
            FROM ingreso i
            JOIN insumo ins ON ins.cod_insumo = i.cod_insumo
            JOIN presentacion p ON p.cod_presentacion = i.cod_presentacion
            WHERE i.fecha_vencimiento < CURDATE()
            ORDER BY i.fecha_vencimiento ASC;
            `
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No hay lotes vencidos' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener lotes vencidos:', error);
        return res.status(500).json({ 
            message: 'Error al obtener lotes vencidos', 
            error: error.message 
        });
    }
};

export const getTransaccionesHoy = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT COUNT(*) AS total_transacciones_hoy
      FROM transaccion
      WHERE fecha >= CURDATE()
        AND fecha < CURDATE() + INTERVAL 1 DAY;
      `
    );

    res.json({ total_transacciones_hoy: rows[0].total_transacciones_hoy });
  } catch (error) {
    console.error("Error al obtener transacciones de hoy:", error);
    res.status(500).json({
      message: "Error al obtener transacciones de hoy",
      error: error.message,
    });
  }
};
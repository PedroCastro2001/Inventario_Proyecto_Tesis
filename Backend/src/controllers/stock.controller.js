import { pool } from "../DB/db.js";

export const getResumenStock = async (req, res) => {
  const { hastaFecha } = req.body;

  try {
    const [rows] = await pool.query(
      `SELECT 
        i.cod_insumo,
        i.nombre AS insumo,
        p.nombre AS presentacion,
        IFNULL(SUM(CASE WHEN t_ing.fecha <= ? THEN ing.cantidad_ingresada ELSE 0 END), 0) AS total_ingresado,
        IFNULL(SUM(CASE WHEN t_egr.fecha <= ? THEN egr.cantidad ELSE 0 END), 0) AS total_egresado,
        (
          IFNULL(SUM(CASE WHEN t_ing.fecha <= ? THEN ing.cantidad_ingresada ELSE 0 END), 0) - 
          IFNULL(SUM(CASE WHEN t_egr.fecha <= ? THEN egr.cantidad ELSE 0 END), 0)
        ) AS existencia_actual,
        i.cant_max,
        GREATEST(i.cant_max - (
          IFNULL(SUM(CASE WHEN t_ing.fecha <= ? THEN ing.cantidad_ingresada ELSE 0 END), 0) - 
          IFNULL(SUM(CASE WHEN t_egr.fecha <= ? THEN egr.cantidad ELSE 0 END), 0)
        ), 0) AS cantidad_a_solicitar
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo
      LEFT JOIN ingreso ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN egreso egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
      LEFT JOIN transaccion t_ing ON t_ing.cod_transaccion = ing.cod_transaccion
      LEFT JOIN transaccion t_egr ON t_egr.cod_transaccion = egr.cod_transaccion
      GROUP BY i.cod_insumo, p.cod_presentacion
      ORDER BY i.cod_insumo`,
      [
        hastaFecha, // para ingresos
        hastaFecha, // para egresos
        hastaFecha, // para existencia actual - ingresos
        hastaFecha, // para existencia actual - egresos
        hastaFecha, // para cantidad a solicitar - ingresos
        hastaFecha  // para cantidad a solicitar - egresos
      ]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener el resumen de stock:', error);
    res.status(500).json({ message: 'Error en stock', error: error.message });
  }
};

export const getExistenciasYConsumos = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ error: 'La fecha es requerida en el parámetro ?fecha=YYYY-MM-DD' });
    }

    const [result] = await pool.query(
      `
      SELECT 
    i.cod_insumo,
    i.nombre AS nombre_insumo,
    p.nombre AS presentacion,

    IFNULL(SUM(ing.cantidad_ingresada), 0) AS total_ingresado,
    IFNULL(SUM(egr.cantidad), 0) AS total_egresado,
    IFNULL(SUM(ing.cantidad_ingresada), 0) - IFNULL(SUM(egr.cantidad), 0) AS existencia,
    IFNULL(SUM(egr.cantidad), 0) AS consumo

    FROM insumo i
    JOIN presentacion p ON i.cod_insumo = p.cod_insumo

    LEFT JOIN ingreso ing ON ing.cod_insumo = i.cod_insumo 
        AND ing.cod_presentacion = p.cod_presentacion
    LEFT JOIN transaccion tin ON tin.cod_transaccion = ing.cod_transaccion
        AND tin.fecha <= ?

    LEFT JOIN egreso egr ON egr.cod_insumo = i.cod_insumo 
        AND egr.cod_presentacion = p.cod_presentacion
    LEFT JOIN transaccion teg ON teg.cod_transaccion = egr.cod_transaccion
        AND teg.fecha <= ?

    GROUP BY i.cod_insumo, p.cod_presentacion;
      `,
      [fecha, fecha]
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener existencias y consumos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
import { pool } from "../DB/db.js";

export const getKardexStockPrincipal = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.cod_insumo,
        i.nombre AS insumo,
        p.nombre AS presentacion,
        IFNULL(SUM(ing.cantidad_ingresada), 0) AS total_ingresado,
        IFNULL(SUM(egr.cantidad), 0) AS total_egresado,
        (IFNULL(SUM(ing.cantidad_ingresada), 0) - IFNULL(SUM(egr.cantidad), 0)) AS stock_actual,
        i.cant_max,
        (i.cant_max - (IFNULL(SUM(ing.cantidad_ingresada), 0) - IFNULL(SUM(egr.cantidad), 0))) AS cantidad_a_solicitar
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo
      LEFT JOIN ingreso ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN egreso egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
      GROUP BY i.cod_insumo, p.cod_presentacion
      ORDER BY i.cod_insumo
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener el reporte de Kardex:', error);
    res.status(500).json({ message: 'Error al obtener el reporte de Kardex', error: error.message });
  }
};
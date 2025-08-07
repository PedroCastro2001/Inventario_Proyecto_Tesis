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
        GREATEST(
          CEIL( 
              GREATEST(i.cant_max - (
                IFNULL(SUM(CASE WHEN t_ing.fecha <= ? THEN ing.cantidad_ingresada ELSE 0 END), 0) -
                IFNULL(SUM(CASE WHEN t_egr.fecha <= ? THEN egr.cantidad ELSE 0 END), 0)
              ), 0) 
              / p.forma_despacho
          ) * p.forma_despacho,
          0
      ) AS cantidad_a_solicitar
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
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Debes enviar fecha_inicio y fecha_fin en los parámetros ?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD' });
    }

    const [result] = await pool.query(
      `
      SELECT 
        i.cod_insumo,
        i.nombre AS nombre_insumo,
        p.nombre AS presentacion,

        IFNULL(SUM(CASE WHEN tin.fecha BETWEEN ? AND ? THEN ing.cantidad_ingresada ELSE 0 END), 0) AS total_ingresado,
        IFNULL(SUM(CASE WHEN teg.fecha BETWEEN ? AND ? THEN egr.cantidad ELSE 0 END), 0) AS total_egresado,

        -- Existencia en ese rango de fechas = ingresos - egresos en ese rango
        IFNULL(SUM(CASE WHEN tin.fecha BETWEEN ? AND ? THEN ing.cantidad_ingresada ELSE 0 END), 0)
        -
        IFNULL(SUM(CASE WHEN teg.fecha BETWEEN ? AND ? THEN egr.cantidad ELSE 0 END), 0)
        AS existencia,

        -- Consumo = total egresado en ese rango
        IFNULL(SUM(CASE WHEN teg.fecha BETWEEN ? AND ? THEN egr.cantidad ELSE 0 END), 0) AS consumo

      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo

      LEFT JOIN ingreso ing ON ing.cod_insumo = i.cod_insumo 
          AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN transaccion tin ON tin.cod_transaccion = ing.cod_transaccion

      LEFT JOIN egreso egr ON egr.cod_insumo = i.cod_insumo 
          AND egr.cod_presentacion = p.cod_presentacion
      LEFT JOIN transaccion teg ON teg.cod_transaccion = egr.cod_transaccion

      GROUP BY i.cod_insumo, p.cod_presentacion;
      `,
      [
        fecha_inicio, fecha_fin,  // total_ingresado
        fecha_inicio, fecha_fin,  // total_egresado
        fecha_inicio, fecha_fin,  // existencia (ingresos)
        fecha_inicio, fecha_fin,  // existencia (egresos)
        fecha_inicio, fecha_fin   // consumo
      ]
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener existencias y consumos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
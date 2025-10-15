import { pool } from "../DB/db.js";

export const getResumenStock = async (req, res) => {
  const { hastaFecha } = req.body;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
          i.cod_insumo,
          i.nombre AS insumo,
          p.nombre AS presentacion,
          COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0) AS existencia_actual,
          i.cant_max,
          GREATEST(
              CEIL(
                  GREATEST(
                      i.cant_max - (COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0)), 
                      0
                  ) / p.forma_despacho
              ) * p.forma_despacho,
              0
          ) AS cantidad_a_solicitar
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo
      LEFT JOIN (
          SELECT ing.cod_insumo, ing.cod_presentacion, SUM(ing.cantidad_ingresada) AS total_ingresado
          FROM ingreso ing
          JOIN transaccion t_ing ON t_ing.cod_transaccion = ing.cod_transaccion
          WHERE t_ing.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          GROUP BY ing.cod_insumo, ing.cod_presentacion
      ) ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion
      LEFT JOIN (
          SELECT egr.cod_insumo, egr.cod_presentacion, SUM(egr.cantidad) AS total_egresado
          FROM egreso egr
          JOIN transaccion t_egr ON t_egr.cod_transaccion = egr.cod_transaccion
          WHERE t_egr.fecha < DATE_ADD(?, INTERVAL 1 DAY)
          GROUP BY egr.cod_insumo, egr.cod_presentacion
      ) egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion
      ORDER BY i.cod_insumo, p.cod_presentacion;
      `,
      [hastaFecha, hastaFecha] // parámetros para ingresos y egresos
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
      return res.status(400).json({ 
        error: 'Debes enviar fecha_inicio y fecha_fin en los parámetros ?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD' 
      });
    }

    const [result] = await pool.query(
      `
      SELECT 
        i.cod_insumo,
        i.nombre AS nombre_insumo,
        p.nombre AS presentacion,
        COALESCE(ing.total_ingresado, 0) AS total_ingresado,
        COALESCE(egr.total_egresado, 0) AS total_egresado,
        (COALESCE(ing.total_ingresado, 0) - COALESCE(egr.total_egresado, 0)) AS existencia,
        COALESCE(egr.total_egresado, 0) AS consumo
      FROM insumo i
      JOIN presentacion p ON i.cod_insumo = p.cod_insumo

      LEFT JOIN (
        SELECT 
          ing.cod_insumo, 
          ing.cod_presentacion, 
          SUM(ing.cantidad_ingresada) AS total_ingresado
        FROM ingreso ing
        JOIN transaccion t ON ing.cod_transaccion = t.cod_transaccion
        WHERE t.fecha >= ? AND t.fecha < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY ing.cod_insumo, ing.cod_presentacion
      ) ing ON ing.cod_insumo = i.cod_insumo AND ing.cod_presentacion = p.cod_presentacion

      LEFT JOIN (
        SELECT 
          egr.cod_insumo, 
          egr.cod_presentacion, 
          SUM(egr.cantidad) AS total_egresado
        FROM egreso egr
        JOIN transaccion t ON egr.cod_transaccion = t.cod_transaccion
        WHERE t.fecha >= ? AND t.fecha < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY egr.cod_insumo, egr.cod_presentacion
      ) egr ON egr.cod_insumo = i.cod_insumo AND egr.cod_presentacion = p.cod_presentacion

      ORDER BY i.cod_insumo, p.cod_presentacion;
      `,
      [fecha_inicio, fecha_fin, fecha_inicio, fecha_fin]
    );

    res.status(200).json(result);

  } catch (error) {
    console.error('Error al obtener existencias y consumos:', error);
    res.status(500).json({ error: 'Error del servidor', detalle: error.message });
  }
};

export const getBalanceStock = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        error: "Debes enviar fecha_inicio y fecha_fin en los parámetros ?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD"
      });
    }

    const [rows] = await pool.query(`
      SELECT 
        m.cod_insumo,
        i.nombre AS insumo,
        m.cod_presentacion,
        p.nombre AS presentacion,
        m.no_requisicion,
        m.fecha_transaccion,
        m.cantidad,
        m.fecha_vencimiento,
        m.lote,
        m.tipo,
        SUM(
          CASE 
            WHEN m.tipo = 'Ingreso' THEN m.cantidad
            WHEN m.tipo = 'Egreso' THEN -m.cantidad
            ELSE m.cantidad  -- aquí entrará el 'Saldo Inicial' sin cambio de signo
          END
        ) OVER (
          PARTITION BY m.cod_insumo, m.cod_presentacion
          ORDER BY m.fecha_transaccion
          ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS saldo
      FROM (
        /* ------------------ SALDO INICIAL (ingresos - egresos) previos a fecha_inicio ------------------ */
        SELECT
          s.cod_insumo,
          s.cod_presentacion,
          NULL AS no_requisicion,
          SUM(s.cantidad) AS cantidad,
          NULL AS fecha_vencimiento,
          NULL AS lote,
          'Saldo Inicial' AS tipo,
          CAST(CONCAT(?, ' 00:00:00') AS DATETIME) AS fecha_transaccion
        FROM (
          /* ingresos previos (positivos) */
          SELECT ing.cod_insumo, ing.cod_presentacion, SUM(ing.cantidad_ingresada) AS cantidad
          FROM ingreso ing
          JOIN transaccion t ON ing.cod_transaccion = t.cod_transaccion
          WHERE t.fecha < ?
          GROUP BY ing.cod_insumo, ing.cod_presentacion

          UNION ALL

          /* egresos previos (negativos) */
          SELECT egr.cod_insumo, egr.cod_presentacion, -SUM(egr.cantidad) AS cantidad
          FROM egreso egr
          JOIN transaccion t ON egr.cod_transaccion = t.cod_transaccion
          WHERE t.fecha < ?
          GROUP BY egr.cod_insumo, egr.cod_presentacion
        ) s
        GROUP BY s.cod_insumo, s.cod_presentacion

        UNION ALL

        /* ------------------ INGRESOS DENTRO DEL RANGO [fecha_inicio, fecha_fin] ------------------ */
        SELECT 
          ing.cod_insumo,
          ing.cod_presentacion,
          ing.no_requisicion,
          ing.cantidad_ingresada AS cantidad,
          ing.fecha_vencimiento AS fecha_vencimiento,
          ing.cod_lote AS lote,
          'Ingreso' AS tipo,
          t.fecha AS fecha_transaccion
        FROM ingreso ing
        JOIN transaccion t ON ing.cod_transaccion = t.cod_transaccion
        WHERE t.fecha >= ? AND t.fecha < DATE_ADD(?, INTERVAL 1 DAY)

        UNION ALL

        /* ------------------ EGRESOS DENTRO DEL RANGO [fecha_inicio, fecha_fin] ------------------ */
        SELECT 
          egr.cod_insumo,
          egr.cod_presentacion,
          NULL AS no_requisicion,
          egr.cantidad AS cantidad,
          ing.fecha_vencimiento AS fecha_vencimiento, /* si existe el ingreso correspondiente */
          egr.cod_lote AS lote,
          'Egreso' AS tipo,
          t.fecha AS fecha_transaccion
        FROM egreso egr
        JOIN transaccion t ON egr.cod_transaccion = t.cod_transaccion
        LEFT JOIN ingreso ing 
          ON egr.cod_insumo = ing.cod_insumo 
          AND egr.cod_presentacion = ing.cod_presentacion
          AND egr.cod_lote = ing.cod_lote
        WHERE t.fecha >= ? AND t.fecha < DATE_ADD(?, INTERVAL 1 DAY)
      ) m
      JOIN insumo i ON m.cod_insumo = i.cod_insumo
      JOIN presentacion p ON m.cod_presentacion = p.cod_presentacion
      ORDER BY m.cod_insumo, m.cod_presentacion, m.fecha_transaccion;
    `, [
      // placeholders en el mismo orden que aparecen en la query:
      fecha_inicio, // fecha para mostrar en "fecha_transaccion" del SALDO INICIAL (fecha_inicio 00:00:00)
      fecha_inicio, // ingresos previos: t.fecha < ?
      fecha_inicio, // egresos previos: t.fecha < ?
      fecha_inicio, fecha_fin, // ingresos en rango: t.fecha >= ? and t.fecha < DATE_ADD(?, INTERVAL 1 DAY)
      fecha_inicio, fecha_fin  // egresos en rango: t.fecha >= ? and t.fecha < DATE_ADD(?, INTERVAL 1 DAY)
    ]);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener el balance de insumos:", error);
    res.status(500).json({ message: "Error al obtener el balance", error: error.message });
  }
};
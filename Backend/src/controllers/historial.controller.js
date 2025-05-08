import { pool } from "../DB/db.js";

export const getHistorialMovimientos = async (req, res) => {
    console.log("Historial de movimientos");
  
    try {
      const { fechaInicio, fechaFin, tipo } = req.query;
  
      // Consulta base
      let query = `
        SELECT 
          t.fecha,
          t.tipo_transaccion,
          i.cod_insumo,
          i.nombre AS insumo,
          p.nombre AS presentacion,
          mov.cod_lote,
          mov.cantidad,
          a.nombre AS area,
          mov.no_requisicion,
          mov.demanda_insatisfecha,
          mov.observaciones
        FROM transaccion t
        JOIN (
            SELECT 
                cod_transaccion,
                cod_insumo,
                cod_presentacion,
                cod_lote,
                cantidad_ingresada AS cantidad,
                NULL AS cod_area,
                no_requisicion,
                demanda_insatisfecha,
                observaciones
            FROM ingreso
            UNION ALL
            SELECT 
                cod_transaccion,
                cod_insumo,
                cod_presentacion,
                cod_lote,
                cantidad,
                cod_area,
                NULL AS no_requisicion,
                NULL AS demanda_insatisfecha,
                observaciones
            FROM egreso
        ) mov ON t.cod_transaccion = mov.cod_transaccion
        JOIN insumo i ON i.cod_insumo = mov.cod_insumo
        JOIN presentacion p ON p.cod_presentacion = mov.cod_presentacion
        LEFT JOIN area a ON a.cod_area = mov.cod_area
      `;
  
      const condiciones = [];
      const valores = [];
  
      // Condiciones dinámicas
      if (fechaInicio && fechaFin) {
        condiciones.push("t.fecha BETWEEN ? AND ?");
        valores.push(fechaInicio, fechaFin);
      }
  
      if (tipo && tipo !== "Todos") {
        condiciones.push("t.tipo_transaccion = ?");
        valores.push(tipo);
      }
  
      if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ");
      } else {
        query += " ORDER BY t.fecha DESC LIMIT 30";
      }
  
      if (condiciones.length > 0) {
        query += " ORDER BY t.fecha DESC";
      }
  
      const [rows] = await pool.query(query, valores);
      res.json(rows);
  
    } catch (error) {
      console.error('Error al obtener el historial de movimientos:', error);
      res.status(500).json({
        message: 'Error al obtener el historial de movimientos',
        error: error.message,
      });
    }
  };
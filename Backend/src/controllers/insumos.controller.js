import { getPool } from "../DB/db.js";
import fs from 'fs';
import csv from 'csv-parser';

export const getInsumos = async (req, res) => {
    try {
      const pool = getPool(req.user.contexto);
      const [rows] = await pool.query("SELECT * FROM insumo");
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
};

export const getInsumo = async (req, res) => {
    try {
      const pool = getPool(req.user.contexto);
      const { cod_insumo } = req.params;
      const [rows] = await pool.query("SELECT * FROM insumo WHERE cod_insumo = ?", [
        cod_insumo,
      ]);
  
      if (rows.length <= 0) {
        return res.status(404).json({ message: "Insumo no encontrado" });
      }
  
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };
  
  export const deleteInsumo = async (req, res) => {
    try {
      const pool = getPool(req.user.contexto);
      const { cod_insumo } = req.params;
      const [rows] = await pool.query("DELETE FROM insumo WHERE cod_insumo = ?", [cod_insumo]);
  
      if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "Insumo no encontrado" });
      }
  
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };
  
  export const createInsumo = async (req, res) => {

    const fecha_creacion = new Date(); 

    try {
      const pool = getPool(req.user.contexto);
      const { cod_insumo, nombre, cant_min, cant_max } = req.body;
      const [rows] = await pool.query(
        "INSERT INTO insumo (cod_insumo, nombre, "+
        "fecha_creacion, cant_min, cant_max) VALUES (?, ?, ?, ?, ?)",
        [cod_insumo, nombre, fecha_creacion, cant_min, cant_max]
      );
      res.status(201).json({ cod_insumo, nombre, fecha_creacion, cant_min, cant_max });
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" , error: error.message});
    }
  };
  
  export const updateInsumo = async (req, res) => {
    try {
      const pool = getPool(req.user.contexto);
      const { cod_insumo } = req.params;
      const { nombre, fecha_creacion, cant_min, cant_max } = req.body;
  
      const [result] = await pool.query(
        "UPDATE insumo SET nombre = IFNULL(?, nombre), "+
        "fecha_creacion = IFNULL(?, fecha_creacion), "+
        " cant_min = IFNULL(?, cant_min), "+
        " cant_max = IFNULL(?, cant_max) WHERE cod_insumo = ?"+
        [nombre,fecha_creacion, cant_min, cant_max, cod_insumo]
      );
  
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Insumo no encontrado" });
  
      const [rows] = await pool.query("SELECT * FROM insumo WHERE cod_insumo = ?", [
        cod_insumo,
      ]);
  
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Algo salió mal" });
    }
  };

export const cargaMasivaInsumos = async (req, res) => {
  try {
    const pool = getPool(req.user.contexto);
    if (!req.file) {
      return res.status(400).json({ message: "No se cargó ningún archivo" });
    }

    const insumosNuevos = [];
    const presentacionesNuevas = [];
    const errores = [];

    const filePath = req.file.path;

    // Leemos el CSV fila por fila
    const registros = [];

    // Detectar separador (coma o punto y coma)
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const firstLine = fileContent.split('\n')[0];
    const separator = firstLine.includes(';') ? ';' : ',';

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ 
          separator, 
          skipLines: 0,
          mapValues: ({ value }) => value.trim() 
        }))
        .on('data', (row) => registros.push(row))
        .on('end', () => {
          // Si la primera fila parece encabezado (no numérica), la quitamos
          if (registros.length > 0 && isNaN(registros[0].cod_insumo)) {
            registros.shift();
          }
          resolve();
        })
        .on('error', reject);
    });

    for (const row of registros) {
      const {
        cod_insumo,
        insumo,
        cod_presentacion,
        presentacion,
        cant_min,
        cant_max,
        forma_despacho
      } = row;

      // Validar campos obligatorios
      if (!cod_insumo || !insumo || !cod_presentacion || !presentacion) {
        errores.push({ row, error: "Faltan campos obligatorios" });
        continue;
      }

      // Verificar si el insumo ya existe
      const [insumoExistente] = await pool.query(
        "SELECT cod_insumo FROM insumo WHERE cod_insumo = ?",
        [cod_insumo]
      );

      // Si no existe, lo creamos
      if (insumoExistente.length === 0) {
        await pool.query(
          "INSERT INTO insumo (cod_insumo, nombre, fecha_creacion, cant_min, cant_max) VALUES (?, ?, CURDATE(), ?, ?)",
          [cod_insumo, insumo, cant_min || null, cant_max || null]
        );
        insumosNuevos.push(cod_insumo);
      }

      // Verificar si la presentación ya existe
      const [presentacionExistente] = await pool.query(
        "SELECT cod_presentacion FROM presentacion WHERE cod_presentacion = ?",
        [cod_presentacion]
      );

      // Si no existe, la insertamos
      if (presentacionExistente.length === 0) {
        await pool.query(
          "INSERT INTO presentacion (cod_presentacion, nombre, cod_insumo, fecha_creacion, forma_despacho) VALUES (?, ?, ?, CURDATE(), ?)",
          [cod_presentacion, presentacion, cod_insumo, forma_despacho || null]
        );
        presentacionesNuevas.push(cod_presentacion);
      }
    }

    // Eliminamos el archivo temporal
    fs.unlinkSync(filePath);

    res.json({
      message: "Carga masiva completada",
      insumos_creados: insumosNuevos.length,
      presentaciones_creadas: presentacionesNuevas.length,
      errores: errores.length,
      detalles_errores: errores
    });

  } catch (error) {
    console.error("Error en carga masiva:", error);
    res.status(500).json({ message: "Error procesando archivo CSV" });
  }
};


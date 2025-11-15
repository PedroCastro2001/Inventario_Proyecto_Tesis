import { createPool } from "mysql2/promise";
import {
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../config.js";

export const poolLaboratorio = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: "inventario_lab_bs",
});

const poolBancoSangre = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: "inventario_bs", // 👈 nombre BD banco de sangre
});

// Función que devuelve el pool correcto según el contexto
export function getPool(contexto) {
  switch (contexto) {
    case "Laboratorio":
      return poolLaboratorio;
    case "Banco de Sangre":
      return poolBancoSangre;
    default:
      throw new Error(`Contexto de base de datos inválido: ${contexto}`);
  }
}
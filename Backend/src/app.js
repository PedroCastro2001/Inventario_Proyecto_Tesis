import express from "express";
import morgan from "morgan";
import cors from 'cors';
import indexRoutes from "./routes/index.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import insumosRoutes from "./routes/insumos.routes.js";
import areaRoutes from "./routes/area.routes.js";
import presentacionesRoutes from "./routes/presentaciones.routes.js";
import ingresosRoutes from "./routes/ingresos.routes.js";
import egresosRoutes from "./routes/egresos.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import historialRoutes from "./routes/historial.routes.js";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js"
import session from "express-session";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors())
/*app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false,
}));*/

// Routes
app.use("/", indexRoutes);
app.use("/api", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", insumosRoutes);
app.use("/api", areaRoutes);
app.use("/api", presentacionesRoutes);
app.use("/api", ingresosRoutes);
app.use("/api", egresosRoutes);
app.use("/api", stockRoutes);
app.use("/api", historialRoutes);
app.use("/api", usuariosRoutes)

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Token no válido o expirado" });
  }
  if (err.name === "ForbiddenError") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next(err);
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
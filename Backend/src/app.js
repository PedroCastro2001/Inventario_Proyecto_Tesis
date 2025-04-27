import express from "express";
import morgan from "morgan";
import cors from 'cors';
import indexRoutes from "./routes/index.routes.js";
import insumosRoutes from "./routes/insumos.routes.js";
import areaRoutes from "./routes/area.routes.js";
import presentacionesRoutes from "./routes/presentaciones.routes.js";
import ingresosRoutes from "./routes/ingresos.routes.js";
import egresosRoutes from "./routes/egresos.routes.js";
import kardexRoutes from "./routes/kardex.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/", indexRoutes);
app.use("/api", insumosRoutes);
app.use("/api", areaRoutes);
app.use("/api", presentacionesRoutes);
app.use("/api", ingresosRoutes);
app.use("/api", egresosRoutes);
app.use("/api", kardexRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
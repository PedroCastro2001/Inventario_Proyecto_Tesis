import { Router } from "express";
import { index } from "../controllers/index.routes.js";

const router = Router();

router.get("/", index);

//router.get("/ping", ping);

export default router;
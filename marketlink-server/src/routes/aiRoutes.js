import { Router } from "express";
import { assistant } from "../controllers/aiController.js";

const router = Router();
router.post("/assistant", assistant);

export default router;

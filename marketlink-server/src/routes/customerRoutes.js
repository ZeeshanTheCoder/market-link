import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { customerDashboard } from "../controllers/orderController.js";
const router=Router();
router.get("/dashboard",protect,authorize("customer"),customerDashboard);
export default router;

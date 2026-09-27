import { Router } from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getDashboard, getFarmerProducts } from "../controllers/farmerController.js";
import { farmerOrders } from "../controllers/orderController.js";
const router=Router();
router.get("/dashboard",protect,authorize("farmer"),getDashboard);
router.get("/orders",protect,authorize("farmer"),farmerOrders);
router.get("/:id/products",getFarmerProducts);
export default router;

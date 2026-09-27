import { Router } from "express";
import {listNotifications,markRead,markAllRead,deleteNotification} from "../controllers/notificationController.js";
import {protect} from "../middleware/authMiddleware.js";
const router=Router();
router.get("/",protect,listNotifications);
router.patch("/read-all",protect,markAllRead);
router.patch("/:id/read",protect,markRead);
router.delete("/:id",protect,deleteNotification);
export default router;

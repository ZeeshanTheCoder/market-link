import { Router } from "express";
import {listAnnouncements,createAnnouncement,deleteAnnouncement} from "../controllers/announcementController.js";
import {protect,authorize} from "../middleware/authMiddleware.js";
const router=Router();
router.get("/",listAnnouncements);
router.post("/",protect,authorize("admin"),createAnnouncement);
router.delete("/:id",protect,authorize("admin"),deleteAnnouncement);
export default router;

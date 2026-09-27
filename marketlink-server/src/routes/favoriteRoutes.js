import { Router } from "express";
import {listFavorites,addFavorite,removeFavorite} from "../controllers/favoriteController.js";
import {protect,authorize} from "../middleware/authMiddleware.js";
const router=Router();
router.get("/",protect,authorize("customer"),listFavorites);
router.post("/",protect,authorize("customer"),addFavorite);
router.delete("/:id",protect,authorize("customer"),removeFavorite);
export default router;

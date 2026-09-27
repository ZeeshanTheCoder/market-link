import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";
import FarmerProfile from "../models/FarmerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listFavorites = asyncHandler(async(req,res)=>{const rows=await Favorite.find({userId:req.user._id}).populate("productId").populate("farmerId","name");res.json({favorites:rows});});
export const addFavorite = asyncHandler(async(req,res)=>{const {productId,farmerId}=req.body;if(!productId&&!farmerId)throw new AppError("productId or farmerId is required",422);if(productId&&!await Product.exists({_id:productId}))throw new AppError("Product not found",404);if(farmerId&&!await FarmerProfile.exists({userId:farmerId}))throw new AppError("Farmer not found",404);const favorite=await Favorite.create({userId:req.user._id,productId:productId||null,farmerId:farmerId||null});res.status(201).json({favorite});});
export const removeFavorite = asyncHandler(async(req,res)=>{const q={userId:req.user._id};if(req.params.id)q._id=req.params.id;const favorite=await Favorite.findOneAndDelete(q);if(!favorite)throw new AppError("Favorite not found",404);res.json({message:"Favorite removed"});});

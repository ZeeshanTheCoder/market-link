import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
export const updateProfile=asyncHandler(async(req,res)=>{const allowed=["name","phone","address"];const u=await User.findById(req.user._id);if(!u)throw new AppError("User not found",404);for(const k of allowed)if(req.body[k]!==undefined)u[k]=String(req.body[k]).trim();await u.save();res.json({user:u});});

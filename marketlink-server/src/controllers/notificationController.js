import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
export const listNotifications = asyncHandler(async(req,res)=>{const notifications=await Notification.find({userId:req.user._id}).sort({createdAt:-1}).limit(100);res.json({notifications,unread:notifications.filter(x=>!x.read).length});});
export const markRead = asyncHandler(async(req,res)=>{const n=await Notification.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{read:true},{new:true});if(!n)throw new AppError("Notification not found",404);res.json({notification:n});});
export const markAllRead = asyncHandler(async(req,res)=>{await Notification.updateMany({userId:req.user._id,read:false},{read:true});res.json({message:"All notifications marked as read"});});
export const deleteNotification = asyncHandler(async(req,res)=>{const n=await Notification.findOneAndDelete({_id:req.params.id,userId:req.user._id});if(!n)throw new AppError("Notification not found",404);res.json({message:"Notification removed"});});

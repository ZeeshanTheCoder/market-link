import Announcement from "../models/Announcement.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import { notify } from "../utils/notify.js";
export const listAnnouncements=asyncHandler(async(req,res)=>res.json({announcements:await Announcement.find({status:"Published"}).sort({createdAt:-1})}));
export const createAnnouncement=asyncHandler(async(req,res)=>{const a=await Announcement.create({title:req.body.title,audience:req.body.audience,message:req.body.message,createdBy:req.user._id,status:req.body.status||"Published"});const roles=a.audience==="Farmers"?["farmer"]:a.audience==="Customers"||a.audience==="All customers"?["customer"]:["customer","farmer","admin"];const users=await User.find({role:{$in:roles},status:"active"}).select("_id");await Promise.all(users.map(u=>notify(u._id,a.title,a.message,"market")));res.status(201).json({announcement:a});});
export const deleteAnnouncement=asyncHandler(async(req,res)=>{const a=await Announcement.findByIdAndDelete(req.params.id);if(!a)throw new AppError("Announcement not found",404);res.json({message:"Announcement deleted"});});

import PickupSlot from "../models/PickupSlot.js";
import FarmerProfile from "../models/FarmerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
export const listAvailableSlots=asyncHandler(async(req,res)=>{const q={active:true,$expr:{$lt:["$booked","$capacity"]}}; if(req.query.farmerId)q.farmerId=req.query.farmerId;if(req.query.marketId)q.marketId=req.query.marketId;if(req.query.date)q.date={ $gte:new Date(`${req.query.date}T00:00:00`), $lt:new Date(`${req.query.date}T23:59:59`) };const slots=await PickupSlot.find(q).populate("marketId","name address day time").sort({date:1,start:1});res.json({slots});});
export const farmerSlots=asyncHandler(async(req,res)=>{const slots=await PickupSlot.find({farmerId:req.user._id}).populate("marketId","name").sort({date:1,start:1});res.json({slots});});
export const createSlot=asyncHandler(async(req,res)=>{const profile=await FarmerProfile.findOne({userId:req.user._id});if(!profile||profile.approvalStatus!=="approved")throw new AppError("Approved farmer access required.",403);const slot=await PickupSlot.create({...req.body,farmerId:req.user._id,date:new Date(req.body.date)});res.status(201).json({slot});});
export const updateSlot=asyncHandler(async(req,res)=>{const slot=await PickupSlot.findOne({_id:req.params.id,farmerId:req.user._id});if(!slot)throw new AppError("Pickup slot not found",404);Object.assign(slot,req.body);if(req.body.date)slot.date=new Date(req.body.date);await slot.save();res.json({slot});});
export const deleteSlot=asyncHandler(async(req,res)=>{const slot=await PickupSlot.findOneAndDelete({_id:req.params.id,farmerId:req.user._id});if(!slot)throw new AppError("Pickup slot not found",404);res.json({message:"Pickup slot removed"});});

import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Market from "../models/Market.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import Announcement from "../models/Announcement.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { notify } from "../utils/notify.js";
import Report from "../models/Report.js";


export const dashboard=asyncHandler(async(req,res)=>{
  const [farmers,customers,markets,orders,products,reviews,revenue] = await Promise.all([
    FarmerProfile.countDocuments({approvalStatus:"approved"}), User.countDocuments({role:"customer",status:"active"}), Market.countDocuments({status:"active"}), Order.countDocuments(), Product.countDocuments(), Review.countDocuments(), Order.aggregate([{ $match:{status:{$nin:["CANCELLED","DECLINED"]}} },{$group:{_id:null,total:{$sum:"$totalAmount"}}}])
  ]);
  const pendingFarmers=await FarmerProfile.countDocuments({approvalStatus:"pending"});
  res.json({stats:{farmers,customers,markets,orders,products,reviews,revenue:revenue[0]?.total||0,pendingFarmers}});
});

export const listFarmers=asyncHandler(async(req,res)=>{const profiles=await FarmerProfile.find().populate("userId","name email phone status createdAt").populate("markets","name address").sort({createdAt:-1});res.json({farmers:profiles});});
export const approveFarmer=asyncHandler(async(req,res)=>{const p=await FarmerProfile.findOneAndUpdate({userId:req.params.id},{approvalStatus:"approved"},{new:true});if(!p)throw new AppError("Farmer profile not found",404);await notify(req.params.id,"Farmer account approved","Your MarketLink farmer account is approved. You can now publish products.","system","/farmer/products");res.json({profile:p});});
export const suspendFarmer=asyncHandler(async(req,res)=>{const p=await FarmerProfile.findOneAndUpdate({userId:req.params.id},{approvalStatus:"suspended"},{new:true});if(!p)throw new AppError("Farmer profile not found",404);await notify(req.params.id,"Farmer account suspended","Your seller account has been suspended. Please contact MarketLink support.","system");res.json({profile:p});});
export const listCustomers=asyncHandler(async(req,res)=>{const customers=await User.find({role:"customer"}).sort({createdAt:-1});res.json({customers});});
export const setCustomerStatus=asyncHandler(async(req,res)=>{const status=req.body.status==="inactive"?"inactive":"active";const customer=await User.findOneAndUpdate({_id:req.params.id,role:"customer"},{status},{new:true});if(!customer)throw new AppError("Customer not found",404);res.json({customer});});
export const reports=asyncHandler(async(req,res)=>{
  const [salesByMonth,topProducts,statuses,reportRecords] = await Promise.all([
    Order.aggregate([{ $match:{status:{$nin:["CANCELLED","DECLINED"]}} },{ $group:{_id:{$dateToString:{format:"%Y-%m",date:"$createdAt"}},sales:{$sum:"$totalAmount"},orders:{$sum:1}} },{$sort:{_id:1}},{$limit:12}]),
    Order.aggregate([{ $match:{status:{$nin:["CANCELLED","DECLINED"]}} },{$unwind:"$items"},{$group:{_id:"$items.productId",sold:{$sum:"$items.qty"},revenue:{$sum:"$items.subtotal"}}},{$sort:{sold:-1}},{$limit:10}]),
    Order.aggregate([{$group:{_id:"$status",count:{$sum:1}}},{$sort:{count:-1}}]),
    Report.find().populate("createdBy","name email").sort({createdAt:-1}).limit(50)
  ]);
  res.json({salesByMonth,topProducts,statuses,reports:reportRecords});
});

export const createReport=asyncHandler(async(req,res)=>{
  const title=String(req.body.title||"").trim();
  const summary=String(req.body.summary||"").trim();
  if(title.length<3 || summary.length<3) throw new AppError("Report title and summary are required.",422);
  const report=await Report.create({title,summary,audience:req.body.audience||"All users",createdBy:req.user._id});
  const roles=report.audience==="Customers"?["customer"]:report.audience==="Farmers"?["farmer"]:report.audience==="Admins"?["admin"]:["customer","farmer","admin"];
  const users=await User.find({role:{$in:roles},status:"active"}).select("_id");
  await Promise.all(users.map(u=>notify(u._id,`New admin report: ${report.title}`,report.summary,"system","/admin/reports")));
  res.status(201).json({report});
});

export const downloadReport=asyncHandler(async(req,res)=>{
  const report=await Report.findById(req.params.id).populate("createdBy","name");
  if(!report) throw new AppError("Report not found",404);
  const esc=(v)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(report.title)}</title></head><body style="font-family:Arial,sans-serif;padding:36px"><h1>MarketLink Admin Report</h1><h2>${esc(report.title)}</h2><p><b>Audience:</b> ${esc(report.audience)}</p><p><b>Published:</b> ${esc(new Date(report.publishedAt).toLocaleString())}</p><p><b>Prepared by:</b> ${esc(report.createdBy?.name||"MarketLink Admin")}</p><hr/><p>${esc(report.summary).replace(/\\n/g,"<br/>")}</p></body></html>`;
  res.setHeader("Content-Type","application/msword; charset=utf-8");
  res.setHeader("Content-Disposition",`attachment; filename="${String(report.title).replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase()||"marketlink-report"}.doc"`);
  res.send(html);
});

export const listUsers=asyncHandler(async(req,res)=>{const users=await User.find().sort({createdAt:-1}).limit(500);res.json({users});});

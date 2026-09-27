import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { slugify } from "../utils/slugify.js";
export const listCategories=asyncHandler(async(req,res)=>res.json({categories:await Category.find({active:true}).sort({name:1})}));
export const createCategory=asyncHandler(async(req,res)=>{const name=String(req.body.name||"").trim();if(name.length<2)throw new AppError("Category name is required",422);const category=await Category.create({name,slug:slugify(name)});res.status(201).json({category});});
export const updateCategory=asyncHandler(async(req,res)=>{const c=await Category.findById(req.params.id);if(!c)throw new AppError("Category not found",404);if(req.body.name){c.name=String(req.body.name).trim();c.slug=slugify(c.name)}if(req.body.active!==undefined)c.active=Boolean(req.body.active);await c.save();res.json({category:c});});
export const deleteCategory=asyncHandler(async(req,res)=>{const c=await Category.findByIdAndDelete(req.params.id);if(!c)throw new AppError("Category not found",404);res.json({message:"Category deleted"});});

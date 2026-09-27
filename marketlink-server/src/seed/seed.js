import "../config/env.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import Market from "../models/Market.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import PickupSlot from "../models/PickupSlot.js";
import catalog from "./catalog.json" with { type: "json" };
import { slugify } from "../utils/slugify.js";

const farmerDefs = [
  { key:"Meadow Roots Farm", email:"meadow@example.com", specialty:"Seasonal vegetables & herbs", market:"greenfield", image:"/images/farmer-stall.svg", bio:"Family-run growers focused on dependable weekly vegetables, herbs and kitchen staples." },
  { key:"Sunny Orchard Co.", email:"sunny@example.com", specialty:"Apples, citrus & preserves", market:"riverside", image:"/images/apples.svg", bio:"Orchard-grown fruit and seasonal preserves prepared for local market pickup." },
  { key:"The Honey Shed", email:"honey@example.com", specialty:"Raw honey & beeswax goods", market:"oak-orchard", image:"/images/honey.svg", bio:"Small-batch honey products sourced from local hives and packed for market day." },
  { key:"Willow Creek Growers", email:"willow@example.com", specialty:"Leafy greens & salad boxes", market:"harvest-lane", image:"/images/greens.svg", bio:"Fresh greens and practical salad boxes harvested close to market day." },
  { key:"Green Valley Farm", email:"greenvalley@example.com", specialty:"Vegetables, herbs & farm supplies", market:"harvest-lane", image:"/images/farmer-stall.svg", bio:"Local mixed farm supplying fresh vegetables and practical production goods." },
  { key:"Happy Cow Dairy", email:"happycow@example.com", specialty:"Fresh dairy", market:"riverside", image:"/images/farmer-stall.svg", bio:"Farm dairy prepared fresh for local customers." },
  { key:"Happy Hen Farm", email:"happyhen@example.com", specialty:"Free-range eggs", market:"oak-orchard", image:"/images/farmer-stall.svg", bio:"Family farm raising hens and collecting fresh eggs for market pickup." },
  { key:"Golden Grain Co.", email:"golden@example.com", specialty:"Grains, pulses & farm supplies", market:"harvest-lane", image:"/images/farmer-stall.svg", bio:"Local grain growers and farm-supply partners for pantry and production needs." },
];
const marketDefs = [
  { slug:"greenfield",name:"Greenfield Saturday Market",area:"Downtown",day:"Saturday",time:"8:00 AM – 1:00 PM",stalls:28,address:"12 Market Square, Downtown",latitude:24.8615,longitude:67.0099,description:"A lively Saturday market with fresh vegetables, fruit, eggs, honey and pantry staples." },
  { slug:"riverside",name:"Riverside Farmers Market",area:"Riverside",day:"Sunday",time:"9:00 AM – 2:00 PM",stalls:19,address:"48 Riverside Walk, Riverside",latitude:24.8652,longitude:67.0216,description:"A relaxed Sunday market with orchard produce, dairy and seasonal baskets." },
  { slug:"harvest-lane",name:"Harvest Lane Market",area:"North District",day:"Wednesday",time:"4:00 PM – 8:00 PM",stalls:14,address:"7 Harvest Lane, North District",latitude:24.9021,longitude:67.0514,description:"Convenient midweek pickup for leafy greens, vegetables and farm supplies." },
  { slug:"oak-orchard",name:"Oak & Orchard Market",area:"East Village",day:"Saturday",time:"9:00 AM – 1:00 PM",stalls:22,address:"21 Orchard Road, East Village",latitude:24.8798,longitude:67.0535,description:"Seasonal produce, honey and artisan farm products in a compact market setting." },
];
const categories=["Vegetables","Fruits","Greens","Dairy","Honey","Grains","Spices"];

async function upsertMarket(d){ return Market.findOneAndUpdate({slug:d.slug},{...d,operatingDays:[d.day],timings:d.time,status:"active",mapProvider:"OpenStreetMap"},{new:true,upsert:true,setDefaultsOnInsert:true}); }
async function upsertUser(def){ const existing=await User.findOne({email:def.email}); if(existing){ existing.name=def.name||def.key; existing.status="active"; existing.role="farmer"; await existing.save(); return existing; } return User.create({name:def.name||def.key,email:def.email,password:def.password,phone:def.phone||"+92 300 000 0000",address:def.address||"",role:"farmer",status:"active"}); }

const run=async()=>{
  const mongoUri = String(process.env.MONGO_URI || "mongodb://localhost:27017/marketlink").trim();
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000, family: 4 });
  const markets={}; for(const m of marketDefs) markets[m.slug]=await upsertMarket(m);
  const farmers={};
  for(const f of farmerDefs){
    const u=await upsertUser({email:f.email,key:f.key,password:process.env.DEMO_PASSWORD||"MarketLink123",name:f.key});
    const market=markets[f.market];
    farmers[f.key]=u;
    await FarmerProfile.findOneAndUpdate({userId:u._id},{userId:u._id,stallName:f.key,contactPerson:f.key,markets:[market._id],operatingDays:[market.day],pickupWindows:[{day:market.day,startTime:market.time.split("–")[0]?.trim()||"08:00",endTime:market.time.split("–")[1]?.trim()||"13:00"}],address:market.address,latitude:market.latitude,longitude:market.longitude,approvalStatus:"approved",slug:slugify(f.key),specialty:f.specialty,bio:f.bio,image:f.image},{new:true,upsert:true,setDefaultsOnInsert:true});
  }
  for(const c of categories) await Category.findOneAndUpdate({slug:slugify(c)},{name:c,slug:slugify(c),active:true},{upsert:true,new:true,setDefaultsOnInsert:true});
  const seeded= new Set();
  for(const p of catalog){
    const farmer=farmers[p.farmer]; const marketKey=farmerDefs.find(x=>x.key===p.farmer)?.market || "harvest-lane"; const market=markets[marketKey];
    const doc={farmerId:farmer._id,marketId:market._id,name:p.name,slug:p.slug,category:p.category,description:p.description,price:p.price,unit:p.unit,quantityAvailable:p.stock,image:p.image,isAvailable:p.stock>0,weeklyTemplate:false,useCase:p.useCase,productType:p.productType,harvestStatus:p.harvestStatus,deliveryType:"Market pickup",minOrder:p.minOrder,bulkPrice:p.bulkPrice,badge:p.badge,organic:p.organic,rating:p.rating,reviews:p.reviews,soldCount:Math.max(0,Math.round(p.reviews*1.6))};
    await Product.findOneAndUpdate({slug:p.slug},doc,{upsert:true,new:true,setDefaultsOnInsert:true}); seeded.add(p.slug);
  }
  const slotDefs=[
    {date:"2026-09-26",day:"Saturday",start:"08:30",end:"09:00",capacity:6,booked:3,active:true},
    {date:"2026-09-26",day:"Saturday",start:"09:00",end:"09:30",capacity:6,booked:2,active:true},
    {date:"2026-09-26",day:"Saturday",start:"10:00",end:"10:30",capacity:8,booked:5,active:true},
    {date:"2026-09-27",day:"Sunday",start:"11:00",end:"11:30",capacity:5,booked:1,active:false},
  ];
  const sampleFarmer=farmers["Meadow Roots Farm"]; const sampleMarket=markets.greenfield;
  for(const s of slotDefs) await PickupSlot.findOneAndUpdate({farmerId:sampleFarmer._id,date:new Date(s.date),start:s.start},{...s,farmerId:sampleFarmer._id,marketId:sampleMarket._id,date:new Date(s.date)},{upsert:true,new:true,setDefaultsOnInsert:true});
  console.log(`Seeded ${catalog.length} products, ${Object.keys(farmers).length} farmers, ${Object.keys(markets).length} markets, ${categories.length} categories.`);
  await mongoose.disconnect();
};
run().catch(async err=>{console.error(err);try{await mongoose.disconnect()}catch{}process.exit(1)});

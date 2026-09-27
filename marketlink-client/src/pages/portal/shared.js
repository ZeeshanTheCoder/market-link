import { useEffect, useState } from "react";

const CDN = "https://images.unsplash.com";
const photo = (id, width = 1800, quality = 88) => `${CDN}/${id}?auto=format&fit=crop&w=${width}&q=${quality}`;

export const marketSeed = [
  {id:"greenfield", name:"Greenfield Saturday Market", area:"Downtown Karachi", day:"Saturday", time:"8:00 AM – 1:00 PM", stalls:28, tag:"Open this week", address:"12 Market Square, Downtown Karachi", lat:24.8615, lng:67.0099, image:photo("photo-1488459716781-31db52582fe9"), description:"A lively Saturday market with fresh vegetables, fruit, eggs, honey and pantry staples."},
  {id:"riverside", name:"Riverside Farmers Market", area:"Riverside Karachi", day:"Sunday", time:"9:00 AM – 2:00 PM", stalls:19, tag:"Popular", address:"48 Riverside Walk, Karachi", lat:24.8652, lng:67.0216, image:photo("photo-1533900298318-6b8da08a523e"), description:"A relaxed Sunday market with orchard produce, dairy and seasonal baskets."},
  {id:"harvest-lane", name:"Harvest Lane Market", area:"North Karachi", day:"Wednesday", time:"4:00 PM – 8:00 PM", stalls:14, tag:"Midweek", address:"7 Harvest Lane, North Karachi", lat:24.9021, lng:67.0514, image:photo("photo-1512621776951-a57141f2eefd"), description:"Convenient midweek pickup for leafy greens, vegetables and farm supplies."},
  {id:"oak-orchard", name:"Oak & Orchard Market", area:"East Karachi", day:"Saturday", time:"9:00 AM – 1:00 PM", stalls:22, tag:"Seasonal", address:"21 Orchard Road, East Karachi", lat:24.8798, lng:67.0535, image:photo("photo-1464965911861-746a04b4bca6"), description:"Seasonal produce, honey and artisan farm products in a compact market setting."},
];

export const farmerSeed = [
  {id:"meadow-roots", name:"Meadow Roots Farm", specialty:"Seasonal vegetables & herbs", market:"Greenfield Saturday Market", rating:4.9, products:24, image:photo("photo-1501004318641-b39e6451bec6"), bio:"Family-run growers focused on dependable weekly vegetables, herbs and kitchen staples.", phone:"+92 300 111 2200"},
  {id:"sunny-orchard", name:"Sunny Orchard Co.", specialty:"Apples, citrus & preserves", market:"Riverside Farmers Market", rating:4.8, products:18, image:photo("photo-1464226184884-fa280b87c399"), bio:"Orchard-grown fruit and seasonal preserves prepared for local market pickup.", phone:"+92 301 222 3300"},
  {id:"honey-shed", name:"The Honey Shed", specialty:"Raw honey & beeswax goods", market:"Oak & Orchard Market", rating:5.0, products:11, image:photo("photo-1473973266408-ed4e27abdd47"), bio:"Small-batch honey products sourced from local hives and packed for market day.", phone:"+92 302 333 4400"},
  {id:"willow-creek", name:"Willow Creek Growers", specialty:"Leafy greens & salad boxes", market:"Harvest Lane Market", rating:4.9, products:16, image:photo("photo-1523742816564-b2f4cc2f7e4f"), bio:"Fresh greens and practical salad boxes harvested close to market day.", phone:"+92 303 444 5500"},
  {id:"karachi-green-growers", name:"Karachi Green Growers", specialty:"Local vegetables & market-day baskets", market:"Greenfield Saturday Market", rating:4.8, products:15, image:photo("photo-1498837167922-ddd27525d352"), bio:"A Karachi-based grower profile highlighting seasonal vegetables, kitchen staples and dependable weekend pickup.", phone:"+92 304 555 6600", spotlight:true},
];

export const defaultNotifications = [
  {id:"n1", title:"Welcome to MarketLink", message:"Your marketplace workspace is ready. Explore fresh local products and upcoming markets.", type:"info", read:false, createdAt:new Date(Date.now()-86400000).toISOString()},
  {id:"n2", title:"Pickup reminder", message:"Orders are collected at the selected market and pickup window.", type:"pickup", read:false, createdAt:new Date(Date.now()-3600000).toISOString()},
  {id:"n3", title:"Market announcement", message:"Greenfield Saturday Market is open this week from 8:00 AM to 1:00 PM.", type:"market", read:true, createdAt:new Date(Date.now()-172800000).toISOString()},
];

export const defaultReviews = [
  {id:"r1", productId:"tomatoes", productName:"Fresh Tomatoes", farmer:"Meadow Roots Farm", customer:"Ayesha K.", rating:5, comment:"Fresh, firm and exactly what I needed for the week.", farmerReply:"Thank you! We harvest on market day for the best freshness.", createdAt:"2026-09-19"},
  {id:"r2", productId:"honey", productName:"Pure Farm Honey", farmer:"The Honey Shed", customer:"Hassan M.", rating:5, comment:"Great flavor and a very clean pickup experience.", farmerReply:"We appreciate the kind feedback.", createdAt:"2026-09-16"},
  {id:"r3", productId:"spinach", productName:"Baby Spinach", farmer:"Willow Creek Growers", customer:"Sara N.", rating:4, comment:"Crisp and fresh. Lovely salad greens.", farmerReply:"Thanks for shopping local!", createdAt:"2026-09-12"},
];

export const defaultCustomers = [
  {id:"c1", name:"Ayesha Khan", email:"ayesha@example.com", phone:"+92 300 555 0101", status:"ACTIVE", orders:8, joined:"2026-04-12"},
  {id:"c2", name:"Hassan Malik", email:"hassan@example.com", phone:"+92 301 555 0102", status:"ACTIVE", orders:5, joined:"2026-05-03"},
  {id:"c3", name:"Sara Noor", email:"sara@example.com", phone:"+92 302 555 0103", status:"INACTIVE", orders:2, joined:"2026-03-27"},
];

export const defaultFarmers = farmerSeed.map((f,i)=>({id:f.id,name:f.name,contactPerson:f.name,market:f.market,status:i===2?"PENDING":"APPROVED",products:f.products,location:f.market,rating:f.rating}));

export const defaultSlots = [
  {id:"slot1", day:"Saturday", date:"2026-09-26", start:"08:30", end:"09:00", capacity:6, booked:3, active:true},
  {id:"slot2", day:"Saturday", date:"2026-09-26", start:"09:00", end:"09:30", capacity:6, booked:2, active:true},
  {id:"slot3", day:"Saturday", date:"2026-09-26", start:"10:00", end:"10:30", capacity:8, booked:5, active:true},
  {id:"slot4", day:"Sunday", date:"2026-09-27", start:"11:00", end:"11:30", capacity:5, booked:1, active:false},
];

export const defaultAnnouncements = [
  {id:"a1", title:"Weekend market schedule", audience:"All customers", message:"Greenfield Saturday Market is open this weekend from 8:00 AM to 1:00 PM.", status:"Published", createdAt:"2026-09-20"},
  {id:"a2", title:"Fresh harvest spotlight", audience:"Customers", message:"New seasonal produce is now available across selected local farms.", status:"Published", createdAt:"2026-09-17"},
];

export function readStore(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function useStoredState(key, fallback){
  const [value, setValue] = useState(()=>readStore(key, fallback));
  useEffect(()=>{
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },[key,value]);
  return [value,setValue];
}

export function money(value){return `$${Number(value||0).toFixed(2)}`;}
export function titleCase(value){return String(value||"").replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());}

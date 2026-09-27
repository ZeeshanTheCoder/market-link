import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axiosInstance";
import { getProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from "../api/productApi";
import { createOrder as apiCreateOrder, getMyOrders, updateOrder as apiUpdateOrder, cancelOrder as apiCancelOrder } from "../api/orderApi";
import { getFavorites, addFavorite, removeFavorite } from "../api/favoriteApi";

const StoreContext = createContext(null);
const CDN = "https://images.unsplash.com";
const img = (id) => `${CDN}/${id}?auto=format&fit=crop&w=3840&q=90`;

export const categories = [
  { id:"fruits", name:"Fresh Fruits", subtitle:"Sweet & juicy", image:img("photo-1619566636858-adf3ef46400b") },
  { id:"vegetables", name:"Vegetables", subtitle:"Healthy & natural", image:img("photo-1540420773420-3366772f4999") },
  { id:"dairy", name:"Dairy Products", subtitle:"Pure & fresh", image:img("photo-1550583724-b2692b85b150") },
  { id:"honey", name:"Organic Honey", subtitle:"Natural & pure", image:img("photo-1587049352846-4a222e784d38") },
  { id:"grains", name:"Grains & Pulses", subtitle:"Nutritious & healthy", image:img("photo-1515003197210-e0cd71810b5f") },
  { id:"spices", name:"Spices & Herbs", subtitle:"Freshly sourced", image:img("photo-1596040033229-a9821ebd058d") },
];

export const productsSeed = [
  {id:"tomatoes",name:"Fresh Tomatoes",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:34,description:"Juicy field-grown tomatoes for everyday cooking, salads and fresh market orders.",category:"Vegetables",price:1.99,unit:"/kg",rating:4.8,reviews:124,badge:"Bestseller",farmer:"Meadow Roots Farm",image:img("photo-1546094096-0df4bcaaa337")},
  {id:"apples",name:"Organic Apples",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Picked this week",deliveryType:"Market pickup",stock:22,description:"Crisp orchard apples packed for home kitchens and local market baskets.",category:"Fruits",price:2.49,unit:"/kg",rating:4.7,reviews:98,badge:"Organic",farmer:"Sunny Orchard Co.",image:img("photo-1560806887-1e4cd0b6cbd6")},
  {id:"carrots",name:"Fresh Carrots",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:41,description:"Sweet, crunchy carrots freshly lifted from local soil.",category:"Vegetables",price:1.79,unit:"/kg",rating:4.6,reviews:76,badge:"Popular",farmer:"Meadow Roots Farm",image:img("photo-1445282768818-728615cc910a")},
  {id:"lettuce",name:"Green Lettuce",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:18,description:"Crisp leafy greens for salads, sandwiches and daily meals.",category:"Greens",price:1.29,unit:"/each",rating:4.5,reviews:63,badge:"Organic",farmer:"Willow Creek Growers",image:img("photo-1556801712-76c8eb07bbc9")},
  {id:"blueberries",name:"Fresh Blueberries",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Picked this week",deliveryType:"Market pickup",stock:12,description:"Sweet local berries packed fresh for breakfast and desserts.",category:"Fruits",price:3.49,unit:"/box",rating:4.6,reviews:54,badge:"New",farmer:"Sunny Orchard Co.",image:img("photo-1498557850523-fd3d118b962e")},
  {id:"honey",name:"Pure Farm Honey",useCase:"daily",productType:"Pantry & Grains",harvestStatus:"Packed fresh",deliveryType:"Market pickup",stock:26,description:"Small-batch farm honey for everyday kitchens and natural pantry use.",category:"Honey",price:5.99,unit:"/jar",rating:4.9,reviews:112,badge:"Top Rated",farmer:"The Honey Shed",image:img("photo-1587049352846-4a222e784d38")},
  {id:"oranges",name:"Sweet Oranges",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Picked this week",deliveryType:"Market pickup",stock:29,description:"Juicy citrus from a local orchard, ideal for breakfast and fresh juice.",category:"Fruits",price:1.79,unit:"/kg",rating:4.6,reviews:76,badge:"Fresh",farmer:"Sunny Orchard Co.",image:img("photo-1547514701-42782101795e")},
  {id:"spinach",name:"Baby Spinach",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:16,description:"Tender baby spinach harvested for fresh meals and healthy greens.",category:"Greens",price:1.49,unit:"/bunch",rating:4.7,reviews:81,badge:"Organic",farmer:"Willow Creek Growers",image:img("photo-1576045057995-568f588f82fb")},
  {id:"potatoes",name:"Farm Potatoes",useCase:"bulk",productType:"Fresh Produce",harvestStatus:"Harvested this week",deliveryType:"Market pickup",stock:60,description:"Everyday farm potatoes available for home kitchens and larger orders.",category:"Vegetables",price:1.19,unit:"/kg",rating:4.5,reviews:69,badge:"Value",farmer:"Meadow Roots Farm",image:img("photo-1518977676601-b53f82aba655")},
  {id:"peppers",name:"Colorful Peppers",useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:24,description:"Colorful, crunchy peppers for cooking, grilling and fresh market boxes.",category:"Vegetables",price:2.29,unit:"/kg",rating:4.8,reviews:87,badge:"Popular",farmer:"Green Valley Farm",image:img("photo-1563565375-f3fdfdbefa83")},
  {id:"yogurt",name:"Farm Fresh Yogurt",useCase:"daily",productType:"Dairy & Farm Fresh",harvestStatus:"Made fresh today",deliveryType:"Market pickup",stock:14,description:"Creamy farm yogurt prepared fresh for breakfast, cooking and daily use.",category:"Dairy",price:3.99,unit:"/500g",rating:4.8,reviews:45,badge:"Fresh",farmer:"Happy Cow Dairy",image:img("photo-1488477181946-6428a0291777")},
  {id:"lentils",name:"Organic Lentils",useCase:"bulk",productType:"Pantry & Grains",harvestStatus:"Packed fresh",deliveryType:"Market pickup",stock:48,description:"Nutritious local lentils suited to daily cooking and bulk pantry orders.",category:"Grains",price:2.89,unit:"/kg",rating:4.6,reviews:39,badge:"Organic",farmer:"Golden Grain Co.",image:img("photo-1763368392508-3d4bddfdd20a")},
  {id:"cucumbers",name:"Farm Cucumbers",category:"Vegetables",price:1.39,unit:"/kg",rating:4.7,reviews:58,badge:"Fresh",farmer:"Green Valley Farm",image:img("photo-1568584711075-3e4f8c2c8c79"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:35,description:"Cool, crisp cucumbers for salads, pickles and everyday meals."},
  {id:"red-onions",name:"Red Onions",category:"Vegetables",price:1.49,unit:"/kg",rating:4.6,reviews:51,badge:"Daily",farmer:"Meadow Roots Farm",image:img("photo-1618512496248-a07fe83aa8cb"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested this week",deliveryType:"Market pickup",stock:55,description:"Kitchen-staple red onions for daily cooking and bulk baskets."},
  {id:"farm-eggs",name:"Farm Fresh Eggs",category:"Dairy",price:4.49,unit:"/dozen",rating:4.9,reviews:87,badge:"Farm Fresh",farmer:"Happy Hen Farm",image:img("photo-1569288063643-5d29ad64dfb7"),useCase:"daily",productType:"Dairy & Farm Fresh",harvestStatus:"Collected today",deliveryType:"Market pickup",stock:18,description:"Fresh free-range eggs collected from a local family farm."},
  {id:"garlic",name:"Fresh Garlic",category:"Vegetables",price:2.19,unit:"/kg",rating:4.8,reviews:42,badge:"Popular",farmer:"Meadow Roots Farm",image:img("photo-1540148426945-6cf22a6b2383"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Cured & packed",deliveryType:"Market pickup",stock:32,description:"Aromatic farm garlic for everyday cooking, sauces and pickles."},
  {id:"coriander",name:"Fresh Coriander",category:"Greens",price:0.89,unit:"/bunch",rating:4.7,reviews:37,badge:"Harvested Today",farmer:"Willow Creek Growers",image:img("photo-1588879460618-924a8eec5a9a"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:20,description:"Fragrant fresh coriander for garnishing, chutneys and daily meals."},
  {id:"maize",name:"Farm Maize",category:"Grains",price:1.99,unit:"/kg",rating:4.6,reviews:33,badge:"Bulk",farmer:"Golden Grain Co.",image:img("photo-1551754655-cd27e38d2076"),useCase:"farm",productType:"Pantry & Grains",harvestStatus:"Dried & packed",deliveryType:"Market pickup",stock:90,description:"Locally grown maize for pantry use, feed and farm production needs."},
  {id:"ginger",name:"Fresh Ginger",category:"Vegetables",price:2.69,unit:"/kg",rating:4.8,reviews:44,badge:"Fresh",farmer:"Green Valley Farm",image:img("photo-1615485290382-441e4d049cb5"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested this week",deliveryType:"Market pickup",stock:27,description:"Fresh aromatic ginger for tea, cooking, marinades and home remedies."},
  {id:"farm-chili",name:"Green Chilies",category:"Vegetables",price:1.59,unit:"/kg",rating:4.7,reviews:49,badge:"Hot Pick",farmer:"Green Valley Farm",image:img("photo-1588252303782-cb80119abd6d"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Harvested today",deliveryType:"Market pickup",stock:31,description:"Fresh green chilies with a bright kick for everyday cooking."},
  {id:"farm-seed-mix",name:"Farm Seed Mix",category:"Grains",price:8.99,unit:"/bag",rating:4.8,reviews:28,badge:"Farm Use",farmer:"Golden Grain Co.",image:img("photo-1492496913980-501348b61469"),useCase:"farm",productType:"Farm & Production Supply",harvestStatus:"Packed for planting",deliveryType:"Market pickup",stock:25,description:"Practical seed mix for small farms and seasonal production planning."},
  {id:"natural-compost",name:"Natural Farm Compost",category:"Grains",price:6.49,unit:"/bag",rating:4.7,reviews:21,badge:"Eco Farm",farmer:"Green Valley Farm",image:img("photo-1591857177580-dc82b9ac4e1e"),useCase:"farm",productType:"Farm & Production Supply",harvestStatus:"Ready to use",deliveryType:"Market pickup",stock:40,description:"Natural compost for soil care, home gardens and farm production beds."},
  {id:"alfalfa-feed",name:"Fresh Alfalfa Feed",category:"Greens",price:4.29,unit:"/bundle",rating:4.8,reviews:31,badge:"Farm Daily",farmer:"Willow Creek Growers",image:img("photo-1500595046743-cd271d694d30"),useCase:"farm",productType:"Farm & Production Supply",harvestStatus:"Cut fresh",deliveryType:"Market pickup",stock:22,description:"Fresh-cut farm feed for everyday livestock and production needs."},
  {id:"strawberries",name:"Fresh Strawberries",category:"Fruits",price:4.29,unit:"/box",rating:4.8,reviews:64,badge:"Seasonal",farmer:"Sunny Orchard Co.",image:img("photo-1464965911861-746a04b4bca6"),useCase:"daily",productType:"Fresh Produce",harvestStatus:"Picked today",deliveryType:"Market pickup",stock:15,description:"Sweet seasonal strawberries selected for breakfast, desserts and fresh market boxes."},
  {id:"brown-rice",name:"Wholegrain Brown Rice",category:"Grains",price:3.29,unit:"/kg",rating:4.7,reviews:46,badge:"Pantry Pick",farmer:"Golden Grain Co.",image:img("photo-1586201375761-83865001e31c"),useCase:"bulk",productType:"Pantry & Grains",harvestStatus:"Milled & packed",deliveryType:"Market pickup",stock:72,description:"Wholesome local brown rice for everyday meals, pantry stocking and larger orders."}
].map((p,i)=>({ ...p, minOrder:p.minOrder ?? ((p.useCase==="bulk"||p.useCase==="farm")?5:1), bulkPrice:p.bulkPrice ?? ((p.useCase==="bulk"||p.useCase==="farm")?Number((p.price*0.9).toFixed(2)):0), distance:p.distance ?? `${(1.8+(i%7)*0.55).toFixed(1)} km away`, organic:p.organic ?? /organic/i.test(String(p.badge||"")) }));

const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const normalizeRemote=(p)=>({
  ...p,
  id:p.slug||p.id||p._id,
  mongoId:p._id||p.mongoId||p.id,
  stock:Number(p.stock ?? p.quantityAvailable ?? 0),
  farmer:p.farmer||p.farmerId?.name||"Local Farmer",
  farmerId:p.farmerId?._id||p.farmerId,
  marketId:p.marketId?._id||p.marketId,
} );

export function StoreProvider({children}){
  const {user}=useAuth();
  const [products,setProducts]=useState(()=>read("ml-products",productsSeed));
  const [cart,setCart]=useState(()=>read("ml-cart",[]));
  const [favorites,setFavorites]=useState(()=>read("ml-favorites",[]));
  const [favoriteRecords,setFavoriteRecords]=useState({});
  const [orders,setOrders]=useState(()=>read("ml-orders",[]));
  const [notice,setNotice]=useState("");
  const [syncing,setSyncing]=useState(false);
  const [syncError,setSyncError]=useState("");

  const hydrateProducts=useCallback(async()=>{
    try{setSyncing(true);setSyncError("");const {data}=await getProducts({available:true});if(Array.isArray(data.products)&&data.products.length){const remote=data.products.map(normalizeRemote);setProducts(remote);localStorage.setItem("ml-products",JSON.stringify(remote));}}catch(e){setSyncError(e.userMessage||"Using local catalogue until the API is available.");}finally{setSyncing(false)}} ,[]);

  useEffect(()=>{hydrateProducts();},[hydrateProducts]);
  useEffect(()=>{localStorage.setItem("ml-products",JSON.stringify(products))},[products]);
  useEffect(()=>{localStorage.setItem("ml-cart",JSON.stringify(cart))},[cart]);
  useEffect(()=>{localStorage.setItem("ml-favorites",JSON.stringify(favorites))},[favorites]);
  useEffect(()=>{localStorage.setItem("ml-orders",JSON.stringify(orders))},[orders]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(""),2200);return()=>clearTimeout(t)},[notice]);

  useEffect(()=>{
    let active=true;
    async function loadUserData(){
      if(!user) return;
      if(user.role==="customer"){
        try{const [fo,oo]=await Promise.all([getFavorites(),getMyOrders()]);if(!active)return;const rec={};const ids=[];(fo.data.favorites||[]).forEach(f=>{const raw=f.productId;const id=raw?.slug||raw?.id||raw?._id;if(id){ids.push(String(id));rec[String(id)]=String(f._id)}});setFavorites(ids);setFavoriteRecords(rec);setOrders((oo.data.orders||[]).map(o=>({...o,id:o.id||String(o._id)})));}catch(e){setSyncError(e.userMessage||syncError)}}
      else { setFavoriteRecords({}); }
    }
    loadUserData();return()=>{active=false};
  },[user]);

  const addToCart=p=>{if(Number(p.stock??0)<=0){setNotice("This product is out of stock");return}setCart(c=>{const f=c.find(x=>x.id===p.id);return f?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}]});setNotice(`${p.name} added to cart`)};
  const updateQty=(id,qty)=>{setCart(c=>qty<1?c.filter(x=>x.id!==id):c.map(x=>x.id===id?{...x,qty}:x));setNotice(qty<1?"Item removed from cart":"Cart updated")};
  const removeFromCart=id=>{setCart(c=>c.filter(x=>x.id!==id));setNotice("Item removed from cart")};
  const toggleFavorite=async id=>{
    const product=products.find(p=>p.id===id);
    if(user?.role!=="customer"||!product?.mongoId){setFavorites(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);setNotice(favorites.includes(id)?"Removed from favorites":"Saved to favorites");return;}
    try{
      if(favoriteRecords[id]){await removeFavorite(favoriteRecords[id]);setFavorites(f=>f.filter(x=>x!==id));setFavoriteRecords(r=>{const n={...r};delete n[id];return n});setNotice("Removed from favorites");}
      else {const {data}=await addFavorite({productId:product.mongoId});setFavorites(f=>[...f,id]);setFavoriteRecords(r=>({...r,[id]:String(data.favorite._id)}));setNotice("Saved to favorites");}
    }catch(e){setNotice(e.userMessage||"Could not update favorite")}
  };

  const addProduct=async(product)=>{
    const payload={...product,quantityAvailable:Number(product.stock??product.quantityAvailable??0)};
    if(user?.role==="farmer"){
      try{const {data}=await apiCreateProduct(payload);const next=normalizeRemote(data.product);setProducts(p=>[next,...p]);setNotice(`${next.name} added to products`);return next}catch(e){setNotice(e.userMessage||"Could not publish product");return null}
    }
    const next={...product,id:product.id||`product-${Date.now()}`,price:Number(product.price)||0,rating:Number(product.rating)||5,reviews:Number(product.reviews)||0,stock:product.stock==null?20:Number(product.stock),badge:product.badge||"Fresh",farmer:product.farmer||"Local Farmer",image:product.image||img("photo-1540420773420-3366772f4999")};setProducts(p=>[next,...p]);setNotice(`${next.name} added to products`);return next;
  };
  const updateProduct=async(id,changes)=>{
    const current=products.find(x=>x.id===id);const apiId=current?.mongoId||id;
    if(user?.role==="farmer"||user?.role==="admin"){
      try{const payload={...changes,quantityAvailable:Number(changes.stock??changes.quantityAvailable??current?.stock??0)};const {data}=await apiUpdateProduct(apiId,payload);const next=normalizeRemote(data.product);setProducts(p=>p.map(x=>x.id===id?next:x));setNotice("Product updated successfully");return next}catch(e){setNotice(e.userMessage||"Could not update product");return null}
    }
    setProducts(p=>p.map(x=>x.id===id?{...x,...changes,price:Number(changes.price??x.price),stock:Number(changes.stock??x.stock)}:x));setNotice("Product updated successfully");
  };
  const deleteProduct=async id=>{
    const current=products.find(x=>x.id===id);const apiId=current?.mongoId||id;
    if(user?.role==="farmer"||user?.role==="admin"){
      try{await apiDeleteProduct(apiId)}catch(e){setNotice(e.userMessage||"Could not remove product");return}
    }
    setProducts(p=>p.filter(x=>x.id!==id));setCart(c=>c.filter(x=>x.id!==id));setFavorites(f=>f.filter(x=>x!==id));setNotice("Product removed");
  };

  const itemCount=cart.reduce((s,x)=>s+x.qty,0);
  const subtotal=cart.reduce((s,x)=>s+Number(x.price||0)*x.qty,0);
  const delivery=0; const tax=subtotal*.05; const total=subtotal+delivery+tax;
  const placeOrder=async(details={})=>{
    if(!cart.length)return null;
    if(user?.role==="customer"){
      try{
        const marketId=details.marketId||cart[0]?.marketId;
        const payload={items:cart.map(x=>({productId:x.mongoId||x._id||x.id,qty:x.qty})),marketId, pickupDate:details.pickupDate, pickupTimeSlot:details.pickupTimeSlot, customerName:details.customerName||details.name||user.name, customerPhone:details.customerPhone||details.phone||user.phone, pickupNote:details.pickupNote||details.address||""};
        const {data}=await apiCreateOrder(payload);const o={...data.order,id:data.order.id||data.order._id};setOrders(os=>[o,...os]);setCart([]);setNotice("Order placed successfully");await hydrateProducts();return o;
      }catch(e){setNotice(e.userMessage||"Could not place order");return null}
    }
    const order={id:`ML-${Date.now().toString().slice(-7)}`,items:cart,total:+total.toFixed(2),subtotal:+subtotal.toFixed(2),delivery,tax:+tax.toFixed(2),status:"PLACED",createdAt:new Date().toISOString(),...details};setOrders(o=>[order,...o]);setCart([]);setNotice("Order placed successfully");return order;
  };
  const updateOrderStatus=async(id,status)=>{setOrders(os=>os.map(o=>o.id===id?{...o,status}:o));setNotice(`Order ${String(status).toLowerCase()}`)};
  const cancelOrder=async id=>{try{if(user?.role==="customer"){const {data}=await apiCancelOrder(id,"Cancelled by customer");setOrders(os=>os.map(o=>o.id===id?{...o,status:data.order.status}:o));}else{setOrders(os=>os.map(o=>o.id===id?{...o,status:"CANCELLED"}:o));}setNotice("Order cancelled");await hydrateProducts()}catch(e){setNotice(e.userMessage||"Could not cancel order")}};
  const updateOrder=async(id,changes)=>{try{if(user?.role==="customer"){const {data}=await apiUpdateOrder(id,changes);setOrders(os=>os.map(o=>o.id===id?{...data.order,id:data.order.id||data.order._id}:o));}else setOrders(os=>os.map(o=>o.id===id?{...o,...changes}:o));setNotice("Order updated")}catch(e){setNotice(e.userMessage||"Could not update order")}};

  const value=useMemo(()=>({products,categories,cart,favorites,orders,notice,syncing,syncError,addToCart,updateQty,removeFromCart,addProduct,updateProduct,deleteProduct,toggleFavorite,itemCount,subtotal,delivery,tax,total,placeOrder,updateOrderStatus,cancelOrder,updateOrder}),[products,cart,favorites,orders,notice,syncing,syncError,itemCount,subtotal,delivery,tax,total,user]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore=()=>useContext(StoreContext);

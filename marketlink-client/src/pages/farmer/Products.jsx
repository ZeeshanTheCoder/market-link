import { useEffect,useMemo,useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { getFarmerProducts } from "../../api/farmerApi";

export default function FarmerProducts(){
 const {products,deleteProduct}=useStore(); const {user}=useAuth(); const [mine,setMine]=useState([]); const [query,setQuery]=useState(""); const [filter,setFilter]=useState("All");
 useEffect(() => {
   if (!user?._id) return;
   let live = true;
   getFarmerProducts(user._id)
     .then(({ data }) => {
       if (!live) return;
       const remote = Array.isArray(data?.products) ? data.products : [];
       setMine(remote.map((p) => ({
         ...p,
         id: p.slug || p._id,
         mongoId: p._id,
         stock: Number(p.quantityAvailable || 0),
         farmer: p.farmerId?.name || user.name,
       })));
     })
     .catch(() => {
       if (live) {
         setMine(products.filter((p) => String(p.farmerId || "") === String(user._id)));
       }
     });
   return () => { live = false; };
 }, [user, products]);
 const visible=useMemo(()=>mine.filter(p=>(filter==="All"||p.useCase===filter)&&(String(p.name||"").toLowerCase().includes(query.toLowerCase()))),[mine,query,filter]);
 const inStock=mine.filter(p=>Number(p.stock??p.quantityAvailable??0)>0).length; const low=mine.filter(p=>{const n=Number(p.stock??p.quantityAvailable??0);return n>0&&n<=8}).length; const avg=mine.reduce((a,p)=>a+Number(p.rating||0),0)/Math.max(mine.length,1);
 return <div className="space-y-7 animate-enter">
   <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="bg-gradient-to-br from-leaf-50 via-white to-navy-50 p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="eyebrow">Farmer inventory studio</p><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">My Products</h1><p className="mt-2 max-w-2xl text-sm text-stone-500">Your live MongoDB catalogue for daily-use produce, farm & production items, bulk orders and market-day stock.</p></div><Link to="/farmer/products/add" className="btn-primary shrink-0 px-6">＋ Add New Product</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-4"><Metric label="Listings" value={mine.length} icon="🌾"/><Metric label="Live stock" value={inStock} icon="✓"/><Metric label="Low stock" value={low} icon="⚡"/><Metric label="Avg rating" value={`${avg.toFixed(1)} ★`} icon="★"/></div></div></div>
   <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm md:flex-row"><input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your products..."/><div className="flex flex-wrap gap-2">{[["All","All"],["daily","Daily use"],["farm","Farm & production"],["bulk","Bulk"],["market","Market day"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={filter===v?"btn-primary px-4":"btn-outline px-4"}>{l}</button>)}</div></div>
   {visible.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map(p=><div key={p.id} className="space-y-2.5"><ProductCard product={p} farmerMode/><div className="flex gap-2"><Link to={`/farmer/products/${p.id}/edit`} className="btn-outline flex-1 px-3 py-2 text-xs">Edit</Link><button onClick={async()=>{await deleteProduct(p.id);setMine(m=>m.filter(x=>x.id!==p.id))}} className="btn-danger flex-1 px-3 py-2 text-xs">Delete</button></div></div>)}</div>:<div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center"><div className="text-5xl">🌱</div><h2 className="mt-4 text-2xl font-extrabold">No products yet</h2><p className="mt-2 text-sm text-stone-500">Approved farmers can publish their first listing here.</p><Link to="/farmer/products/add" className="btn-primary mt-5">＋ Add Product</Link></div>}
 </div>
}
function Metric({label,value,icon}){return <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-center justify-between"><span className="text-xs text-stone-400">{label}</span><span className="text-lg">{icon}</span></div><strong className="mt-1 block text-2xl text-navy-800">{value}</strong></div>}

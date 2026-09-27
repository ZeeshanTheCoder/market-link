import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const map = {
  "Favorites": {icon:"♥", accent:"rose", items:[["Saved produce","/products"],["Browse again","/products"],["My cart","/customer/cart"]]},
  "Profile": {icon:"◉", accent:"blue", items:[["Personal details","/customer/profile"],["Order preferences","/customer/orders"],["Notifications","/customer/notifications"]]},
  "Notifications": {icon:"◌", accent:"amber", items:[["Order updates","/customer/orders"],["Market announcements","/markets"],["Account alerts","/customer/profile"]]},
  "My Reviews": {icon:"★", accent:"gold", items:[["Review purchases","/customer/orders"],["Browse products","/products"],["Favorites","/customer/favorites"]]},
  "Stall Profile": {icon:"⌂", accent:"green", items:[["Store profile","/farmer/profile"],["My products","/farmer/products"],["Analytics","/farmer/analytics"]]},
  "My Products": {icon:"▦", accent:"green", items:[["All listings","/farmer/products"],["Add product","/farmer/products/add"],["Analytics","/farmer/analytics"]]},
  "Add Product": {icon:"+", accent:"green", items:[["Product details","/farmer/products/add"],["My products","/farmer/products"],["Orders","/farmer/orders"]]},
  "Edit Product": {icon:"✎", accent:"green", items:[["Update listing","/farmer/products"],["Inventory","/farmer/products"],["Reviews","/farmer/reviews"]]},
  "Orders": {icon:"▤", accent:"blue", items:[["All orders","/farmer/orders"],["Pickup slots","/farmer/pickup-slots"],["Reviews","/farmer/reviews"]]},
  "Pickup Slots": {icon:"◷", accent:"amber", items:[["Today's slots","/farmer/pickup-slots"],["Orders","/farmer/orders"],["Stall profile","/farmer/profile"]]},
  "Reviews": {icon:"★", accent:"gold", items:[["Latest feedback","/farmer/reviews"],["Products","/farmer/products"],["Analytics","/farmer/analytics"]]},
  "Analytics": {icon:"↗", accent:"blue", items:[["Sales overview","/farmer/analytics"],["Products","/farmer/products"],["Orders","/farmer/orders"]]},
  "Manage Farmers": {icon:"♙", accent:"green", items:[["Approve profiles","/admin/farmers"],["Farmer products","/admin/products"],["Farmer reports","/admin/reports"]]},
  "Manage Customers": {icon:"♙", accent:"blue", items:[["Customer accounts","/admin/customers"],["Orders","/admin/reports"],["Reviews","/admin/reviews"]]},
  "Manage Markets": {icon:"⌖", accent:"amber", items:[["Market locations","/admin/markets"],["Farmers","/admin/farmers"],["Announcements","/admin/announcements"]]},
  "Moderate Products": {icon:"▦", accent:"green", items:[["Product listings","/admin/products"],["Categories","/admin/categories"],["Reports","/admin/reports"]]},
  "Moderate Reviews": {icon:"★", accent:"gold", items:[["Pending reviews","/admin/reviews"],["Customers","/admin/customers"],["Reports","/admin/reports"]]},
  "Reports": {icon:"▥", accent:"blue", items:[["Sales report","/admin/reports"],["Orders","/admin/reports"],["Marketplace health","/admin/dashboard"]]},
  "Categories": {icon:"⌘", accent:"green", items:[["Product categories","/admin/categories"],["Products","/admin/products"],["Reports","/admin/reports"]]},
  "Announcements": {icon:"◈", accent:"amber", items:[["Publish announcement","/admin/announcements"],["Markets","/admin/markets"],["Customers","/admin/customers"]]}
};

const accentClass={green:"from-leaf-100 to-white text-leaf-800",blue:"from-blue-50 to-white text-blue-900",amber:"from-amber-50 to-white text-amber-900",gold:"from-yellow-50 to-white text-yellow-900",rose:"from-rose-50 to-white text-rose-900"};

export default function AppSection({title}){
 const cfg=map[title]||{icon:"•",accent:"green",items:[["Dashboard","/customer/dashboard"],["Products","/products"],["Orders","/customer/orders"]]};
 const {products,orders,cart,favorites,addToCart}=useStore();
 const location=useLocation();
 const isAdmin=location.pathname.startsWith("/admin");
 const isFarmer=location.pathname.startsWith("/farmer");
 const isCustomer=location.pathname.startsWith("/customer");
 const quick = isAdmin ? [["Total products",products.length],["Orders",orders.length+128],["Farmers",184],["Customers",1248]] : isFarmer ? [["Listings",products.length],["Open orders",32],["Monthly sales","$3,840"],["Rating","4.8 ★"]] : [["Cart items",cart.reduce((a,x)=>a+x.qty,0)],["Orders",orders.length],["Favorites",favorites.length],["Saved value","$48"]];
 return <div className="space-y-8 animate-enter">
   <div className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_18px_55px_rgba(20,56,92,.08)] sm:p-8">
     <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-leaf-100/60 blur-2xl"/>
     <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="eyebrow">{isAdmin?"Admin control":isFarmer?"Farmer workspace":"Customer workspace"}</span><h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-stone-500">A polished working section for {title.toLowerCase()}, ready for live API and database wiring.</p></div><Link to={isAdmin?"/admin/dashboard":isFarmer?"/farmer/dashboard":"/customer/dashboard"} className="btn-primary">← Dashboard</Link></div>
   </div>
   <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{quick.map(([label,value],i)=><div key={label} className={`role-stat role-stat-${i} group relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br ${accentClass[cfg.accent]} p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl`}><div className="absolute right-3 top-3 text-2xl opacity-20 transition group-hover:scale-125 group-hover:opacity-40">{cfg.icon}</div><p className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</p><strong className="mt-2 block text-3xl">{value}</strong><span className="mt-1 block text-xs opacity-60">Live local data</span></div>)}</div>
   <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><p className="eyebrow">Quick actions</p><h2 className="mt-1 text-2xl font-extrabold">Everything you need</h2></div><span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-bold text-leaf-800">Working UI</span></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{cfg.items.map(([label,to],i)=><Link key={label} to={to} className={`quick-action qa-${i} group rounded-2xl border border-stone-200 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg`}><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-50 text-lg font-black text-leaf-700 transition group-hover:scale-110 group-hover:rotate-3">{i+1}</span><b className="mt-4 block">{label}</b><span className="mt-1 block text-xs text-stone-500">Open workspace →</span></Link>)}</div></section>
    <section className="rounded-3xl bg-navy-900 p-6 text-white shadow-xl"><div className="text-3xl">{cfg.icon}</div><h2 className="mt-4 text-xl font-extrabold text-white">{isAdmin?"Full platform access":isFarmer?"Grow your stall":"Shop smarter"}</h2><p className="mt-2 text-sm leading-7 text-white/65">The front-end state is persistent today and structured so the backend can be connected later.</p><Link to="/products" className="btn mt-5 bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15">Browse marketplace</Link></section>
   </div>
   {isFarmer && <ProductMini products={products} addToCart={addToCart}/>} 
 </div>
}
function ProductMini({products,addToCart}){return <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="flex items-end justify-between"><div><p className="eyebrow">Inventory preview</p><h2 className="mt-1 text-2xl font-extrabold">Your product shelf</h2></div><Link to="/farmer/products" className="text-sm font-bold text-leaf-700">View all →</Link></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0,4).map(p=><div key={p.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"><div className="aspect-[4/3] overflow-hidden"><img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" onError={e=>e.currentTarget.src="/images/greens.svg"}/></div><div className="p-4"><b className="text-sm">{p.name}</b><p className="mt-1 text-xs text-stone-500">{p.price.toFixed(2)} {p.unit}</p><button onClick={()=>addToCart(p)} className="mt-3 w-full rounded-xl bg-leaf-50 py-2 text-xs font-bold text-leaf-800 transition hover:bg-leaf-100">Preview in cart</button></div></div>)}</div></section>}

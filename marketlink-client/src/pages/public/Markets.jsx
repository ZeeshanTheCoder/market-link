import { Link, useLocation } from "react-router-dom";
import { useEffect,useState } from "react";
import Icon from "../../components/common/Icons";
import { getMarkets } from "../../api/marketApi";
import { marketSeed } from "../portal/shared";

export default function Markets(){
  const location = useLocation();
  const customerArea = location.pathname.startsWith("/customer/");
  const [filter,setFilter] = useState("All markets");
  const [markets,setMarkets] = useState(marketSeed);
  useEffect(()=>{getMarkets().then(({data})=>{if(data.markets?.length)setMarkets(data.markets)}).catch(()=>{})},[]);
  const visible = filter === "All markets" ? markets : markets.filter(m => filter === "Weekend" ? ["Saturday","Sunday"].includes(m.day||m.operatingDays?.[0]) : !["Saturday","Sunday"].includes(m.day||m.operatingDays?.[0]));
  return <div>
    <section className="border-b border-stone-200/70 bg-gradient-to-br from-leaf-50 via-cream to-white py-12 sm:py-14 overflow-hidden">
      <div className="shell relative"><div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-leaf-100/80 blur-3xl animate-float"/><p className="eyebrow animate-enter">Explore local markets</p><h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.035em] sm:text-5xl animate-enter">Find your next market stop.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 animate-enter">Discover weekly farmers markets, see what is available, and plan your pickup before you leave home.</p><div className="mt-5 flex flex-wrap gap-1.5">{["All markets","Weekend","Weekday"].map(x=><button key={x} onClick={()=>setFilter(x)} className={filter===x?"btn-primary px-3 py-1.5 text-xs":"btn-outline px-3 py-1.5 text-xs"}>{x}</button>)}</div></div>
    </section>

    <section className="py-10 sm:py-12"><div className="shell"><div className="grid gap-4 md:grid-cols-3">
      {[['⏰','Plan ahead','Check the market day and pickup hours before you order.'],['🧺','Reserve fresh stock','Add the produce you need, then choose an available pickup slot.'],['📍','Meet locally','Collect at the market and keep the payment handover in person.']].map(([i,t,x])=><div key={t} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="text-2xl">{i}</span><h3 className="mt-3 font-extrabold">{t}</h3><p className="mt-1 text-sm leading-6 text-stone-500">{x}</p></div>)}
    </div></div></section>

    <section className="pb-16 sm:pb-20"><div className="shell grid gap-5 md:grid-cols-2">{visible.map((m,i)=><article key={m._id||m.id||m.name} className="premium-card group animate-enter p-5 sm:p-6" style={{animationDelay:`${i*70}ms`}}><div className="vip-shine mb-5 overflow-hidden rounded-2xl"><img src={m.image} alt={`${m.name} market`} className="image-zoom h-48 w-full object-cover group-hover:scale-105" onError={e=>e.currentTarget.src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=88"}/></div><div className="flex items-start justify-between gap-4"><span className="badge bg-leaf-100 text-leaf-800">{m.tag||"Open this week"}</span><Icon name="mapPin" className="h-5 w-5 text-leaf-600"/></div><h2 className="mt-4 text-xl font-extrabold tracking-tight">{m.name}</h2><p className="mt-1 text-sm text-stone-500">{m.area}</p><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-leaf-50 p-3.5"><span className="block text-[11px] uppercase tracking-wider text-stone-500">Market day</span><strong>{m.day||m.operatingDays?.[0]}</strong></div><div className="rounded-2xl bg-navy-50 p-3.5"><span className="block text-[11px] uppercase tracking-wider text-stone-500">Hours</span><strong>{m.time||m.timings}</strong></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 text-sm"><span className="text-stone-500">{m.stalls||0} stalls</span><div className="flex flex-wrap items-center gap-3"><Link to={customerArea ? `/customer/markets/${m.slug||m.id}` : `/markets/${m.slug||m.id}`} className="font-bold text-navy-700 hover:text-leaf-700">View market →</Link><Link to={customerArea ? "/customer/products" : "/products"} className="font-bold text-leaf-700">Browse produce →</Link></div></div></article>)}</div></section>
  </div>
}

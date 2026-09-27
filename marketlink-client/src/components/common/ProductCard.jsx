import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

const tone={
  Vegetables:"border-leaf-200 hover:shadow-[0_28px_70px_rgba(98,130,42,.20)]",
  Fruits:"border-orange-100 hover:shadow-[0_28px_70px_rgba(234,88,12,.16)]",
  Greens:"border-emerald-100 hover:shadow-[0_28px_70px_rgba(16,185,129,.18)]",
  Honey:"border-amber-100 hover:shadow-[0_28px_70px_rgba(245,158,11,.18)]",
  Dairy:"border-sky-100 hover:shadow-[0_28px_70px_rgba(14,165,233,.18)]",
  Grains:"border-yellow-100 hover:shadow-[0_28px_70px_rgba(202,138,4,.17)]",
};
const useCaseLabel={daily:"Daily use",farm:"Farm & production",bulk:"Bulk order",market:"Market day"};

export default function ProductCard({product, farmerMode=false}){
  const {addToCart,updateQty,cart,favorites,toggleFavorite,removeFromCart}=useStore();
  const location = useLocation();
  const customerArea = location.pathname.startsWith("/customer/");
  const productDetailsPath = customerArea ? `/customer/products/${product.id}` : `/products/${product.id}`;
  const fav=favorites.includes(product.id);
  const cartItem=cart.find(x=>x.id===product.id);
  const qty=cartItem?.qty||0;
  const category=product.category||"Produce";
  const stock=Math.max(0,Number(product.stock ?? 20));
  const lowStock=stock>0 && stock<=8;
  const useCase=product.useCase||"daily";
  const minOrder=Math.max(1,Number(product.minOrder||1));
  const bulkPrice=Number(product.bulkPrice||0);
  const rating=Number(product.rating||0);
  const reviews=Number(product.reviews||0);
  const organic=Boolean(product.organic ?? /organic|eco/i.test(product.badge||""));
  const distance=product.distance||"2.4 km away";
  const freshness=product.harvestStatus||"Farm fresh";

  return <article className={`product-card group relative overflow-hidden rounded-[20px] border bg-white shadow-[0_12px_36px_rgba(35,56,74,.075)] transition-all duration-500 hover:-translate-y-1 ${tone[category]||"border-stone-200 hover:shadow-xl"}`}>
    <div className="relative aspect-[1.18] overflow-hidden bg-stone-100">
      <img src={product.image} alt={product.name} loading="lazy" decoding="async" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 20vw" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.09]" onError={e=>{e.currentTarget.src="/images/greens.svg"}}/>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-85"/>
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3.5">
        <div className="flex max-w-[80%] flex-wrap gap-1.5">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-leaf-800 shadow-sm backdrop-blur">{product.badge||"Fresh"}</span>
          {organic && <span className="rounded-full bg-leaf-700/90 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm backdrop-blur">🌱 Organic</span>}
        </div>
        {!farmerMode && <button type="button" onClick={()=>toggleFavorite(product.id)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm backdrop-blur transition duration-300 hover:scale-110 hover:rotate-6 ${fav?"text-tomato":"text-navy-800"}`} aria-label="Toggle favorite">{fav?"♥":"♡"}</button>}
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
        <div className="min-w-0 rounded-xl bg-white/90 px-2.5 py-1.5 shadow-sm backdrop-blur">
          <span className="block truncate text-[9px] font-extrabold uppercase tracking-[.14em] text-stone-400">Freshness</span>
          <span className="block max-w-[150px] truncate text-[10px] font-bold text-navy-800">{freshness}</span>
        </div>
        <span className={`rounded-full px-2.5 py-1.5 text-[10px] font-extrabold shadow-sm backdrop-blur ${stock===0?"bg-red-600/95 text-white":lowStock?"bg-amber-500/95 text-white":"bg-leaf-700/90 text-white"}`}>{stock===0?"Out of stock":lowStock?`${stock} left`:`${stock} available`}</span>
      </div>
      <div className="product-card-quick absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full bg-navy-900/90 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur sm:block">Quick market view →</div>
    </div>

    <div className="p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="product-card-meta text-[9px] font-bold uppercase tracking-[.16em] text-stone-400">{category} · {useCaseLabel[useCase]||useCase}</span>
        <span className="whitespace-nowrap text-[11px] font-extrabold text-amber-500">★ {rating.toFixed(1)} <span className="font-medium text-stone-400">({reviews})</span></span>
      </div>
      <h3 className="mt-2 line-clamp-1 text-[16px] font-extrabold tracking-tight text-navy-800">{product.name}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-stone-500">
        <span className="inline-flex items-center gap-1 font-semibold text-navy-700">👨‍🌾 {product.farmer||"Local Farmer"}</span>
        <span className="text-stone-300">•</span><span>📍 {distance}</span>
      </div>
      {product.description && <p className="mt-2 line-clamp-1 text-[11px] leading-5 text-stone-500">{product.description}</p>}

      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
        <div className="rounded-xl bg-stone-50 px-2.5 py-2"><span className="block font-bold uppercase tracking-wider text-stone-400">Order</span><strong className="text-navy-800">Min {minOrder} {String(product.unit||"unit").replace(/^\//,"")}</strong></div>
        <div className="rounded-xl bg-stone-50 px-2.5 py-2"><span className="block font-bold uppercase tracking-wider text-stone-400">Service</span><strong className="text-navy-800">{product.deliveryType||"Market pickup"}</strong></div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div><strong className="text-[20px] font-black text-leaf-700">${Number(product.price||0).toFixed(2)}</strong><span className="ml-1 text-xs text-stone-400">{product.unit||"/unit"}</span></div>
          {bulkPrice>0 && bulkPrice<Number(product.price||0) && <span className="text-[10px] font-bold text-navy-600">Bulk: ${bulkPrice.toFixed(2)} {product.unit||"/unit"}</span>}
        </div>
        {farmerMode ? <div className="rounded-xl bg-leaf-50 px-3 py-2 text-right"><span className="block text-[9px] font-bold uppercase tracking-wider text-stone-400">Inventory</span><strong className="text-sm text-leaf-800">{stock} units</strong></div> : qty>0 ? <div className="flex items-center rounded-xl border border-leaf-200 bg-leaf-50 p-1">
          <button type="button" onClick={()=>qty===1?removeFromCart(product.id):updateQty(product.id,qty-1)} className="h-8 w-8 rounded-lg font-black text-leaf-800 transition hover:bg-white" aria-label="Decrease quantity">−</button>
          <span className="w-7 text-center text-sm font-extrabold text-navy-800">{qty}</span>
          <button type="button" onClick={()=>addToCart(product)} className="h-8 w-8 rounded-lg font-black text-leaf-800 transition hover:bg-white" aria-label="Increase quantity">+</button>
        </div> : <button type="button" disabled={stock===0} onClick={()=>addToCart(product)} className="btn-primary px-3.5 py-2 text-xs shadow-sm hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">🛒 Add to cart</button>}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
        {farmerMode ? <><span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Your listing</span><span className="text-[10px] font-semibold text-leaf-700">● Live on marketplace</span></> : <><Link to={productDetailsPath} className="text-[11px] font-bold text-navy-700 transition hover:text-leaf-700">View details →</Link><Link to="/customer/cart" className="text-[11px] font-bold text-stone-400 transition hover:text-navy-700">Basket</Link></>}
      </div>
    </div>
  </article>
}

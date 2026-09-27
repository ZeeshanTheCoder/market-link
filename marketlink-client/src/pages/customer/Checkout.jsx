import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { getPickupSlots } from "../../api/pickupApi";
import { useAuth } from "../../hooks/useAuth";

export default function Checkout(){
  const {cart,subtotal,delivery,tax,total,placeOrder}=useStore();
  const {user}=useAuth(); const nav=useNavigate();
  const [slots,setSlots]=useState([]); const [loadingSlots,setLoadingSlots]=useState(false);
  const first=cart[0];
  const marketId=first?.marketId; const farmerId=first?.farmerId;
  const sameMarket=cart.every(x=>String(x.marketId||"")===String(marketId||""));
  const [form,setForm]=useState({name:user?.name||"",phone:user?.phone||"",address:user?.address||"",pickupDate:"",pickupTimeSlot:""});
  useEffect(()=>{if(!form.pickupDate||!marketId)return;let live=true;setLoadingSlots(true);getPickupSlots({marketId,date:form.pickupDate}).then(({data})=>{if(live)setSlots(data.slots||[])}).catch(()=>{if(live)setSlots([])}).finally(()=>{if(live)setLoadingSlots(false)});return()=>{live=false}},[form.pickupDate,marketId]);
  const marketLabel=first?.marketName||"Selected market";
  const submit=async e=>{e.preventDefault();if(!sameMarket||!form.pickupDate||!form.pickupTimeSlot)return;const o=await placeOrder({...form,marketId,farmerId,customerName:form.name,customerPhone:form.phone,pickupNote:form.address});if(o)nav(`/customer/orders/${o.id}`)};
  if(!cart.length)return <div className="shell section-space text-center"><h1 className="text-3xl font-extrabold">Nothing to checkout</h1><button className="btn-primary mt-6" onClick={()=>nav('/products')}>Browse Products</button></div>;
  if(!sameMarket)return <div className="shell section-space"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center"><h1 className="text-2xl font-extrabold">One market per pickup order</h1><p className="mt-2 text-sm text-stone-600">Your cart contains products from different markets. Please checkout one market at a time.</p><button className="btn-primary mt-5" onClick={()=>nav('/customer/cart')}>Review cart</button></div></div>;
  return <div className="shell section-space"><p className="eyebrow">Market pickup checkout</p><h1 className="mt-2 text-4xl font-extrabold">Complete your order</h1><form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
    <div className="rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-xl font-extrabold">Pickup details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2"><span className="label">Full name</span><input required className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
      <label><span className="label">Phone</span><input required className="input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
      <label><span className="label">Market</span><input className="input bg-stone-50" value={marketLabel} readOnly/></label>
      <label><span className="label">Pickup date</span><input required type="date" min={new Date().toISOString().slice(0,10)} className="input" value={form.pickupDate} onChange={e=>setForm({...form,pickupDate:e.target.value,pickupTimeSlot:""})}/></label>
      <label><span className="label">Pickup time slot</span><select required className="input" value={form.pickupTimeSlot} onChange={e=>setForm({...form,pickupTimeSlot:e.target.value})} disabled={!form.pickupDate||loadingSlots}><option value="">{loadingSlots?"Loading slots...":form.pickupDate?(slots.length?"Select available slot":"No available slots"):"Select date first"}</option>{slots.map(s=><option key={s._id||s.id} value={`${s.start}–${s.end}`}>{s.start} – {s.end} · {Math.max(0,Number(s.capacity)-Number(s.booked))} spots</option>)}</select></label>
      <label className="sm:col-span-2"><span className="label">Pickup note</span><textarea required rows="4" className="input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Optional note for your market pickup..."/></label>
    </div><div className="mt-5 rounded-2xl bg-leaf-50 p-4 text-sm text-stone-600">MarketLink uses market pickup only. Online payment and delivery are outside the current SRS; payment is settled at pickup.</div></div>
    <aside className="h-fit rounded-3xl bg-navy-900 p-6 text-white"><h2 className="text-xl font-extrabold">Order summary</h2><div className="mt-5 space-y-3">{cart.map(x=><div key={x.id} className="flex justify-between gap-4 text-sm"><span>{x.name} × {x.qty}</span><span>${(x.price*x.qty).toFixed(2)}</span></div>)}</div><div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Pickup</span><span>${delivery.toFixed(2)}</span></div><div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div><div className="flex justify-between pt-3 text-lg font-extrabold"><span>Total</span><span>${total.toFixed(2)}</span></div></div><button disabled={!form.pickupDate||!form.pickupTimeSlot||loadingSlots} className="btn mt-6 w-full bg-leaf-500 text-white hover:bg-leaf-400 disabled:cursor-not-allowed disabled:opacity-50">Place Order</button></aside>
  </form></div>
}

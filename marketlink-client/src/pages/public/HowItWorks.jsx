import { Link } from "react-router-dom";
import Icon from "../../components/common/Icons";

const steps=[
  ["01","Discover","Choose a nearby market, then explore the farmers and products available for that market.","leaf"],
  ["02","Reserve","Add fresh items to your basket and select an available pickup date and time slot.","basket"],
  ["03","Collect","Meet your farmer at the market. Your order is prepared and waiting for you.","mapPin"],
  ["04","Pay","Pay the farmer at pickup. No online payment is required.","check"],
];

export default function HowItWorks(){return <div>
  <section className="bg-gradient-to-br from-leaf-50 via-white to-[#eef4fb] py-16 sm:py-20"><div className="shell text-center"><p className="eyebrow">Simple by design</p><h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-[-.035em] sm:text-5xl">From browsing to basket in four clear steps.</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-stone-600">MarketLink keeps the digital part simple while the actual handover stays local and personal.</p></div></section>
  <section className="shell py-12 sm:py-14"><div className="grid gap-5 md:grid-cols-2">{steps.map(([n,title,text,icon],i)=><article key={n} className="group relative overflow-hidden rounded-[26px] border border-stone-200 bg-gradient-to-br from-white via-white to-leaf-50/70 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-leaf-100/60 blur-2xl transition duration-500 group-hover:scale-125"/><div className="relative flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-sm font-extrabold text-white shadow-sm">{n}</span><div><span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-100 text-leaf-800"><Icon name={icon} className="h-4 w-4"/></span><h2 className="mt-3 text-xl font-extrabold">{title}</h2><p className="mt-2 text-sm leading-7 text-stone-500">{text}</p></div></div></article>)}</div>
    <div className="mt-10 rounded-[28px] bg-gradient-to-r from-navy-900 via-navy-800 to-[#315442] p-6 text-white shadow-xl sm:p-8"><div className="grid gap-5 md:grid-cols-3">{[["No delivery","Pick up at the market you choose."],["Pay at pickup","Keep payment between you and the farmer."],["Less waste","Farmers prepare closer to actual demand."]].map(([t,x])=><div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon name="check" className="h-5 w-5 text-leaf-200"/><h3 className="mt-3 font-extrabold text-white">{t}</h3><p className="mt-1 text-sm text-white/65">{x}</p></div>)}</div></div>
    <div className="mt-10 text-center"><Link to="/markets" className="btn-primary">Explore markets →</Link></div>
  </section>
</div>}

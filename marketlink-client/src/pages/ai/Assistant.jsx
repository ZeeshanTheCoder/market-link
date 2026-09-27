import { useState } from "react";
import { Link } from "react-router-dom";
import AIAssistant from "../../components/common/AIAssistant";
import { useAuth } from "../../hooks/useAuth";

const topics = [
  ["Products", "Price, stock, categories, freshness and use cases."],
  ["Markets", "Market days, hours, areas and pickup planning."],
  ["Farmers", "Grower profiles, specialties and market listings."],
  ["Orders", "Cart, pickup slots, order status and payment-at-pickup."],
];

export default function Assistant() {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(true);
  const dashboard = user?.role === "admin" ? "/admin/dashboard" : user?.role === "farmer" ? "/farmer/dashboard" : user?.role === "customer" ? "/customer/dashboard" : "/";
  const homeLabel = user ? "Dashboard" : "Home";

  return (
    <div className="shell section-space">
      <div className="mb-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-leaf-50 text-sm">✦</span>
            <span className="truncate text-[11px] font-extrabold uppercase tracking-[0.14em] text-stone-500">Quick navigation</span>
          </div>
          <button type="button" onClick={() => setNavOpen((v) => !v)} className="rounded-lg border border-stone-200 px-2.5 py-1.5 text-[10px] font-bold text-navy-800 transition hover:border-leaf-200 hover:bg-leaf-50">{navOpen ? "Collapse" : "Expand"}</button>
        </div>
        {navOpen && (
          <div className="flex flex-wrap gap-1.5 border-t border-stone-100 px-3 py-2.5 sm:px-4">
            <Link to={dashboard} className="rounded-lg bg-leaf-50 px-3 py-1.5 text-[11px] font-extrabold text-leaf-800 transition hover:-translate-y-0.5 hover:bg-leaf-100">← {homeLabel}</Link>
            <Link to={user?.role === "customer" ? "/customer/products" : "/products"} className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-bold text-navy-800 transition hover:-translate-y-0.5 hover:border-leaf-200">Products</Link>
            <Link to={user?.role === "customer" ? "/customer/markets" : "/markets"} className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-bold text-navy-800 transition hover:-translate-y-0.5 hover:border-leaf-200">Markets</Link>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">MarketLink AI</p>
          <h1 className="mt-1.5 text-3xl font-extrabold text-navy-900 sm:text-4xl">Ask the marketplace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">A compact assistant grounded in MarketLink's products, farmers, markets and pickup rules.</p>
        </div>
        <Link to={user?.role === "customer" ? "/customer/products" : "/products"} className="btn-outline self-start sm:self-auto">Browse products</Link>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {topics.map(([title, text]) => (
          <div key={title} className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-xs font-extrabold text-navy-900">{title}</div>
            <p className="mt-1 text-[11px] leading-5 text-stone-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <AIAssistant fullPage />
      </div>
    </div>
  );
}

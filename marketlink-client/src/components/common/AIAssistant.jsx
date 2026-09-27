import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { askMarketLinkAI } from "../../api/aiApi";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../hooks/useAuth";
import { marketSeed, farmerSeed, defaultSlots } from "../../pages/portal/shared";

const starterPool = [
  "Find organic products",
  "What is open Saturday?",
  "Show farm-use items",
  "How does pickup work?",
  "Who are the local farmers?",
  "How does payment work?",
  "Where is Greenfield Market?",
  "Which products are freshest today?",
  "Can I order in bulk?",
  "How do I become a farmer seller?",
  "How do reviews work?",
  "Can I get delivery?",
];

function contextFromStore(products) {
  return {
    products: products.slice(0, 60),
    markets: marketSeed,
    farmers: farmerSeed,
    slots: defaultSlots,
  };
}

function resultId(item) {
  return item?.slug || item?.id || item?._id || "";
}

export default function AIAssistant({ fullPage = false }) {
  const { products } = useStore();
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(fullPage);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I’m MarketLink AI. Ask me about products, farmers, markets, pickup, orders, reviews, or payment.",
    },
  ]);
  const context = useMemo(() => contextFromStore(products), [products]);
  const starters = useMemo(() => [...starterPool].sort(() => Math.random() - 0.5).slice(0, 6), []);
  const hasUserMessages = messages.some((item) => item.role === "user");

  if (!fullPage && (location.pathname === "/assistant" || location.pathname === "/customer/assistant")) return null;

  const send = async (preset) => {
    const text = String(preset ?? message).trim();
    if (!text || busy) return;
    setMessage("");
    setMessages((items) => [...items, { role: "user", text }]);
    setBusy(true);
    try {
      const { data } = await askMarketLinkAI({ message: text, context });
      setMessages((items) => [
        ...items,
        { role: "assistant", text: data.reply, matches: data.matches || [], source: data.source },
      ]);
    } catch (error) {
      setMessages((items) => [
        ...items,
        { role: "assistant", text: error.userMessage || "The MarketLink assistant is temporarily unavailable. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const shell = fullPage
    ? "mx-auto max-w-5xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_18px_55px_rgba(20,56,92,.10)]"
    : "fixed bottom-4 right-4 z-[90] w-[min(304px,calc(100vw-16px))] overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_22px_60px_rgba(20,56,92,.20)]";

  return (
    <div className={`${shell} ai-panel-compact`}>
      {!fullPage && !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-2.5 bg-navy-900 px-3 py-2.5 text-left text-white transition hover:-translate-y-0.5"
          aria-label="Open MarketLink AI assistant"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf-600 text-base shadow-sm">✦</span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold">MarketLink AI</span>
            <span className="block truncate text-[10px] text-white/70">Products • farmers • markets • pickup</span>
          </span>
          <span className="text-base opacity-70 transition group-hover:translate-x-0.5">→</span>
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2.5 border-b border-stone-200 bg-navy-900 px-3 py-2.5 text-white">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-leaf-600 text-base">✦</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-extrabold">MarketLink AI</div>
              <div className="text-[10px] text-white/65">Grounded in MarketLink data</div>
            </div>
            {user && (
              <Link
                to={user.role === "admin" ? "/admin/dashboard" : user.role === "farmer" ? "/farmer/dashboard" : "/customer/dashboard"}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-[9px] font-bold text-white/85 transition hover:bg-white/10"
              >
                Dashboard
              </Link>
            )}
            {!fullPage && (
              <button onClick={() => setOpen(false)} className="rounded-lg px-1.5 py-1 text-white/70 hover:bg-white/10" aria-label="Close assistant">
                ×
              </button>
            )}
          </div>

          <div className={`${fullPage ? "min-h-[460px] max-h-[60vh]" : "max-h-[330px]"} overflow-y-auto bg-cream/40 px-3 py-3`}>
            {!hasUserMessages && (
              <div className="mb-3 rounded-xl border border-leaf-100 bg-leaf-50/70 p-2.5">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[.16em] text-leaf-800">Try asking</div>
                <div className="flex flex-wrap gap-1.5">
                  {starters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => send(starter)}
                      className="rounded-lg border border-leaf-100 bg-white px-2 py-1.5 text-[10px] font-bold text-navy-800 transition hover:-translate-y-0.5 hover:border-leaf-300 hover:bg-white"
                      disabled={busy}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {messages.map((m, index) => (
                <div key={`${m.role}-${index}`} className={m.role === "user" ? "ml-auto max-w-[88%]" : "mr-auto max-w-[94%]"}>
                  <div className={m.role === "user" ? "rounded-xl rounded-br-md bg-navy-900 px-3 py-2.5 text-xs leading-5 text-white" : "rounded-xl rounded-bl-md border border-stone-200 bg-white px-3 py-2.5 text-xs leading-5 text-navy-900 shadow-sm"}>
                    {m.text}
                  </div>
                  {m.matches?.products?.length ? (
                    <div className="mt-1.5 grid gap-1.5">
                      {m.matches.products.slice(0, 4).map((p) => (
                        <Link key={resultId(p)} to={user?.role === "customer" ? `/customer/products/${resultId(p)}` : `/products/${resultId(p)}`} className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-[10px] transition hover:border-leaf-200 hover:bg-leaf-50/40">
                          <span className="font-bold text-navy-900">{p.name}</span>
                          <span className="shrink-0 font-extrabold text-leaf-700">${Number(p.price || 0).toFixed(2)}{p.unit || ""}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {m.matches?.markets?.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.matches.markets.slice(0, 3).map((mkt) => (
                        <Link key={resultId(mkt)} to={user?.role === "customer" ? `/customer/markets/${resultId(mkt)}` : `/markets/${resultId(mkt)}`} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[10px] font-bold text-navy-800 hover:border-leaf-200 hover:text-leaf-700">
                          {mkt.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {m.matches?.farmers?.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.matches.farmers.slice(0, 3).map((f) => (
                        <Link key={resultId(f)} to={`/farmers/${resultId(f)}`} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[10px] font-bold text-navy-800 hover:border-leaf-200 hover:text-leaf-700">
                          {f.name || f.stallName}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            {busy && <div className="mt-2.5 mr-auto rounded-xl rounded-bl-md border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-500 shadow-sm">Thinking<span className="animate-pulse">…</span></div>}
          </div>

          <div className="border-t border-stone-200 bg-white p-2.5">
            <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-1.5">
              <input className="input min-w-0 flex-1 px-3 py-2 text-xs" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask MarketLink…" disabled={busy} />
              <button className="btn-primary shrink-0 px-3 py-2 text-xs" disabled={busy || !message.trim()}>Ask</button>
            </form>
            {!fullPage && <p className="mt-1.5 text-[9px] text-stone-400">Use the assistant for product, farmer, market and pickup questions.</p>}
          </div>
        </>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import Icon from "../../components/common/Icons";

const contactImage = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1800&q=90";

export default function Contact() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0">
          <img
            src={contactImage}
            alt="Fresh produce at a farmers market"
            className="h-full w-full object-cover object-center opacity-70"
            loading="eager"
            onError={(e) => { e.currentTarget.src = "/images/marketlink-market-stall.webp"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/65 to-navy-900/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent" />
        </div>

        <div className="shell relative grid min-h-[360px] items-center gap-8 py-10 lg:grid-cols-[1.05fr_.95fr] lg:py-12">
          <div className="max-w-2xl text-white">
            <p className="eyebrow text-leaf-200 animate-enter">Contact MarketLink</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-[-.04em] text-white sm:text-5xl animate-enter">
              Questions about your next market-day pickup?
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Get help with pre-orders, farmer listings, pickup windows or finding fresh local produce across Karachi markets.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/markets" className="btn bg-leaf-500 text-white hover:bg-leaf-400">Explore markets →</Link>
              <Link to="/assistant" className="btn border border-white/20 bg-white/10 text-white hover:bg-white/15">Ask MarketLink AI</Link>
            </div>
          </div>

          <div className="premium-card overflow-hidden border-white/15 bg-white/95 p-0 shadow-2xl backdrop-blur-sm">
            <div className="grid sm:grid-cols-2">
              <a href="mailto:support@marketlink.example" className="group flex items-center gap-3 border-b border-stone-200 p-5 transition hover:bg-leaf-50 sm:border-b-0 sm:border-r">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-navy-700 transition duration-300 group-hover:scale-105"><Icon name="bell" /></span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">Email</span>
                  <span className="mt-0.5 block truncate text-sm font-extrabold text-navy-800">support@marketlink.example</span>
                </span>
              </a>
              <div className="flex items-center gap-3 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700"><Icon name="clock" /></span>
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">Support hours</span>
                  <span className="mt-0.5 block text-sm font-extrabold text-navy-800">Mon–Sat · 9am–6pm</span>
                </span>
              </div>
            </div>
            <div className="border-t border-stone-200 bg-gradient-to-r from-leaf-50 via-white to-navy-50 px-5 py-4">
              <p className="text-xs font-extrabold text-navy-800">Karachi pickup support</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">MarketLink focuses on simple market pickup, not delivery logistics.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">How we can help</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Keep the conversation as simple as market day.</h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-stone-500">Use the details below for common support questions, or open the AI assistant for quick help with products, markets and pickup information.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ["Pre-orders", "Questions about cart, quantities and pickup confirmations."],
                ["Farmer listings", "Help with products, weekly stock and stall information."],
                ["Market timings", "Find market days, hours and pickup-area references."],
              ].map(([title, text]) => (
                <div key={title} className="card p-4 transition hover:-translate-y-1 hover:border-leaf-200 hover:shadow-lg">
                  <h3 className="text-sm font-extrabold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-5 py-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-leaf-700">Karachi pickup area</p>
                <h3 className="mt-1 text-lg font-extrabold">Find a market near your plan</h3>
              </div>
              <Link to="/markets" className="text-xs font-extrabold text-navy-700 hover:text-leaf-700">View markets →</Link>
            </div>
            <iframe
              title="Karachi MarketLink pickup map"
              className="h-[320px] w-full"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=66.965%2C24.835%2C67.085%2C24.905&layer=mapnik&marker=24.8607%2C67.0011"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

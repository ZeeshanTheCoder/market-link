import { Link } from "react-router-dom";
import Logo from "./Logo";

const col = "text-[13px] text-navy-100/80 transition hover:translate-x-0.5 hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[1.2fr_.7fr_.7fr_.8fr_1.35fr]">
          <div>
            <Logo light />
            <p className="mt-3 max-w-sm text-sm leading-7 text-navy-100/80">
              MarketLink connects farmers-market growers with customers who want fresh produce, clear pickup times and a simpler market-day experience.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-leaf-200">
              <span>📍</span> Karachi market pickup
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[.2em] text-white">Explore</h3>
            <ul className="space-y-2">
              <li><Link className={col} to="/markets">Markets</Link></li>
              <li><Link className={col} to="/farmers">Farmers</Link></li>
              <li><Link className={col} to="/products">Products</Link></li>
              <li><Link className={col} to="/how-it-works">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[.2em] text-white">For farmers</h3>
            <ul className="space-y-2">
              <li><Link className={col} to="/register?role=farmer">Become a seller</Link></li>
              <li><Link className={col} to="/seller-guide">Seller guide</Link></li>
              <li><Link className={col} to="/assistant">Ask MarketLink AI</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[.2em] text-white">Support</h3>
            <ul className="space-y-2">
              <li><Link className={col} to="/about">About</Link></li>
              <li><Link className={col} to="/contact">Contact</Link></li>
              <li><Link className={col} to="/faq">FAQ</Link></li>
              <li><Link className={col} to="/login">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-black uppercase tracking-[.2em] text-white">MarketLink in Karachi</h3>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
              <iframe
                title="Karachi MarketLink map"
                className="h-40 w-full"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=66.965%2C24.835%2C67.085%2C24.905&layer=mapnik&marker=24.8607%2C67.0011"
              />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-navy-100/55">A visual pickup-area reference for Karachi markets.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-800/90 py-4 text-center text-xs text-navy-100/55">
        &copy; {new Date().getFullYear()} MarketLink · eGreen Basket
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

export function LogoMark({ className = "h-11 w-11" }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      <span className="absolute inset-1 rounded-2xl bg-leaf-100/80 blur-md transition duration-500 group-hover:scale-125" />
      <img
        src="/images/marketlink-logo-mark.png"
        alt="MarketLink"
        className="relative h-full w-full object-contain drop-shadow-[0_8px_18px_rgba(20,56,92,.18)] transition duration-500 group-hover:scale-105"
      />
    </span>
  );
}

export default function Logo({ light = false, tagline = true, to = "/" }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5"
      aria-label="MarketLink home"
    >
      <LogoMark className="h-11 w-11 sm:h-12 sm:w-12" />
      <span className="leading-tight">
        <span className="block text-[1.35rem] font-black tracking-[-0.035em] sm:text-2xl">
          <span className={light ? "text-white" : "text-navy-800"}>Market</span>
          <span className={light ? "text-leaf-200" : "text-leaf-500"}>Link</span>
        </span>
        {tagline && (
          <span className={`mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.15em] ${light ? "text-navy-100" : "text-navy-700/75"}`}>
            Where Farmers Meet Customers
          </span>
        )}
      </span>
    </Link>
  );
}

import Icon from "./Icons";

const hero = "/images/marketlink-hero-farmer-v3.webp";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:py-10">
      <aside className="relative hidden overflow-hidden rounded-[28px] lg:block">
        <img src={hero} alt="Farmer preparing fresh market produce" className="h-full min-h-[600px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/65 via-navy-900/25 to-leaf-700/25" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-extrabold backdrop-blur">🌿 FARM • MARKET • COMMUNITY</span>
          <h2 className="mt-4 max-w-md text-3xl font-black leading-tight text-white">Your local market day, brought a little closer.</h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/80">Shop fresh. Support growers. Reserve your pickup before you head to the market.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <Mini icon="sprout" text="Fresh produce" />
            <Mini icon="basket" text="Easy pickup" />
            <Mini icon="shield" text="Trusted flow" />
          </div>
        </div>
      </aside>

      <div className="flex items-center">
        <div className="w-full rounded-[28px] border border-stone-200 bg-white p-6 shadow-[0_20px_65px_rgba(20,56,92,.09)] sm:p-8">
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-6 text-stone-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-5 border-t border-stone-100 pt-4 text-center text-sm text-stone-600">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

function Mini({icon,text}){
  return <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur"><span className="grid h-8 w-8 place-items-center rounded-xl bg-white/15 text-white"><Icon name={icon} className="h-4 w-4" /></span><span className="text-xs font-bold text-white">{text}</span></div>;
}

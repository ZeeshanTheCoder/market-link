import Icon from "../common/Icons";

const nodes = [
  { icon: "store", x: 180, y: 70, label: "Market stalls" },
  { icon: "mapPin", x: 62, y: 148, label: "Locations" },
  { icon: "clock", x: 298, y: 146, label: "Pickup slots" },
  { icon: "sprout", x: 62, y: 262, label: "Fresh produce" },
];

const CENTER = { x: 180, y: 190 };

export default function OrbitIcons() {
  return (
    <div className="relative h-[360px] w-[360px]" aria-hidden="true">
      <svg viewBox="0 0 360 360" className="absolute inset-0 h-full w-full">
        {nodes.map((n) => (
          <line key={n.icon} x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} stroke="#b9c993" strokeWidth="1.2" />
        ))}
      </svg>
      {nodes.map((n) => (
        <span
          key={n.icon}
          title={n.label}
          className="absolute flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-leaf-200 bg-white/85 text-navy-700 shadow-sm"
          style={{ left: n.x, top: n.y }}
        >
          <Icon name={n.icon} className="h-8 w-8" />
        </span>
      ))}
      <span
        className="absolute flex h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-leaf-200 bg-white/90 text-leaf-700 shadow-md ring-8 ring-white/40"
        style={{ left: CENTER.x, top: CENTER.y }}
      >
        <Icon name="basket" className="h-14 w-14" strokeWidth={1.6} />
      </span>
    </div>
  );
}

const PRODUCE = ["#d9482b", "#e58a1f", "#62822a", "#d9482b", "#7a9a3a", "#e0a526", "#6b3f7a", "#e58a1f"];

function Crate({ x, y, seed = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={8 + i * 10.5} cy={i % 2 ? 4 : 6} r="7.2" fill={PRODUCE[(i + seed) % PRODUCE.length]} />
      ))}
      <rect x="0" y="8" width="70" height="30" rx="3" fill="#b58a55" />
      <path d="M0 18h70M0 28h70" stroke="#8a6a45" strokeWidth="1.5" />
    </g>
  );
}

// A farmers-market stall, drawn in a 300 x 260 box.
function Stall() {
  return (
    <g>
      <rect x="14" y="30" width="8" height="220" fill="#7a5a3a" />
      <rect x="278" y="30" width="8" height="220" fill="#7a5a3a" />
      <rect x="6" y="6" width="288" height="18" rx="4" fill="#43591c" />
      <text x="150" y="19.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="2">
        FARM FRESH
      </text>
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <rect x={10 + i * 31.1} y="24" width="31.1" height="40" fill={i % 2 ? "#fbf3df" : "#d9482b"} />
          <circle cx={10 + 15.55 + i * 31.1} cy="64" r="15.55" fill={i % 2 ? "#fbf3df" : "#d9482b"} />
        </g>
      ))}
      <rect x="0" y="170" width="300" height="14" rx="3" fill="#8a6a45" />
      <rect x="8" y="184" width="284" height="66" fill="#a4794b" />
      <path d="M8 206h284M8 228h284" stroke="#8a6a45" strokeWidth="2" />
      <Crate x="22" y="132" seed={0} />
      <Crate x="115" y="132" seed={2} />
      <Crate x="208" y="132" seed={4} />
      <path d="M60 78v26M150 78v26M240 78v26" stroke="#7a9a3a" strokeWidth="2" />
      <ellipse cx="60" cy="112" rx="14" ry="9" fill="#e0a526" />
      <ellipse cx="150" cy="112" rx="14" ry="9" fill="#62822a" />
      <ellipse cx="240" cy="112" rx="14" ry="9" fill="#e58a1f" />
    </g>
  );
}

function Trees({ y, colors = ["#3f6b2a", "#4d7c30"] }) {
  const xs = [30, 90, 170, 260, 340, 430, 520, 600, 700, 790, 860];
  return (
    <g>
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={y - 10 - (i % 3) * 6} r={26 + (i % 4) * 5} fill={colors[i % 2]} />
          <circle cx={x + 18} cy={y - 2} r={20} fill={colors[(i + 1) % 2]} />
        </g>
      ))}
    </g>
  );
}

export function FieldScene({ className = "" }) {
  const vx = 470;
  const vy = 290;
  const rows = Array.from({ length: 14 }, (_, i) => {
    const x1 = -700 + i * 150;
    return { key: i, points: `${vx},${vy} ${x1},540 ${x1 + 150},540`, fill: i % 2 ? "#5f9134" : "#7aa845" };
  });

  return (
    <svg viewBox="0 0 900 540" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="A sunny farm field with a market stall">
      <defs>
        <linearGradient id="skyField" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe6ee" />
          <stop offset="1" stopColor="#fbf1d8" />
        </linearGradient>
      </defs>
      <rect width="900" height="300" fill="url(#skyField)" />
      <circle cx="650" cy="110" r="95" fill="#fff6d6" opacity="0.35" />
      <circle cx="650" cy="110" r="55" fill="#fff6d6" opacity="0.8" />
      <path d="M0 275Q150 225 300 265T620 255T900 270V310H0z" fill="#a9c78a" />
      <Trees y={285} />
      <rect y="290" width="900" height="250" fill="#6c9a3a" />
      {rows.map((r) => (
        <polygon key={r.key} points={r.points} fill={r.fill} />
      ))}
      <g transform="translate(540 235) scale(0.95)">
        <Stall />
      </g>
    </svg>
  );
}

export function StallScene({ className = "" }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="A farmers market stall with fresh produce">
      <defs>
        <linearGradient id="skyStall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8ebf0" />
          <stop offset="1" stopColor="#f6f0dc" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#skyStall)" />
      <g opacity="0.9">
        <Trees y={330} colors={["#7a9a3a", "#8fae52"]} />
      </g>
      <rect y="360" width="800" height="240" fill="#b7cf8e" />
      <rect y="470" width="800" height="130" fill="#d9c9a3" />
      <g transform="translate(90 120) scale(2.1)">
        <Stall />
      </g>
      <g transform="translate(20 500)">
        <Crate x={0} y={0} seed={1} />
        <Crate x={80} y={6} seed={5} />
      </g>
      <g transform="translate(600 496)">
        <Crate x={0} y={0} seed={3} />
        <Crate x={80} y={6} seed={7} />
      </g>
    </svg>
  );
}

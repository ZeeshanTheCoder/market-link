import { useState } from "react";

// Read-only by default; pass onChange to make it an input.
export default function RatingStars({ value = 0, onChange, size = "h-5 w-5" }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="inline-flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <svg viewBox="0 0 24 24" className={`${size} ${n <= shown ? "text-amber-market" : "text-stone-300"}`} fill="currentColor" aria-hidden="true">
            <path d="M12 3l2.8 6 6.2.6-4.7 4.2 1.5 6.2L12 16.8 6.2 20l1.5-6.2L3 9.6 9.2 9z" />
          </svg>
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}

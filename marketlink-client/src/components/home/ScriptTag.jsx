// Handwritten tagline with underline swoosh (like the reference design)
export default function ScriptTag({ className = "", lines = ["Fresh Picks,", "Happy Neighbours"] }) {
  return (
    <div className={`-rotate-6 font-script text-navy-800 ${className}`}>
      {lines.map((l) => (
        <p key={l} className="text-3xl font-bold leading-[1.05] sm:text-4xl">
          {l}
        </p>
      ))}
      <svg viewBox="0 0 160 12" className="mt-1 h-3 w-40 text-leaf-700" aria-hidden="true">
        <path d="M2 9C40 3 100 3 158 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

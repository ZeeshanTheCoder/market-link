import Icon from "./Icons";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search..." }) {
  return (
    <form
      role="search"
      className="flex w-full items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <div className="relative flex-1">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="input pl-10"
        />
      </div>
      <button type="submit" className="btn-primary">
        Search
      </button>
    </form>
  );
}

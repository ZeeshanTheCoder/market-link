// Renders a labelled <input> by default. Pass children (with id=`field-${name}`) for select/textarea.
export default function FormField({ label, name, error, hint, children, className = "", ...inputProps }) {
  const id = `field-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-navy-800">
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input ${error ? "border-tomato" : ""}`}
          {...inputProps}
        />
      )}
      {hint && !error && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-tomato">
          {error}
        </p>
      )}
    </div>
  );
}

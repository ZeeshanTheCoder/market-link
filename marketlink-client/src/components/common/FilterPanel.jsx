import FormField from "./FormField";

export default function FilterPanel({ fields, values, onChange, onReset }) {
  return (
    <aside className="card space-y-4" aria-label="Filters">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">Filters</h2>
        <button type="button" onClick={onReset} className="text-sm font-semibold text-leaf-700 hover:underline">
          Reset
        </button>
      </div>
      {fields.map((f) => (
        <FormField key={f.name} label={f.label} name={f.name}>
          {f.type === "select" ? (
            <select id={`field-${f.name}`} className="input" value={values[f.name] ?? ""} onChange={(e) => onChange(f.name, e.target.value)}>
              <option value="">All</option>
              {(f.options || []).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`field-${f.name}`}
              type={f.type || "text"}
              className="input"
              value={values[f.name] ?? ""}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          )}
        </FormField>
      ))}
    </aside>
  );
}

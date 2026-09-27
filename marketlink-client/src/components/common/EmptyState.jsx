export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {message && <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

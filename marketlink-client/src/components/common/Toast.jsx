const styles = {
  success: "border-leaf-500 bg-leaf-50 text-leaf-800",
  error: "border-tomato bg-red-50 text-red-800",
  info: "border-navy-600 bg-navy-50 text-navy-800",
};

export default function ToastContainer({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border-l-4 px-4 py-3 text-sm shadow-lg ${styles[t.type]}`}
        >
          <span>{t.message}</span>
          <button type="button" onClick={() => onClose(t.id)} aria-label="Dismiss" className="font-bold opacity-60 hover:opacity-100">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

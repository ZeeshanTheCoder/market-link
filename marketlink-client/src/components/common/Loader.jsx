export default function Loader({ fullPage = false, label = "Loading..." }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-leaf-100 border-t-leaf-600" />
      <span className="text-sm text-stone-500">{label}</span>
    </div>
  );
  return fullPage ? (
    <div className="flex min-h-screen items-center justify-center bg-cream">{spinner}</div>
  ) : (
    <div className="flex justify-center py-12">{spinner}</div>
  );
}

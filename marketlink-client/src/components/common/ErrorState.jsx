export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
      <h3 className="text-lg font-bold text-tomato">Could not load this</h3>
      <p className="mt-2 text-sm text-stone-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-outline mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

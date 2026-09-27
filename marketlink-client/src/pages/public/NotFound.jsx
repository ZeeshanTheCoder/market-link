import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-6xl font-extrabold text-leaf-600">404</p>
      <h1 className="mt-3 text-2xl font-extrabold">Page not found</h1>
      <p className="mt-2 text-sm text-stone-500">The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Go to home</Link>
    </div>
  );
}

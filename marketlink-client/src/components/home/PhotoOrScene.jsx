import { useState } from "react";

// Shows a real photo from /public/images if it exists, otherwise falls back to the illustration.
export default function PhotoOrScene({ src, alt, Scene, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Scene className={className} />;
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

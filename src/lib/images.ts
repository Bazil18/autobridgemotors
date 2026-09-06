const PLACEHOLDER = "/__l5e/assets-v1/a2560a04-f5e5-4260-a78c-d3336922aac0/hero-car.jpg";

/** Resolve a stored image reference to a browser-usable URL. */
export function imageUrl(src?: string | null) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/api/public/vehicle-photo/${src}`;
}

export { PLACEHOLDER as fallbackImage };

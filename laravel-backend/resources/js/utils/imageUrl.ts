/**
 * Resolves an image path returned by the Laravel API into a usable URL.
 *
 * Since all Eloquent models now use Storage::disk('public')->url() in their
 * accessors, the API already returns fully-qualified absolute URLs
 * (e.g. "https://yourdomain.com/storage/images/profile.jpg").
 *
 * This utility is a thin safety net:
 *  - If the value is already a full URL → pass it through.
 *  - If the value is a relative path (legacy edge-case) → prefix with /storage/.
 *  - If null / undefined → return the fallback (defaults to empty string).
 */
export const getImageUrl = (
  path: string | null | undefined,
  fallback: string = "",
): string => {
  if (!path) return fallback;

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleaned = path.startsWith("/") ? path : `/${path}`;
  if (cleaned.startsWith("/storage/")) return cleaned;

  return `/storage${cleaned}`;
};

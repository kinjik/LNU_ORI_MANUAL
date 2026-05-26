/**
 * Resolves an image path returned by the Laravel API into a usable URL.
 *
 * The backend (Eloquent accessors) returns absolute URLs using APP_URL from
 * the server's .env file (e.g. "http://localhost/storage/images/profile.jpg").
 * On a production server where APP_URL is misconfigured, these URLs will have
 * the wrong host and return 404s in the browser.
 *
 * This utility handles that with a smart fallback strategy:
 *
 *  1. If path is null/undefined → return the fallback image.
 *  2. If path is a full URL (http/https) but the HOST is different from the
 *     current browser origin (e.g. it still says "localhost") → strip the
 *     wrong host and rebuild the URL using window.location.origin instead.
 *  3. If path is a full URL with the correct host → use it as-is.
 *  4. If path is a relative path (e.g. "images/profile.jpg") → prepend
 *     window.location.origin + "/storage/".
 */
export const getImageUrl = (
  path: string | null | undefined,
  fallback: string = "",
): string => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const backendUrl = new URL(path);
      const currentOrigin = window.location.origin; // e.g. "https://uni-server.edu"
      const currentHost = window.location.hostname;  // e.g. "uni-server.edu"

      if (backendUrl.hostname === currentHost) {
        return path;
      }

      return `${currentOrigin}${backendUrl.pathname}`;
    } catch {
    }
  }

  const cleaned = path.startsWith("/") ? path : `/${path}`;
  if (cleaned.startsWith("/storage/")) {
    return `${window.location.origin}${cleaned}`;
  }

  return `${window.location.origin}/storage${cleaned}`;
};


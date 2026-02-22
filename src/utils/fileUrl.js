import { API_URL } from "./constants";

export function toPublicUrl(path) {
  if (!path) return "";
  // already absolute
  if (/^https?:\/\//i.test(path)) return path;
  // ensure exactly one slash between base + path
  if (path.startsWith("/")) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
}

// src/utils/toPublicUrl.js
import { API_BASE_URL } from "./constants";

export function toPublicUrl(path) {
  if (!path) return "";

  // already absolute
  if (/^https?:\/\//i.test(path)) return path;

  // normalize Windows slashes
  let p = String(path).replaceAll("\\", "/");

  // If backend already returns "/files/..." just join with base
  if (p.startsWith("/files/")) {
    return `${API_BASE_URL}${p}`;
  }

  // If backend returns "uploads/..." -> remove "uploads/"
  if (p.startsWith("uploads/")) {
    p = p.replace(/^uploads\//, ""); // "products/xxx.jpg"
  }

  // If frontend passes "/files/uploads/..." -> also remove "/files/uploads/"
  if (p.startsWith("/files/uploads/")) {
    p = p.replace(/^\/files\/uploads\//, ""); // "products/xxx.jpg"
  }

  // Now p should be like: "products/xxx.jpg" or "payment_methods/khqr.jpg"
  if (p.startsWith("/")) p = p.slice(1);
  return `${API_BASE_URL}/files/${p}`;
}
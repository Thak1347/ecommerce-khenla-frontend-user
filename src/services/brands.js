// src/services/brands.js
import api from "./api";

export async function getBrands() {
  const res = await api.get("/brands/");
  return res.data;
}
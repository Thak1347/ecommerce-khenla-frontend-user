// src/components/ProductCard.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { toPublicUrl } from "../utils/toPublicUrl";

const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  // Localized name
  const name =
    product?.[`name_${i18n.language}`] || product?.name_en || product?.name || "";

  // ✅ Use backend stock_qty (your API uses stock_qty, not stock_quantity)
  const stockQty =
    typeof product?.stock_qty === "number"
      ? product.stock_qty
      : typeof product?.stock_quantity === "number"
      ? product.stock_quantity
      : undefined;

  // ✅ Build image URL via /files and normalize Windows slashes in helper
const filePath =
  product.images?.find((img) => img.is_main)?.file_path ||
  product.images?.[0]?.file_path;

const mainImage = filePath ? toPublicUrl(filePath) : "/placeholder.jpg";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.id) {
      toast.error("Invalid product");
      return;
    }

    if (stockQty === 0) {
      toast.error(t("product.outOfStock") || "Out of Stock");
      return;
    }

    addToCart(product, 1);

    toast.success(t("product.addedToCart") || "Added to cart!", {
      icon: "🛒",
      duration: 2000,
    });
  };

  const disabled = stockQty === 0;

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden h-48 bg-gray-50">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Your API doesn't include brand name by default; it returns brand_id */}
        <p className="text-gray-600 mb-3">
          {t('product.brand')}: {product.brand_name || product.brand_id || 'N/A'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${Number(product?.price_usd ?? product?.price ?? 0).toFixed(2)}
          </span>

          {stockQty !== undefined && (
            <span className={`text-sm ${stockQty > 0 ? "text-green-600" : "text-red-600"}`}>
              {stockQty > 0
                ? `${t("product.inStock") || "In stock"}: ${stockQty}`
                : t("product.outOfStock") || "Out of Stock"}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition
            flex items-center justify-center gap-2
            ${
              disabled
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-600 hover:bg-blue-700 text-white active:bg-blue-800"
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {disabled ? t("product.outOfStock") || "Out of Stock" : t("product.addToCart") || "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
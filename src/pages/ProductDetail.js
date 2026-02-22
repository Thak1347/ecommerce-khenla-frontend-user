// src/pages/ProductDetail.js
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/products";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { toPublicUrl } from "../utils/toPublicUrl";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setProduct(null);

    getProduct(id)
      .then((data) => {
        if (mounted) setProduct(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load product");
        if (mounted) setProduct(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  // ✅ Guard: never read product.* until product exists
  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  const name = product?.[`name_${i18n.language}`] || product?.name_en || product?.name || "";
  const description =
    product?.[`description_${i18n.language}`] || product?.description_en || product?.description || "";

  const stockQty =
    typeof product?.stock_qty === "number"
      ? product.stock_qty
      : typeof product?.stock_quantity === "number"
      ? product.stock_quantity
      : 0;

  // ✅ safe access with optional chaining
  const mainFilePath =
    product?.images?.find((img) => img?.is_main)?.file_path ||
    product?.images?.[0]?.file_path;

  // IMPORTANT: pass raw file_path to helper (it will convert uploads/... to /files/...)
  const mainImgUrl = mainFilePath ? toPublicUrl(mainFilePath) : "/placeholder.jpg";

  const handleAddToCart = () => {
    if (stockQty <= 0) {
      toast.error(t("product.outOfStock") || "Out of Stock");
      return;
    }
    const safeQty = Math.min(Math.max(qty || 1, 1), stockQty);
    addToCart(product, safeQty);
    toast.success(t("product.addedToCart") || "Added to cart!");
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={mainImgUrl}
            alt={name}
            className="w-full rounded-lg shadow bg-gray-50"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
        </div>

        {/* Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{name}</h1>

          <p className="text-2xl text-blue-600 mb-4">
            ${Number(product?.price_usd ?? 0).toFixed(2)}
          </p>

          <div className="mb-4">
            <span className="font-semibold">{t("product.category") || "Category"}:</span>{" "}
            {product?.category?.name_en || product?.category_id || "N/A"}
          </div>

          <div className="mb-4">
            <span className="font-semibold">{t("product.brand") || "Brand"}:</span>{" "}
            {product?.brand?.name || product?.brand_id || "N/A"}
          </div>

          <div className="mb-6">
            <span className="font-semibold">{t("product.description") || "Description"}:</span>
            <p className="mt-2 text-gray-700">{description || "-"}</p>
          </div>

          {stockQty > 0 ? (
            <>
              <div className="flex items-center mb-6">
                <label className="mr-4">Qty:</label>
                <input
                  type="number"
                  min="1"
                  max={stockQty}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
                  className="border rounded w-20 p-2 text-center"
                />
                <span className="ml-4 text-gray-600">{stockQty} available</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition"
              >
                {t("product.addToCart") || "Add to Cart"}
              </button>
            </>
          ) : (
            <p className="text-red-600 font-semibold">{t("product.outOfStock") || "Out of Stock"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
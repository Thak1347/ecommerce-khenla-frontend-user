// src/pages/ProductCatalog.js
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/products";
import { getBrands } from "../services/brands";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../hooks/useDebounce";

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  // Get filter values from URL
  const categoryId = searchParams.get("category") || "";
  const brandId = searchParams.get("brand") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "";
  const search = searchParams.get("search") || "";

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts({
            category_id: categoryId || undefined,
            brand_id: brandId || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            sort_by: sort || undefined,
            search: debouncedSearch || undefined,
          }),
          getCategories(),
          getBrands(),
        ]);

        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setBrands(brandsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, brandId, minPrice, maxPrice, sort, debouncedSearch]);

  // ✅ brand_id -> brand name map
  const brandMap = useMemo(() => {
    const map = {};
    (brands || []).forEach((b) => {
      map[b.id] = b.name;
    });
    return map;
  }, [brands]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  // Check if any filters are active
  const hasActiveFilters = categoryId || brandId || minPrice || maxPrice || search;

  // ✅ add brand_name to each product for ProductCard
  const productsWithBrandName = useMemo(() => {
    return (products || []).map((p) => ({
      ...p,
      brand_name: brandMap[p.brand_id] || "N/A",
    }));
  }, [products, brandMap]);

  const findCategoryName = (idStr) => {
    const idNum = parseInt(idStr, 10);
    const cat = (categories || []).find((c) => c.id === idNum);
    return cat?.[`name_${i18n.language}`] || cat?.name_en || "N/A";
  };

  const findBrandName = (idStr) => {
    const idNum = parseInt(idStr, 10);
    return brandMap[idNum] || "N/A";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("nav.products")}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t("filters.title")}</h2>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">
                  {t("filters.clearFilters")}
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.search")}
              </label>
              <input
                type="text"
                placeholder={t("filters.search")}
                value={search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("product.category")}
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t("filters.allCategories")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat?.[`name_${i18n.language}`] || cat?.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("product.brand")}
              </label>
              <select
                value={brandId}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t("filters.allBrands")}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.priceRange")}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t("filters.minPrice")}
                  value={minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  min="0"
                  className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder={t("filters.maxPrice")}
                  value={maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  min="0"
                  className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("filters.sortBy")}
              </label>
              <select
                value={sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{t("filters.sortBy")}</option>
                <option value="price_asc">{t("filters.priceLowToHigh")}</option>
                <option value="price_desc">{t("filters.priceHighToLow")}</option>
                <option value="name_asc">{t("filters.nameAToZ")}</option>
                <option value="name_desc">{t("filters.nameZToA")}</option>
              </select>
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">{t("filters.activeFilters")}:</p>
                <div className="flex flex-wrap gap-2">
                  {categoryId && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {t("product.category")}: {findCategoryName(categoryId)}
                    </span>
                  )}
                  {brandId && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {t("product.brand")}: {findBrandName(brandId)}
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Price: {minPrice && `$${minPrice}`} {minPrice && maxPrice && " - "}{" "}
                      {maxPrice && `$${maxPrice}`}
                    </span>
                  )}
                  {search && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Search: "{search}"
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="md:w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">{!loading && `${products.length} ${t("filters.productsFound")}`}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : productsWithBrandName.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t("filters.noProducts")}</h3>
              <p className="mt-1 text-sm text-gray-500">{t("filters.tryAdjusting")}</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  {t("filters.clearFilters")}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsWithBrandName.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
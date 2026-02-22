//src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/products';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch featured products (limit 8)
    getProducts({ limit: 8 }).then(data => setFeaturedProducts(data));
    getCategories().then(data => setCategories(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('home.hero')}</h1>
        <p className="text-xl text-gray-600">Computer products at your fingertips</p>
        <Link to="/products" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.categories')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="border rounded-lg p-4 text-center hover:shadow-lg transition"
            >
              {cat.name_en}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('home.featured')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
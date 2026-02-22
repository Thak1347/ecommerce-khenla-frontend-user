//src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">KHENLA</Link>
            <div className="hidden md:block ml-10">
              <Link to="/" className="px-3 py-2 rounded hover:bg-gray-700">{t('nav.home')}</Link>
              <Link to="/products" className="px-3 py-2 rounded hover:bg-gray-700">{t('nav.products')}</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link to="/orders" className="px-3 py-2">{t('nav.orders')}</Link>
                <button onClick={handleLogout} className="px-3 py-2 bg-red-600 rounded">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2">{t('nav.login')}</Link>
                <Link to="/register" className="px-3 py-2 bg-blue-600 rounded">{t('nav.register')}</Link>
              </>
            )}
            <LanguageSelector />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700">{t('nav.home')}</Link>
          <Link to="/products" className="block px-3 py-2 rounded hover:bg-gray-700">{t('nav.products')}</Link>
          <Link to="/cart" className="block px-3 py-2 rounded hover:bg-gray-700">Cart ({itemCount})</Link>
          {user ? (
            <>
              <Link to="/orders" className="block px-3 py-2 rounded hover:bg-gray-700">{t('nav.orders')}</Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 bg-red-600 rounded">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded hover:bg-gray-700">{t('nav.login')}</Link>
              <Link to="/register" className="block px-3 py-2 rounded hover:bg-gray-700">{t('nav.register')}</Link>
            </>
          )}
          <LanguageSelector />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
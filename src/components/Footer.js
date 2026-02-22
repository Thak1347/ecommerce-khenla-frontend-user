//src/components/Footer.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>&copy; 2025 KHENLA. {t('footer.rights')}</p>
    </footer>
  );
};

export default Footer;
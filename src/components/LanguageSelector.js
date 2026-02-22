//src/components/LanguageSelector.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="bg-gray-700 text-white rounded px-2 py-1"
    >
      <option value="en">English</option>
      <option value="km">ភាសាខ្មែរ</option>
      <option value="lo">ລາວ</option>
    </select>
  );
};

export default LanguageSelector;
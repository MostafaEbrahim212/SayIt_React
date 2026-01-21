import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar }
};

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Set document direction based on language
const setDirection = (lang) => {
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

setDirection(savedLanguage);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  setDirection(lng);
});

export default i18n;

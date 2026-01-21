import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 transition font-semibold text-sm"
      aria-label="Switch Language"
    >
      {i18n.language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Sidebar({ isOpen, onClose, onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 h-screen w-64 bg-slate-900 shadow-lg z-40 transition-transform duration-300 ${
          document.documentElement.dir === 'rtl' ? 'right-0' : 'left-0'
        } ${isOpen ? 'translate-x-0' : (document.documentElement.dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')} lg:hidden`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100">{t('common.menu')}</h2>
          <button
            onClick={onClose}
            className="text-slate-100 hover:text-amber-400 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col p-4 space-y-2">
          {/* Logo */}
          <div className="flex items-center gap-3 p-3 mb-4 border-b border-slate-800 pb-4">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
            <div>
              <p className="font-semibold text-slate-100">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Messages */}
          <button
            onClick={() => handleNavigation("/messages")}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('header.messages')}
          </button>

          {/* Anonymous */}
          <button
            onClick={() => handleNavigation("/anonymous")}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('header.anonymous')}
          </button>

          {/* Profile */}
          <button
            onClick={() => handleNavigation(`/profile/${user.id}`)}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('common.profile')}
          </button>

          {/* Edit Profile */}
          <button
            onClick={() => handleNavigation("/edit-profile")}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('header.editProfile')}
          </button>

          {/* Notifications */}
          <button
            onClick={() => handleNavigation("/notifications")}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('header.notifications')}
          </button>

          {/* Users */}
          <button
            onClick={() => handleNavigation("/users")}
            className="w-full text-left px-4 py-2 text-slate-100 hover:bg-slate-800 rounded-lg transition font-semibold"
          >
            {t('common.users')}
          </button>

          {/* Divider */}
          <div className="border-t border-slate-800 my-4"></div>

          {/* Language Switcher */}
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-slate-100 font-semibold text-sm">{t('common.language')}</span>
            <LanguageSwitcher />
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition font-semibold mt-auto"
          >
            {t('common.logout')}
          </button>
        </nav>
      </div>
    </>
  );
}

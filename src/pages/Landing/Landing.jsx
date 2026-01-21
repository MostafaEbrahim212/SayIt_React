import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, logout: authLogout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      const { logout } = await import("../../services/authService");
      await logout();
      authLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };
  return (
    <div className="min-h-screen bg-primary flex flex-col">

      {/* Header */}
      <header className="w-full bg-secondary shadow-md">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 md:h-10 object-contain"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 md:px-4 py-2 text-sm md:text-base font-semibold text-dark
                             hover:text-accent transition"
                >
                  {t('dashboard.title')}
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 md:px-5 py-2 text-sm md:text-base rounded-lg bg-red-500 text-white font-semibold
                             hover:bg-red-600 transition"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 md:px-4 py-2 text-sm md:text-base font-semibold text-dark
                             hover:text-accent transition"
                >
                  {t('auth.login')}
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="px-3 md:px-5 py-2 text-sm md:text-base rounded-lg bg-accent text-dark font-semibold
                             hover:bg-dark hover:text-secondary transition"
                >
                  {t('auth.register')}
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center text-center px-4 md:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark leading-tight break-words">
          {t('landing.buildConnectGrow.build')} {t('landing.buildConnectGrow.connect')} <span className="text-accent">{t('landing.buildConnectGrow.grow')}</span>
        </h1>
      </main>

    </div>
  );
}

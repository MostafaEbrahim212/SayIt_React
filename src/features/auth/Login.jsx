import React, { useState } from "react";
import { login } from "../../services/authService";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isAuthenticated, loading, login: setAuthLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      
      if (data.data?.token) {
        setAuthLogin(data.data.token, data.data.user);
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>{t('common.loading')}</p>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary font-sans px-4 py-8">
      <div className="absolute top-3 md:top-4 right-3 md:right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md p-6 md:p-8 bg-secondary rounded-xl shadow-lg">
        <img src="/logo.png" alt="SayIt Logo" className="mx-auto mb-4 md:mb-6 w-32 md:w-40 h-16 md:h-20" />
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4 md:mb-6 text-center">{t('auth.login')}</h2>

        {error && <p className="text-red-500 mb-4 text-sm md:text-base text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <input
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-accent focus:border-accent focus:ring-1 focus:ring-accent px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-primary text-dark placeholder-dark transition"
          />
          <input
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-accent focus:border-accent focus:ring-1 focus:ring-accent px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-primary text-dark placeholder-dark transition"
          />

          <button
            type="submit"
            className="w-full bg-accent hover:bg-dark text-dark hover:text-secondary font-semibold py-2 md:py-3 text-sm md:text-base rounded-lg transition-colors"
          >
            {t('auth.login')}
          </button>
        </form>

        <p className="text-center text-dark mt-4 text-xs md:text-sm">
          {t('auth.noAccount')}{" "}
          <Link
            to="/register"
            className="text-accent font-semibold cursor-pointer hover:underline"
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}

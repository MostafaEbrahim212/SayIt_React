import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { register } from "../../services/authService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
        const result = await register({ name, email, password });
        if (result) {
            navigate("/login");
        }
    } catch (err) {
      setError(err.message);
    }
  };

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
        <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4 md:mb-6 text-center">{t('auth.register')}</h2>

        {error && <p className="text-red-500 mb-4 text-sm md:text-base text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <input
            type="text"
            placeholder={t('auth.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-accent focus:border-accent focus:ring-1 focus:ring-accent px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg bg-primary text-dark placeholder-dark transition"
          />
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
            {t('auth.register')}
          </button>
        </form>

        <p className="text-center text-dark mt-4 text-xs md:text-sm">
          {t('auth.haveAccount')}{" "}
          <Link
            to="/login"
            className="text-accent font-semibold cursor-pointer hover:underline"
          >
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}

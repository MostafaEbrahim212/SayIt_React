import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import Header from "../../components/Header";
import { useAuth } from "../../hooks/useAuth";
import Footer from "../../components/Footer";
import SocketDebug from "../../components/SocketDebug";
import { useEffect, useState } from "react";
import API from "../../services/axiosInstance";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { logout: authLogout, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState([
    { title: "dashboard.followers", value: 0, color: "bg-blue-500" },
    { title: "dashboard.following", value: 0, color: "bg-green-500" },
    { title: "dashboard.messagesSent", value: 0, color: "bg-purple-500" },
    { title: "dashboard.anonymousSent", value: 0, color: "bg-pink-500" },
    { title: "dashboard.messagesReceived", value: 0, color: "bg-yellow-500" },
    { title: "dashboard.anonymousReceived", value: 0, color: "bg-orange-500" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/messages/stats");
        const data = res?.data?.data || res?.data;
        setStats([
          { title: "dashboard.followers", value: data.followers || 0, color: "bg-blue-500" },
          { title: "dashboard.following", value: data.following || 0, color: "bg-green-500" },
          { title: "dashboard.messagesSent", value: data.messagesSent || 0, color: "bg-purple-500" },
          { title: "dashboard.anonymousSent", value: data.anonymousSent || 0, color: "bg-pink-500" },
          { title: "dashboard.messagesReceived", value: data.messagesReceived || 0, color: "bg-yellow-500" },
          { title: "dashboard.anonymousReceived", value: data.anonymousReceived || 0, color: "bg-orange-500" },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header title="Dashboard" onLogout={handleLogout} />

       {/* Main content */}
        <main className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8">
          <h2 className="text-dark text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            {t('dashboard.welcome', { name: user?.name || t('common.loading') })}
          </h2>

          {loading && (
            <div className="text-center text-dark text-sm md:text-lg mb-6 animate-pulse">
              {t('dashboard.loadingStats')}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
            <button
              onClick={() => navigate("/messages")}
              className="px-3 md:px-6 py-2 md:py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm md:text-base font-semibold transition"
            >
              💬 {t('header.messages')}
            </button>
            <button
              onClick={() => navigate("/anonymous")}
              className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              🔒 {t('dashboard.anonymousInbox')}
            </button>
            <button
              onClick={() => navigate("/sent-anonymous")}
              className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition"
            >
              📤 {t('dashboard.sentAnonymous')}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition"
            >
              👤 {t('dashboard.myProfile')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-lg ${stat.color} text-white flex flex-col justify-between`}
              >
                <p className="text-sm uppercase font-semibold">{t(stat.title)}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
          </div>
        </main>
        {/* <div className="container mx-auto px-8">
          <SocketDebug />
        </div> */}
      <Footer />
    </div>
  );
}

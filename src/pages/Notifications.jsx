import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.type === "message" || notification.type === "reply") {
      navigate(`/messages?userId=${notification.from}`);
    } else {
      navigate(`/profile/${notification.from}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">{t('notifications.title')}</h1>
              {notifications.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {notifications.filter(n => !n.isRead).length} {t('notifications.unread')}
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="bg-slate-800 rounded-lg p-8 text-center shadow-sm border border-slate-700">
              <p className="text-slate-300 text-lg animate-pulse">{t('notifications.loading')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-8 text-center shadow-sm border border-slate-700">
                  <p className="text-slate-300 text-lg">{t('notifications.noNotifications')}</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification._id || index}
                    onClick={() => handleNotificationClick(notification)}
                    className={`rounded-lg p-4 hover:shadow-lg cursor-pointer transition border ${
                      notification.isRead
                        ? "bg-slate-800 border-slate-700"
                        : "bg-amber-100/10 border-amber-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className={`font-semibold text-lg ${
                          notification.isRead ? "text-slate-200" : "text-slate-50"
                        }`}>
                          {notification.text || notification.msg || "Notification"}
                        </p>
                        {notification.type && (
                          <p className="text-slate-400 text-sm mt-2">Type: {notification.type}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></span>
                        )}
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {notification.createdAt
                            ? new Date(notification.createdAt).toLocaleString()
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

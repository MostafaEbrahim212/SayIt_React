import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import API from "../services/axiosInstance";
import { debounce } from "lodash";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import UserAvatar from "./UserAvatar";
import { usePresence } from "../context/PresenceContext";
import Sidebar from "./Sidebar";

export default function Header({ onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadNotifications, unreadCount, markAllAsRead } = useNotifications();
  const { t } = useTranslation();
  const { getPresence } = usePresence();

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = document.documentElement.dir === "rtl";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const myPresence = getPresence(user?.id || user?._id) || {};

  const meIsOnline = myPresence.isOnline ?? user?.isOnline ?? false;
  const meLastSeen = myPresence.lastSeen ?? user?.lastSeen ?? null;


  /* ================= SEARCH ================= */

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await API.get(`/search-profiles?query=${query}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  /* ================= UI ================= */

  return (
    <header className="bg-slate-900 shadow-md  border-b border-slate-800 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-4">

        {/* Hamburger Menu - Show on small screens only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="sm:hidden text-slate-100 hover:text-amber-400 transition text-2xl flex-shrink-0"
        >
          ☰
        </button>

        {/* Logo - Hide on small screens */}  
        <div
          className="hidden sm:flex items-center gap-2 md:gap-3 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          <img src="/logo.png" alt="Logo" className="h-8 md:h-10 object-contain" />
        </div>

        {/* Search - Hide on very small screens, make responsive */}
        <div className="hidden sm:flex flex-1 max-w-md md:max-w-xl mx-2 md:mx-6 relative">
          <input
            type="text"
            placeholder={t('header.searchUsers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 md:px-4 py-2 text-sm md:text-base rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {searchQuery && (
            <div className={`absolute top-full bg-slate-800 border
                            border-slate-700 rounded-lg shadow-lg z-50 mt-1
                            max-h-60 overflow-y-auto w-full sm:w-80 md:w-96 ${
              document.documentElement.dir === 'rtl' ? 'right-0' : 'left-0'
            }`}>
              {searchLoading ? (
                <div className="p-3 text-center text-xs md:text-sm text-slate-400">{t('common.loading')}</div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs md:text-sm text-slate-400">{t('header.noNotifications')}</div>
              ) : (
                searchResults.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => {
                      navigate(`/profile/${u.id}`);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="p-3 hover:bg-slate-700 cursor-pointer flex items-center gap-3"
                  >
                    <UserAvatar
                      name={u.name}
                      avatar={u.avatar}
                      isOnline={(getPresence(u.id) || {}).isOnline ?? u.isOnline}
                      lastSeen={(getPresence(u.id) || {}).lastSeen ?? u.lastSeen}
                      size="sm"
                      showStatusText={false}
                    />
                    <div>
                      <p className="font-semibold text-slate-100">{u.name}</p>
                      <p className="text-slate-400 text-sm">{u.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div
          className={`flex items-center ${isRTL ? "gap-2 sm:gap-4 md:gap-7" : "gap-1 sm:gap-3 md:gap-6"} relative`}
          style={{ marginInlineStart: "auto" }}
        >

          {/* Messages - Hide label on mobile */}
          <button
            onClick={() => navigate("/messages")}
            className="hidden sm:block text-sm md:text-base text-slate-100 hover:text-amber-400 transition font-semibold px-2 md:px-0"
          >
            {t('header.messages')}
          </button>

          {/* Anonymous - Hide label on mobile */}
          <button
            onClick={() => navigate("/anonymous")}
            className="hidden sm:block text-sm md:text-base text-slate-100 hover:text-amber-400 transition font-semibold px-2 md:px-0"
          >
            {t('header.anonymous')}
          </button>

          {/* Language Switcher - Moved here */}
          <LanguageSwitcher />

          {/* Notifications */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setOpenNotifications(!openNotifications);
                setOpenProfile(false);
                }}
                className="relative text-slate-100 hover:text-amber-400 transition text-lg md:text-xl p-1 hover:bg-slate-800 rounded-lg"
                >
                🔔
                {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs
                    bg-red-500 text-white rounded-full px-1 h-5 w-5 flex items-center justify-center">
                  {unreadCount} 
                </span>
                )}
                </button>

                {openNotifications && (
                <div className={`absolute mt-2 w-72 sm:w-80 md:w-96 bg-slate-800 rounded-lg shadow-lg z-50 overflow-hidden border border-slate-700 ${
                  document.documentElement.dir === 'rtl' ? 'left-0' : 'right-0'
                }`}>
                <div className="p-3 font-semibold border-b border-slate-700 flex items-center justify-between text-slate-100">
                  <span>{t('header.notifications')}</span>
                  {unreadCount > 0 && (
                  <button
                  onClick={markAllAsRead}
                  className="text-xs bg-amber-400 text-slate-900 px-2 py-1 rounded
                    hover:bg-amber-300 transition"
                  >
                  {t('header.markAllRead')}
                  </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                  <p className="p-3 text-slate-400 text-center">
                  {t('header.noNotifications')}
                  </p>
                  ) : (
                  unreadNotifications.map((n, i) => (
                    
                  <div
                  key={i}
                  onClick={() => {
                    console.log(n);
                    // Route based on notification type
                    if (n.type === "follow") {
                      navigate(`/profile/${n.from}`);
                    } else if (n.type === "message" && n.text?.toLowerCase().includes("anonymous")) {
                      navigate("/anonymous");
                    } else if (n.type === "message" || n.type === "reply") {
                      navigate(`/messages?userId=${n.from}`);
                    } else {
                      navigate(`/profile/${n.from}`);
                    }
                    setOpenNotifications(false);
                  }}
                  className="p-3 border-b border-slate-700 hover:bg-slate-700 text-sm cursor-pointer"
                  >
                  <p className="font-semibold text-slate-100">{n.text || n.msg || "Notification"}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}
                  </p>
                  </div>
                  ))
                  )}
                </div>

                <div className="p-3 border-t border-slate-700 text-center">
                  <button
                    onClick={() => {
                      navigate("/notifications");
                      setOpenNotifications(false);
                    }}
                    className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition"
                  >
                    {t('header.seeAll')}
                  </button>
                </div>
                </div>
                )}
                </div>

                {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2"
            >
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                isOnline={meIsOnline}
                lastSeen={meLastSeen}
                size="sm"
                showStatusText={false}
              />
            </button>

            {openProfile && (
              <div className={`absolute mt-2 w-48 sm:w-56 bg-slate-800 rounded-lg shadow-lg z-50 border border-slate-700 ${
                document.documentElement.dir === 'rtl' ? 'left-0' : 'right-0'
              }`}>
                <button
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-100"
                >
                  {t('common.profile')}
                </button>

                <button
                  onClick={() => navigate("/edit-profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-100"
                >
                  {t('header.editProfile')}
                </button>

                <div className="border-t border-slate-700 my-1"></div>

                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2
                             text-red-400 hover:bg-slate-700"
                >
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
    </header>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import API from "../../services/axiosInstance";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../components/UserAvatar";
import { usePresence } from "../../context/PresenceContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faUniversity, faMapMarkerAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getPresence } = usePresence();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const presence = getPresence(profile?.id || user?.id) || {};
  const isOnline = presence.isOnline ?? profile?.isOnline ?? user?.isOnline ?? false;
  const lastSeen = presence.lastSeen ?? profile?.lastSeen ?? user?.lastSeen ?? null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          API.get("/profile"),
          API.get("/messages/stats")
        ]);
        console.log("Profile Response:", profileRes.data);
        const profileData = profileRes.data.data || profileRes.data;
        setProfile(profileData);
        
        const statsData = statsRes?.data?.data || statsRes?.data;
        setStats({
          followers: statsData?.followers || 0,
          following: statsData?.following || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <p className="text-dark text-xl animate-pulse">{t('profile.loadingProfile')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Header title="Profile" onLogout={handleLogout} />

      <main className="flex-1 container mx-auto p-6">
        <h2 className="text-3xl font-bold text-dark mb-8 text-center">
          {t('dashboard.welcome', { name: profile?.name || user?.name || t('common.loading') })}
        </h2>

        <div className="bg-secondary rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <UserAvatar
              name={profile?.name || user?.name}
              avatar={profile?.avatar || user?.avatar}
              isOnline={isOnline}
              lastSeen={lastSeen}
              size="lg"
              showStatusText
            />

            {/* Details */}
            <div className="flex-1 space-y-3">
              <p className="text-dark font-semibold text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} /> {t('profile.name')}: {profile?.name || user?.name}
              </p>
              <p className="text-dark font-semibold text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} /> {t('profile.email')}: {profile?.email || user?.email}
              </p>
              <div className="flex gap-6 mt-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{stats.followers}</p>
                  <p className="text-sm text-dark">{t('profile.followers')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{stats.following}</p>
                  <p className="text-sm text-dark">{t('profile.following')}</p>
                </div>
              </div>
              {profile?.bio && (
                <p className="text-dark flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} /> {t('profile.bio')}: {profile.bio}
                </p>
              )}
              {profile?.university && (
                <p className="text-dark flex items-center gap-2">
                  <FontAwesomeIcon icon={faUniversity} /> {t('profile.university')}: {profile.university}
                </p>
              )}
              {profile?.address && (
                <p className="text-dark flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} /> {t('profile.address')}: {profile.address}
                </p>
              )}

              {/* Social Links */}
              <div className="flex gap-4 mt-3">
                {profile?.socialLinks?.facebook && (
                  <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile?.socialLinks?.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile?.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="text-blue-700 text-2xl hover:scale-110 transition" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/edit-profile")}
              className="px-6 py-2 rounded-lg bg-accent text-dark font-semibold hover:bg-dark hover:text-secondary flex items-center gap-2 transition"
            >
              <FontAwesomeIcon icon={faEdit} /> {t('profile.editProfile')}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

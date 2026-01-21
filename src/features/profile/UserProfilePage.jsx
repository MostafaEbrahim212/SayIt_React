import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserPlus, FaUserMinus, FaBan, FaEdit } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

import API from "../../services/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header";
import UserAvatar from "../../components/UserAvatar";
import { usePresence } from "../../context/PresenceContext";

export default function UserProfilePage() {
  const { id } = useParams(); // user id
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { getPresence } = usePresence();
  const [profile, setProfile] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sending, setSending] = useState(false);

  const [followed, setFollowed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [relation, setRelation] = useState(null);
  const [accessDenied, setAccessDenied] = useState("");
  const [sharedMessages, setSharedMessages] = useState([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const presence = getPresence(id) || {};
  const isOnline = presence.isOnline ?? profile?.isOnline ?? false;
  const lastSeen = presence.lastSeen ?? profile?.lastSeen ?? null;

  // ================= Fetch Profile & Relation =================
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const profileRes = await API.get(`/profile/user/${id}`);
        console.log("User Profile Response:", profileRes.data);
        const profileData = profileRes?.data?.data || profileRes?.data;

        if (!profileData) return;

        setProfile(profileData);
        setAccessDenied("");

        // Fetch stats only for own profile
        if (user.id === id) {
          const statsRes = await API.get("/messages/stats");
          const statsData = statsRes?.data?.data || statsRes?.data;
          setStats({
            followers: statsData?.followers || 0,
            following: statsData?.following || 0
          });
        }

        const relRes = await API.get(
          `/relations/${user.id}?to=${id}`
        );

        const relData = relRes?.data?.data;

        if (relData) {
          setFollowed(!!relData.followed);
          setBlocked(!!relData.blocked);
          setRelation(relData.relations?.[0] || null);
        }

        // Fetch shared messages for this profile
        const sharedRes = await API.get(`/messages/shared/${id}`);
        setSharedMessages(sharedRes?.data?.data || []);
      } catch (err) {
        console.error("Fetch profile error:", err);
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        if (status === 403) {
          setAccessDenied(message || "You cannot view this profile.");
        }
      }
    };

    fetchData();
  }, [id, user?.id]);

  // ================= Messages =================
  const handleSendMessage = async () => {
    if (!messageText.trim() || !profile) return;

    setSending(true);
    try {
      await API.post("/messages", {
        receiverId: id,
        content: messageText,
        isAnonymous,
      });

      setMessageText("");
      setIsAnonymous(false);
    } catch (err) {
      console.error("Send message error:", err);
      const status = err?.response?.status;
      if (status === 403) {
        setAccessDenied(err?.response?.data?.message || "Action forbidden.");
      }
    } finally {
      setSending(false);
    }
  };

  // ================= Relations =================
  const handleFollow = async () => {
    if (!profile) return;

    try {
      if (followed) {
        // Unfollow - delete the relation
        if (relation?.id) {
          await API.delete(`/relation/${relation.id}`);
          setFollowed(false);
        }
      } else {
        // Follow
        const res = await API.post("/relation", {
          toUserId: id,
          type: "follow",
        });
        const relationDoc = res?.data?.data;
        setFollowed(true);
        setRelation(relationDoc || relation);
      }
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleBlock = async () => {
    if (!profile) return;

    try {
      console.log(blocked,relation?.id)
      if (blocked) {
        // Unblock - delete the relation
        if (relation?.id) {
          await API.delete(`/relation/${relation.id}`);
          setBlocked(false);
        }
      } else {
        // Block
        const res = await API.post("/relation", {
          toUserId: id,
          type: "block",
        });
        const relationDoc = res?.data?.data;
        setBlocked(true);
        setRelation(relationDoc || relation);
      }
    } catch (err) {
      console.error("Block error:", err);
    }
  };
  
  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  // ================= UI =================
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        {accessDenied}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        {t('profile.profileNotFound')}
      </div>
    );
  }

  return (
    <>
      <Header title="Dashboard" onLogout={handleLogout} />
      <div className="min-h-screen bg-slate-950 px-4 md:px-6 py-6 md:py-8 flex flex-col">

      {/* Profile Card */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 max-w-3xl mx-auto mb-6 border border-slate-700 w-full">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <UserAvatar
            name={profile.name}
            avatar={profile.avatar}
            isOnline={isOnline}
            lastSeen={lastSeen}
            size="lg"
            showStatusText
          />

          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-slate-50">{profile.name}</h2>
            <p className="text-slate-300 text-sm md:text-base">{profile.email}</p>
            {profile.bio && <p className="mt-2 text-slate-200 text-sm md:text-base">{profile.bio}</p>}
            {profile.university && <p className="text-slate-300 text-xs md:text-sm">{t('profile.university')}: {profile.university}</p>}
            {profile.address && <p className="text-slate-300 text-xs md:text-sm">{t('profile.address')}: {profile.address}</p>}

            {/* Show stats for own profile */}
            {user?.id === id && (
              <div className="flex gap-6 mt-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{stats.followers}</p>
                  <p className="text-sm text-slate-400">{t('profile.followers')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">{stats.following}</p>
                  <p className="text-sm text-slate-400">{t('profile.following')}</p>
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks && (
              <div className="flex gap-4 mt-3">
                {profile.socialLinks.facebook && (
                  <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faFacebook} className="text-blue-600 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-2xl hover:scale-110 transition" />
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="text-blue-700 text-2xl hover:scale-110 transition" />
                  </a>
                )}
              </div>
            )}

            {/* Show Follow/Block buttons only if viewing someone else's profile */}
            {user?.id !== id && (
              <div className="mt-4 flex gap-3">
                {/* Show Follow button only if NOT blocked */}
                {!blocked && (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
                      followed
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {followed ? <FaUserMinus /> : <FaUserPlus />}
                    {followed ? t('profile.unfollow') : t('profile.follow')}
                  </button>
                )}

                <button
                  onClick={handleBlock}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                >
                  <FaBan /> {blocked ? t('profile.unblock') : t('profile.block')}
                </button>
              </div>
            )}

            {/* Show Edit Profile button only if viewing own profile */}
            {user?.id === id && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                >
                  <FaEdit /> {t('profile.editProfile')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Form - Only show if viewing someone else's profile */}
      {user?.id !== id && (
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto mb-6 border border-slate-700">
          <h3 className="text-xl font-bold text-slate-50 mb-3">{t('profile.sendMessage')}</h3>

          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-3 bg-slate-900 text-slate-100"
            placeholder={t('profile.writeMessage')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-slate-200">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={() => setIsAnonymous((v) => !v)}
              />
              {t('profile.sendAsAnonymous')}
            </label>

            <button
              onClick={handleSendMessage}
              disabled={sending || blocked}
              className="px-6 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold transition disabled:opacity-50"
            >
              {blocked ? t('profile.blocked') : sending ? t('anonymous.sending') : t('common.send')}
            </button>
          </div>
        </div>
      )}

      {/* Shared Messages Section */}
      {sharedMessages.length > 0 && (
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto mb-6 border border-slate-700">
          <h3 className="text-xl font-bold text-slate-50 mb-4">{t('profile.sharedMessages')}</h3>
          <div className="space-y-4">
            {sharedMessages
              .filter((msg) => !msg.replyTo) // Only show root messages, not replies
              .map((msg) => {
              // Find reply to this message
              const reply = sharedMessages.find(m => m.replyTo === msg.id || m.replyTo?.id === msg.id);
              return (
                <div
                  key={msg.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
                      {t('profile.anonymousMessage')}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.sharedAt || msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-100 whitespace-pre-wrap mb-3">{msg.content}</p>
                  
                  {/* Show reply if exists */}
                  {reply && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-start gap-2">
                        <UserAvatar
                          name={profile.name}
                          avatar={profile.avatar}
                          isOnline={isOnline}
                          lastSeen={lastSeen}
                          size="sm"
                          showStatusText={false}
                        />
                        <div className="flex-1">
                          <div className="text-xs text-slate-400 mb-1">{t('anonymous.yourReply')}</div>
                          <p className="text-slate-200 text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
}

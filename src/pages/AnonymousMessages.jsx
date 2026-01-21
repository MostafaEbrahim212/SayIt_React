import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import socket from "../services/socket";
import { useTranslation } from "react-i18next";
import UserAvatar from "../components/UserAvatar";
import { usePresence } from "../context/PresenceContext";

export default function AnonymousMessages() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const { getPresence } = usePresence();
  const userPresence = getPresence(user?.id || user?._id) || {};
  const isOnline = userPresence.isOnline ?? user?.isOnline ?? false;
  const lastSeen = userPresence.lastSeen ?? user?.lastSeen ?? null;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [sending, setSending] = useState(null);

  useEffect(() => {
    fetchAnonymousMessages();
  }, []);

  // Listen for new messages/replies via socket
  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("🔔 New anonymous message/reply:", data);
      // Refresh the list to show new anonymous messages or replies
      fetchAnonymousMessages();
    };

    socket.on("message.new", handleNewMessage);

    return () => {
      socket.off("message.new", handleNewMessage);
    };
  }, []);

  const fetchAnonymousMessages = async () => {
    setLoading(true);
    try {
      // Fetch all messages where current user is receiver and message is anonymous
      const res = await API.get(`/messages/anonymous`);
      setMessages(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch anonymous messages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async (message) => {
    const desired = !message.isSharedToProfile;
    try {
      await API.put(`/messages/${message.id}/share`, { share: desired });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, isSharedToProfile: desired } : m
        )
      );
    } catch (err) {
      console.error("Failed to toggle share", err);
    }
  };

  const handleReply = async (messageId) => {
    const content = replyText[messageId]?.trim();
    if (!content) return;

    setSending(messageId);
    try {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;

      await API.post("/messages", {
        receiverId: msg.sender.id || msg.sender,
        content,
        isAnonymous: false,
        replyTo: messageId,
      });

      // Refresh to show the reply
      await fetchAnonymousMessages();
      setReplyText((prev) => ({ ...prev, [messageId]: "" }));
    } catch (err) {
      console.error("Failed to send reply", err);
    } finally {
      setSending(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Find reply for a message
  const getReply = (messageId) => {
    return messages.find((m) => m.replyTo?.id === messageId || m.replyTo === messageId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onLogout={handleLogout} />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-50">{t('anonymous.title')}</h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            {t('anonymous.description')}
          </p>
        </div>

        {loading ? (
          <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
            <p className="text-slate-300 text-sm md:text-lg animate-pulse">{t('common.loading')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
            <p className="text-slate-300 text-sm md:text-lg">{t('anonymous.noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages
              .filter((m) => m.isAnonymous && !m.replyTo) // Only root anonymous messages
              .map((msg) => {
                const reply = getReply(msg.id);
                const hasReplied = !!reply;

                return (
                  <div
                    key={msg.id}
                    className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
                  >
                    {/* Anonymous Message */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-amber-300">
                            {t('anonymous.anonymous')}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleShare(msg)}
                          className={`text-xs px-3 py-1 rounded border transition ${
                            msg.isSharedToProfile
                              ? "border-amber-400 text-amber-300 bg-amber-500/10"
                              : "border-slate-600 text-slate-200 hover:border-amber-300"
                          }`}
                        >
                          {msg.isSharedToProfile ? t('anonymous.shared') : t('anonymous.shareToProfile')}
                        </button>
                      </div>

                      <p className="text-slate-100 text-lg whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Reply Section */}
                    {hasReplied ? (
                      <div className="bg-slate-900/50 border-t border-slate-700 p-5">
                        <div className="flex items-start gap-3">
                          <UserAvatar
                            name={user?.name}
                            avatar={user?.avatar}
                            isOnline={isOnline}
                            lastSeen={lastSeen}
                            size="sm"
                            showStatusText={false}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-50 mb-1">{t('anonymous.yourReply')}</div>
                            <p className="text-slate-200 whitespace-pre-wrap">{reply.content}</p>
                            <span className="text-xs text-slate-400 mt-2 block">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border-t border-slate-700 p-5">
                        <div className="font-semibold text-slate-200 mb-3">{t('anonymous.reply')}</div>
                        <textarea
                          value={replyText[msg.id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))
                          }
                          rows={3}
                          className="w-full p-3 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-950 text-slate-100 mb-2"
                          placeholder={t('anonymous.writeReply')}
                        />
                        <button
                          onClick={() => handleReply(msg.id)}
                          disabled={!replyText[msg.id]?.trim() || sending === msg.id}
                          className="px-4 py-2 rounded bg-amber-400 text-slate-900 font-semibold disabled:opacity-50 hover:bg-amber-300 transition"
                        >
                          {sending === msg.id ? t('anonymous.sending') : t('anonymous.sendReply')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}

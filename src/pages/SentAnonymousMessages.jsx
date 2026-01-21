import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageService from "../api/services/MessageService";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import socket from "../services/socket";
import { useTranslation } from "react-i18next";
import UserAvatar from "../components/UserAvatar";
import { usePresence } from "../context/PresenceContext";

export default function SentAnonymousMessages() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { getPresence } = usePresence();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSentAnonymousMessages();
  }, []);

  // Listen for new replies via socket
  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("🔔 New reply to anonymous message:", data);
      fetchSentAnonymousMessages();
    };

    socket.on("message.new", handleNewMessage);

    return () => {
      socket.off("message.new", handleNewMessage);
    };
  }, []);

  const fetchSentAnonymousMessages = async () => {
    setLoading(true);
    try {
      const res = await MessageService.getSentAnonymousMessages();
      setMessages(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch sent anonymous messages", err);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-slate-50">{t('sentAnonymousMessages.title')}</h1>
          <p className="text-slate-400 mt-2">
            {t('sentAnonymousMessages.description')}
          </p>
        </div>

        {loading ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-300 text-lg animate-pulse">{t('sentAnonymousMessages.loading')}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <p className="text-slate-300 text-lg">{t('sentAnonymousMessages.noMessages')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages
              .filter((m) => m.isAnonymous && !m.replyTo) // Only root messages sent by user
              .map((msg) => {
                const reply = getReply(msg.id);
                const replySenderId = reply?.sender?._id || reply?.sender?.id || reply?.senderId;
                const replyPresence = getPresence(replySenderId) || {};
                const replyIsOnline = replyPresence.isOnline ?? reply?.sender?.isOnline ?? false;
                const replyLastSeen = replyPresence.lastSeen ?? reply?.sender?.lastSeen ?? null;

                return (
                  <div
                    key={msg.id}
                    className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
                  >
                    {/* Your Anonymous Message */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-amber-300">
                            {t('sentAnonymousMessages.youAnonymous')}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-200">
                          {t('sentAnonymousMessages.toUser')} {msg.receiver?.name || "Unknown"}
                        </span>
                      </div>

                      <p className="text-slate-100 text-lg whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Reply Section */}
                    {reply ? (
                      <div className="bg-slate-900/50 border-t border-slate-700 p-5">
                        <div className="flex items-start gap-3">
                          <UserAvatar
                            name={reply.sender?.name || "?"}
                            avatar={reply.sender?.avatar}
                            isOnline={replyIsOnline}
                            lastSeen={replyLastSeen}
                            size="sm"
                            showStatusText={false}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-50 mb-1">
                              {reply.sender?.name}'s {t('sentAnonymousMessages.reply')}
                            </div>
                            <p className="text-slate-200 whitespace-pre-wrap">{reply.content}</p>
                            <span className="text-xs text-slate-400 mt-2 block">
                              {new Date(reply.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border-t border-slate-700 p-5">
                        <p className="text-slate-400 text-sm">
                          {t('sentAnonymousMessages.waitingForReply')}
                        </p>
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

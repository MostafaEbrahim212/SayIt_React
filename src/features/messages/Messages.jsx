import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/axiosInstance";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header";
import socket from "../../services/socket";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../components/UserAvatar";
import { usePresence } from "../../context/PresenceContext";

const Messages = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { getPresence } = usePresence();
  const userId = user?.id;
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [thread, setThread] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sendText, setSendText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [targetProfile, setTargetProfile] = useState(null);

  const messagesEndRef = useRef(null);

  /* ================= FETCH CONVERSATIONS ================= */
  const fetchConversations = async () => {
    setLoadingConvs(true);
    try {
      const res = await API.get("/conversations");
      setConversations(res?.data?.data || []);
    } catch (err) {
      setErrorMsg("Failed to load conversations");
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  /* ================= HANDLE QUERY PARAM ================= */
  useEffect(() => {
    if (!targetUserId || !conversations.length) return;

    const found = conversations.find((c) =>
      (c.participants || []).some((p) => p._id === targetUserId)
    );

    if (found) {
      setActiveConvId(found._id);
      setTargetProfile(null);
    } else if (targetUserId !== userId) {
      API.get(`/profile/user/${targetUserId}`)
        .then((res) => setTargetProfile(res?.data?.data))
        .catch(() =>
          setTargetProfile({ id: targetUserId, name: "Unknown User" })
        );
      setActiveConvId(null);
    }
  }, [targetUserId, conversations, userId]);

  /* ================= LOAD THREAD ================= */
  useEffect(() => {
    if (!activeConvId) return;

    const loadThread = async () => {
      setLoadingThread(true);
      try {
        const res = await API.get(
          `/conversations/${activeConvId}/messages`
        );
        const allMessages = res?.data?.data || [];
        // Exclude anonymous roots and replies; these belong to anonymous inbox, not conversations
        const visible = allMessages.filter((m) => !m.isAnonymous && !m.parentIsAnonymous);
        setThread(visible);
      } catch {
        setErrorMsg("Failed to load messages");
      } finally {
        setLoadingThread(false);
      }
    };

    loadThread();
  }, [activeConvId]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.conversation === activeConvId) {
        if (data.isAnonymous || data.parentIsAnonymous) return; // keep anon out of conversations
        setThread((prev) =>
          prev.find((m) => m._id === data._id) ? prev : [...prev, data]
        );
      }
      fetchConversations();
    };

    socket.on("message.new", handleNewMessage);
    return () => socket.off("message.new", handleNewMessage);
  }, [activeConvId]);

  /* ================= MEMOS ================= */
  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConvId),
    [conversations, activeConvId]
  );

  const visibleConversations = useMemo(
    () => conversations.filter((c) => {
      const last = c.lastMessage;
      if (!last) return true;
      return !last.isAnonymous && !last.parentIsAnonymous;
    }),
    [conversations]
  );

  const otherUser = useMemo(() => {
    if (activeConversation) {
      return activeConversation.participants.find(
        (p) => p._id !== userId
      );
    }
    if (targetProfile) {
      return {
        _id: targetProfile.id,
        name: targetProfile.name,
        email: targetProfile.email,
        avatar: targetProfile.avatar,
        isOnline: targetProfile.isOnline,
        lastSeen: targetProfile.lastSeen,
      };
    }
    return null;
  }, [activeConversation, targetProfile, userId]);

  const otherPresence = otherUser ? (getPresence(otherUser._id) || {}) : {};
  const otherIsOnline = otherPresence.isOnline ?? otherUser?.isOnline ?? false;
  const otherLastSeen = otherPresence.lastSeen ?? otherUser?.lastSeen ?? null;

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!sendText.trim() || !otherUser) return;

    try {
      const res = await API.post("/messages", {
        receiverId: otherUser._id,
        content: sendText,
        isAnonymous: false, // conversations are never anonymous
      });

      setThread((prev) => [...prev, res.data.data]);
      setSendText("");
      fetchConversations();
    } catch {
      setErrorMsg("Failed to send message");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        {/* ================= SIDEBAR ================= */}
        <aside className=" lg:block border-r border-slate-800 bg-slate-900 overflow-hidden flex flex-col">
          <div className="p-3 md:p-4 font-bold text-base md:text-lg border-b border-slate-800">{t('messages.conversations')}</div>

          <div className="overflow-y-auto divide-y divide-slate-800 flex-1">
            {loadingConvs ? (
              <div className="p-3 md:p-4 text-xs md:text-sm text-slate-400">{t('common.loading')}</div>
            ) : conversations.length === 0 ? (
              <div className="p-3 md:p-4 text-xs md:text-sm text-slate-400">
                {t('messages.noConversations')}
              </div>
            ) : (
              visibleConversations.map((conv) => {
                const other = conv.participants.find(
                  (p) => p._id !== userId
                );
                const presence = getPresence(other?._id) || {};
                const isOnline = presence.isOnline ?? other?.isOnline ?? false;
                const lastSeen = presence.lastSeen ?? other?.lastSeen ?? null;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConvId(conv._id)}
                    className={`w-full text-left p-4 transition ${
                      conv._id === activeConvId
                        ? "bg-slate-800 border-l-2 border-amber-400"
                        : "hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={other?.name || "Unknown"}
                        avatar={other?.avatar}
                        isOnline={isOnline}
                        lastSeen={lastSeen}
                        size="sm"
                        showStatusText={false}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {other?.name || "Unknown"}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-400" : "bg-slate-600"
                          }`}></span>
                          <span>{isOnline ? "Online" : "Offline"}</span>
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {conv.lastMessage?.content}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ================= CHAT ================= */}
        <main className="lg:col-span-2 flex flex-col bg-slate-900 overflow-hidden " style={{maxHeight: "calc(100vh - 70px)"}}>
          {/* HEADER */}
          <div className="p-3 md:p-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {otherUser ? (
                <>
                  <UserAvatar
                    name={otherUser?.name}
                    avatar={otherUser?.avatar}
                    isOnline={otherIsOnline}
                    lastSeen={otherLastSeen}
                    size="sm"
                    showStatusText={false}
                  />
                  <div>
                    <div className="font-semibold text-lg">
                      {otherUser?.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        otherIsOnline ? "bg-green-400" : "bg-slate-600"
                      }`}></span>
                      <span>
                        {otherIsOnline
                          ? "Online"
                          : otherLastSeen
                            ? `Last seen ${new Date(otherLastSeen).toLocaleTimeString()}`
                            : "Offline"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="font-semibold text-lg">
                  {t('messages.selectConversation')}
                </div>
              )}
            </div>
            {errorMsg && (
              <div className="text-sm text-red-400 mt-1">{errorMsg}</div>
            )}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 md:py-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900" style={{minHeight:"calc(100vh - 200px)"}}>
            <div className="flex flex-col gap-2 md:gap-3">
              {loadingThread ? (
                <div className="text-xs md:text-sm text-slate-400">
                  {t('messages.loadingMessages')}
                </div>
              ) : thread.length === 0 ? (
                <div className="text-xs md:text-sm text-slate-400">
                  {t('messages.noMessages')}
                </div>
              ) : (
                thread.map((msg) => {
                  const isMine = msg.sender?._id === userId;
                  const replyTo = msg.replyTo;
                  const replySenderId = replyTo?.sender?._id
                    || replyTo?.sender?.id
                    || replyTo?.sender
                    || replyTo?.senderId
                    || replyTo?.from
                    || replyTo?.userId;
                  // Backend now sets parentIsAnonymous; fall back to payload flags if missing
                  const parentIsAnon = msg?.parentIsAnonymous === true
                    ? true
                    : (replyTo?.isAnonymous || replyTo?.isAnon || replyTo?.anonymous || replyTo?.is_anonymous);
                  const replyFromMe = replyTo && replySenderId === userId;
                  // Only the original anon sender can see the quoted content; others get masked
                  const canShowReplyContent = parentIsAnon ? replyFromMe : true;

                  return (
                    <div
                      key={msg._id}
                      className={`relative w-fit max-w-[75%] md:max-w-[65%] p-4 text-sm border shadow-lg break-words ${
                        isMine
                          ? "ml-auto bg-amber-500/15 border-amber-400/60 rounded-2xl rounded-br-sm"
                          : "mr-auto bg-slate-800 border-slate-700 rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-xs text-slate-400">
                        <span className="font-semibold text-slate-100">
                          {isMine ? "You" : msg.sender?.name}
                        </span>
                        {msg.isAnonymous && isMine && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-700 text-amber-300 text-[10px]">
                            Anon
                          </span>
                        )}
                        <span className="ml-auto text-[10px]">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                      {replyTo && (
                        <div className={`mb-3 rounded-xl border px-3 py-2 text-xs ${
                          msg.parentIsAnonymous
                            ? "bg-slate-800/80 border-amber-400/60 text-amber-100"
                            : "bg-slate-800/70 border-slate-700 text-slate-200"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[11px]">
                              {msg.parentIsAnonymous && replyFromMe
                                ? t('messages.replyToYourAnonymous')
                                : parentIsAnon
                                  ? t('messages.replyToAnonymous')
                                  : t('messages.replyingTo')}
                            </span>
                            {msg.parentIsAnonymous && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[10px] text-amber-200">
                                {t('anonymous.anonymous')}
                              </span>
                            )}
                          </div>
                          <div className="italic text-[12px] leading-snug max-h-16 overflow-hidden">
                            {canShowReplyContent
                              ? (replyTo.content || replyTo.text || replyTo.message || "")
                              : t('messages.anonymousMessage')}
                          </div>
                        </div>
                      )}

                      <div className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-3 mb-2">
              <button
                onClick={handleSend}
                disabled={!sendText.trim()}
                className="ml-auto px-5 py-2 rounded-full bg-amber-400 text-slate-900 font-semibold disabled:opacity-50"
              >
                {t('common.send')}
              </button>
            </div>

            <textarea
              value={sendText}
              onChange={(e) => setSendText(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder={t('messages.typeMessage')}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;

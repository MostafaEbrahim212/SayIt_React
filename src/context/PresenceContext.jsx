import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import socket from "../services/socket";
import { useAuth } from "../hooks/useAuth";

const PresenceContext = createContext(null);

export const PresenceProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [presence, setPresence] = useState({});
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      setPresence({});
      return;
    }

    const applySnapshot = (list = []) => {
      const next = {};
      list.forEach((item) => {
        if (!item?.userId) return;
        next[item.userId] = {
          isOnline: !!item.isOnline,
          lastSeen: item.lastSeen || null,
        };
      });
      setPresence(next);
    };

    const handleUpdate = (payload) => {
      if (!payload?.userId) return;
      setPresence((prev) => ({
        ...prev,
        [payload.userId]: {
          isOnline: !!payload.isOnline,
          lastSeen: payload.lastSeen || prev[payload.userId]?.lastSeen || null,
        },
      }));
    };

    const requestSnapshot = () => {
      if (socket.connected) {
        socket.emit("presence:request");
      }
    };

    socket.on("presence:state", applySnapshot);
    socket.on("presence:update", handleUpdate);
    socket.on("connect", requestSnapshot);

    requestSnapshot();

    return () => {
      socket.off("presence:state", applySnapshot);
      socket.off("presence:update", handleUpdate);
      socket.off("connect", requestSnapshot);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setPresence({});
    }
  }, [isAuthenticated, userId]);

  const getPresence = useCallback(
    (id) => presence[id],
    [presence]
  );

  return (
    <PresenceContext.Provider value={{ presence, getPresence }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => {
  const ctx = useContext(PresenceContext);
  if (!ctx) {
    throw new Error("usePresence must be used within PresenceProvider");
  }
  return ctx;
};

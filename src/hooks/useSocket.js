import { useEffect, useState } from "react";
import socket from "../services/socket";
import { useAuth } from "../hooks/useAuth";

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(socket.connected);
  const [notifications, setNotifications] = useState([]);
  const userId = user?._id || user?.id;

  // Setup notification listener (once on mount)
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("🔔 New notification:", data);
      setNotifications((prev) => [data, ...prev]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  // Setup connection lifecycle
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping socket connection");
      return;
    }

    // Pass token on connect
    const token = localStorage.getItem("token");
    socket.auth = { token: token || "" };

    const onConnect = () => {
      console.log("✓ Socket connected:", socket.id);
      setConnected(true);
      if (userId) {
        console.log("Emitting join for userId:", userId);
        socket.emit("join", userId);
      }
    };

    const onDisconnect = () => {
      console.log("✗ Socket disconnected");
      setConnected(false);
    };

    const onConnectError = (err) => {
      console.error("✗ Socket connect_error:", err?.message || err);
      setConnected(false);
    };

    const onReconnect = () => {
      console.log("🔄 Socket reconnecting...");
    };

    // Attach listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnecting", onReconnect);

    // Connect if not already connected
    if (!socket.connected) {
      console.log("Attempting to connect...");
      socket.connect();
    } else {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnecting", onReconnect);
      if (userId) {
        socket.emit("leave", userId);
      }
    };
  }, [isAuthenticated, userId]);

  const send = (event, payload, ack) => {
    if (!socket.connected) {
      console.warn("Socket not connected, cannot send:", event);
      return false;
    }
    socket.emit(event, payload, ack);
    return true;
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return { connected, notifications, send, clearNotifications };
};

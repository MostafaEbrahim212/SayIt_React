import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import API from "../services/axiosInstance";
import { useNotification } from "../hooks/useNotification";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { notifications: socketNotifications, clearNotifications } = useSocket();
  const { notify } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const seenIdsRef = useRef(new Set());

  // Fetch notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
          // Silently fail if user is not authenticated
          if (err?.response?.status === 401) {
            console.log("User not authenticated, skipping notifications");
          } else {
            console.error("Failed to fetch notifications:", err);
          }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Merge socket notifications with fetched ones
  useEffect(() => {
    if (socketNotifications && socketNotifications.length > 0) {
      setNotifications((prev) => {
        // Add new socket notifications to the top (avoid duplicates)
        const newNotifications = socketNotifications.filter(
          (sn) => !prev.find((pn) => pn._id === sn._id)
        );

        // Show on-screen toasts for brand-new items
        newNotifications.forEach((sn) => {
          const notifyId = sn._id || sn.id;
          if (notifyId && seenIdsRef.current.has(notifyId)) return;
          if (notifyId) seenIdsRef.current.add(notifyId);

          notify({
            id: notifyId || Date.now(),
            type: sn.type || "info",
            title: sn.title || "تنبيه جديد",
            message: sn.message || sn.content || sn.text || "لديك إشعار جديد",
            duration: 6000,
          });
        });
        return [...newNotifications, ...prev];
      });
    }
  }, [socketNotifications, notify]);

  // Get unread notifications only
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      clearNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const value = {
    notifications,
    unreadNotifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearNotifications,
    loading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

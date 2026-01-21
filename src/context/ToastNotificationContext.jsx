import { createContext, useState, useCallback } from "react";

export const ToastNotificationContext = createContext();

export const ToastNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = notification.id || Date.now();

    setNotifications((prev) => [...prev, { ...notification, id }]);

    if (notification.duration > 0) {
      setTimeout(() => removeNotification(id), notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <ToastNotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </ToastNotificationContext.Provider>
  );
};

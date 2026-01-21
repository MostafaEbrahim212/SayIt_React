import { createContext, useState, useCallback } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    ({
      id = Date.now(),
      type = "info", // info, success, error, warning
      title = "",
      message = "",
      duration = 5000, // 0 means don't auto-close
      onClick = null,
      actions = [], // array of { label, onClick }
    }) => {
      const newNotification = {
        id,
        type,
        title,
        message,
        duration,
        onClick,
        actions,
        createdAt: Date.now(),
      };

      console.log("Adding notification:", newNotification); // للتشخيص

      setNotifications((prev) => {
        const updated = [...prev, newNotification];
        console.log("Notifications state updated:", updated); // للتشخيص
        return updated;
      });

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

import { useContext } from "react";
import { NotificationContext } from "../context/NotificationSystemContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }

  return {
    notify: context.addNotification,
    success: (title, message, options = {}) =>
      context.addNotification({
        type: "success",
        title,
        message,
        duration: 4000,
        ...options,
      }),
    error: (title, message, options = {}) =>
      context.addNotification({
        type: "error",
        title,
        message,
        duration: 6000,
        ...options,
      }),
    warning: (title, message, options = {}) =>
      context.addNotification({
        type: "warning",
        title,
        message,
        duration: 5000,
        ...options,
      }),
    info: (title, message, options = {}) =>
      context.addNotification({
        type: "info",
        title,
        message,
        duration: 4000,
        ...options,
      }),
    remove: context.removeNotification,
    clearAll: context.clearAll,
  };
};

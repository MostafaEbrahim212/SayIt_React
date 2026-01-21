import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationSystemContext";
import Notification from "./Notification";

export default function NotificationContainer() {
  const context = useContext(NotificationContext);
  const navigate = useNavigate();

  const { notifications, removeNotification } = context || { notifications: [], removeNotification: () => {} };

  useEffect(() => {
    console.log("🔔 NotificationContainer: notifications changed!", notifications);
  }, [notifications]);

  if (!context) {
    console.error("NotificationContext not found!");
    return null;
  }

  return createPortal(
    <div 
      className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3"
      style={{ pointerEvents: 'auto' }}
    >
      {notifications && notifications.length > 0 && notifications.map((notification) => {
        console.log("Rendering notification:", notification);
        const handleClick = () => {
          const type = notification.type;
          const from = notification.from?._id
            || notification.from
            || notification.userId
            || notification.user
            || notification.senderId
            || notification.sender
            || notification.ownerId;
          const text = (notification.text || notification.msg || notification.message || "").toLowerCase();

          let target = "/notifications";

          if (type === "follow" && from) {
            target = `/profile/${from}`;
          } else if (type === "message" && text.includes("anonymous")) {
            target = "/anonymous";
          } else if ((type === "message" || type === "reply") && from) {
            target = `/messages?userId=${from}`;
          } else if (from) {
            target = `/profile/${from}`;
          }

          console.log("Toast click navigation →", target, { type, from, text });
          navigate(target);
          removeNotification(notification.id);
        };

        return (
          <Notification
            key={notification.id}
            {...notification}
            onClick={handleClick}
            onClose={removeNotification}
          />
        );
      })}
    </div>,
    document.body
  );
}

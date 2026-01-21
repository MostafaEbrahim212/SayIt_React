import React from "react";

const sizeStyles = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-24 h-24 text-3xl",
};

const statusText = (isOnline, lastSeen) => {
  if (isOnline) return "Online";
  if (lastSeen) {
    try {
      return `Last seen ${new Date(lastSeen).toLocaleString()}`;
    } catch (e) {
      return "Offline";
    }
  }
  return "Offline";
};

export default function UserAvatar({
  name = "User",
  avatar = "",
  isOnline = false,
  lastSeen = null,
  size = "md",
  showStatusText = true,
  align = "center",
}) {
  const initials = (name || "U").trim().charAt(0).toUpperCase();
  const boxSize = sizeStyles[size] || sizeStyles.md;
  const dotColor = isOnline ? "bg-green-400" : "bg-slate-500";
  const alignClass = align === "start" ? "items-start" : align === "end" ? "items-end" : "items-center";

  return (
    <div className={`flex flex-col ${alignClass} gap-2`}>
      <div
        className={`relative rounded-full overflow-hidden bg-amber-500 text-slate-900 font-bold flex items-center justify-center ${boxSize}`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        ) : (
          initials
        )}

        <span
          className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${dotColor} ${
            isOnline ? "animate-pulse" : ""
          }`}
        ></span>
      </div>

      {showStatusText && (
        <div className="flex items-center gap-2 text-xs text-slate-200">
          <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`}></span>
          <span className="text-slate-300">{statusText(isOnline, lastSeen)}</span>
        </div>
      )}
    </div>
  );
}

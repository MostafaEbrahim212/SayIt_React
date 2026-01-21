// src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white px-4 py-3 rounded shadow-lg animate-slide-in`}>
      {message}
    </div>
  );
}

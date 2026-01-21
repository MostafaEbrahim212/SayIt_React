import { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000); // يختفي بعد 3 ثواني
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
      {toast && (
        <div className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg transition-all duration-300
          ${toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-accent border-t-dark rounded-full animate-spin mb-4"></div>
        {/* Loading Text */}
        <p className="text-dark text-lg font-semibold animate-pulse">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

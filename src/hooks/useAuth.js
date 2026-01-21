import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Set token in axios headers
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Verify token is valid
        const response = await API.get("/auth/profile");
        setIsAuthenticated(true);
        setUser(response.data.data);
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        delete API.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

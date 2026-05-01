/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

import api from "../../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("tenantDesk_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const saveSession = (payload) => {
    if (payload?.token) {
      localStorage.setItem("tenantDesk_token", payload.token);
    }

    if (payload?.user) {
      localStorage.setItem("tenantDesk_user", JSON.stringify(payload.user));
      setUser(payload.user);
    }
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    saveSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("tenantDesk_token");

    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const { data } = await api.get("/auth/get-me");
      saveSession({ user: data.user });
      return data.user;
    } catch {
      logout();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("tenantDesk_token");
    localStorage.removeItem("tenantDesk_user");
    setUser(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

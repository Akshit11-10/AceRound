import { useState, useEffect, createContext, useContext } from "react";
import { authApi } from "../services/authApi";

export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, ask the backend if we have a valid session.
  // The auth token lives in an httpOnly cookie set by the server —
  // it is never stored in localStorage, so it can't be read or
  // tampered with by client-side JavaScript.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await authApi.me();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (name, email) => {
    const data = await authApi.updateProfile(name, email);
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (currentPassword, newPassword) => authApi.changePassword(currentPassword, newPassword);

  const deleteAccount = async (password) => {
    await authApi.deleteAccount(password);
    setUser(null);
  };

  return { user, loading, login, register, logout, updateProfile, changePassword, deleteAccount };
}

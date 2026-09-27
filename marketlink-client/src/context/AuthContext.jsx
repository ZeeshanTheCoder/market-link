import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, registerUser } from "../api/authApi";
import { TOKEN_KEY } from "../utils/constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setFarmerProfile(null);
  }, []);

  const applySession = useCallback(({ token, user: u, farmerProfile: fp }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    setFarmerProfile(fp || null);
  }, []);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ data }) => {
        setUser(data.user);
        setFarmerProfile(data.farmerProfile || null);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // Axios fires this on any 401
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setFarmerProfile(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { data } = await loginUser(credentials);
      applySession(data);
      return data.user;
    },
    [applySession]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await registerUser(payload);
      applySession(data);
      return data.user;
    },
    [applySession]
  );

  const refreshUser = useCallback(async () => {
    const { data } = await getMe();
    setUser(data.user);
    setFarmerProfile(data.farmerProfile || null);
  }, []);

  const value = useMemo(
    () => ({ user, farmerProfile, loading, login, register, logout: clearSession, refreshUser }),
    [user, farmerProfile, loading, login, register, clearSession, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import * as authServices from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const checkAuth = useCallback(async () => {
    try {
      const me = await authServices.getCurrentUser();
      setUser(me);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    await authServices.login(credentials);
    await checkAuth();
  };

  const logout = async () => {
    await authServices.logout();
    setUser(null);
    setStatus("unauthenticated");
  };
  console.log("AUTH STATE:", { user, status });

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

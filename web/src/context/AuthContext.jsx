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
  console.log("AuthProvider rendered");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [emailAuth, setEmailAuth] = useState(null);

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
    console.log("Fetching Auth Config...");
    authServices
      .getAuthConfig()
      .then((cfg) => {
        console.log("AUTH CONFIG:", cfg);
        setEmailAuth(Boolean(cfg?.emailAuth));
      })
      .catch((err) => {
        console.error("Failed to load auth config:", err);
        setEmailAuth(false);
      });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (emailAuth == null) return null;

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
    <AuthContext.Provider value={{ user, status, emailAuth, login, logout }}>
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

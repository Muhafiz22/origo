import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function EmailAuthRoute({ children }) {
  const emailAuth = useAuth();
  return emailAuth ? children : <Navigate to="/login" replace />;
}

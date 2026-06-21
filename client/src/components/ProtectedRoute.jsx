import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import PageLoader2 from "../pages/PageLoader2";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (!auth) {
    return null;
  }

  const { user, loading } = auth;

  if (loading) {
    return <PageLoader2 />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

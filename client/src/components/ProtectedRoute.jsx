import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";
import PageLoader from "./PageLoader";

export default function ProtectedRoute({
  children,
}) {
  const auth =
    useAuth();

  if (!auth) {
    return null;
  }

  const {
    user,
    loading,
  } = auth;

  if (loading) {
    return (
      <PageLoader
        text="Checking session..."
        minHeight="100vh"
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
      />
    );
  }

  return children;
}

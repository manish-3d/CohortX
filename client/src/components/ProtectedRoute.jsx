import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

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
      <h2>
        Loading...
      </h2>
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
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function Navbar() {
  const navigate =
    useNavigate();

  const auth =
    useAuth();

  if (!auth) {
    return null;
  }

  const {
    user,
    setUser,
  } = auth;

  async function handleLogout() {
    try {
      await api.post(
        "/auth/logout"
      );

      setUser(
        null
      );

      navigate(
        "/login"
      );

    } catch {
      alert(
        "Logout failed"
      );
    }
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent:
          "space-between",

        padding:
          "20px",

        borderBottom:
          "1px solid #ddd",
      }}
    >
      <Link to="/feed">
        CohortX
      </Link>

      <div
        style={{
          display:
            "flex",

          gap:
            "20px",
        }}
      >
        <Link to="/create">
          Create
        </Link>

        <Link to="/explore">
          Explore
        </Link>

        <Link to="/search">
          Discover
        </Link>

        <Link to="/profile/edit">
          Edit
        </Link>

        {user && (
          <Link
            to={`/profile/${user.username}`}
          >
            {user.username}
          </Link>
        )}

        <button
          onClick={
            handleLogout
          }
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
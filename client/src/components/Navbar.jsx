import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import api from "../services/api";

export default function Navbar() {
  const {
    user,
    setUser,
  } = useAuth();

  async function handleLogout() {
    try {
      await api.post(
        "/auth/logout"
      );

      setUser(null);

      window.location.href =
        "/login";
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

        padding: "20px",

        borderBottom:
          "1px solid #ddd",
      }}
    >
      <Link to="/">
        CohortX
      </Link>

      <div
        style={{
          display: "flex",

          gap: "20px",
        }}
      >
        <Link
          to={`/profile/${user?.username}`}
        >
          {user?.username}
        </Link>

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
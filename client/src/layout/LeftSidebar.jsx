import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function LeftSidebar() {
  const { user, setUser } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");

      setUser(null);

      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  }

  const navItems = [
    {
      label: "Home",
      to: "/feed",
    },

    {
      label: "Explore",
      to: "/explore",
    },

    {
      label: "Messages",
      to: "/chat",
    },

    {
      label: "Go Live",
      to: "/live",
    },

    {
      label: "Discover",
      to: "/search",
    },

    {
      label: "Profile",
      to: `/profile/${user?.username}`,
    },
  ];

  return (
    <div
      style={{
        position: "sticky",

        top: 0,

        height: "100vh",

        padding: "30px",

        borderRight: "1px solid #e5e7eb",

        background: "#ffffff",

        display: "flex",

        flexDirection: "column",
      }}
    >
      <h1>CohortX</h1>

      <br />

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: "8px",

          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to === "/chat" && location.pathname.startsWith("/chat"));

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                padding: "12px 14px",

                borderRadius: "8px",

                fontWeight: active ? 800 : 600,

                background: active ? "#f3f4f6" : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        style={{
          background: "transparent",

          color: "#111",

          padding: 0,
        }}
      >
        Logout
      </button>
    </div>
  );
}

import {
  Home,
  Compass,
  MessageCircle,
  Radio,
  Sparkles,
  User,
  Plus,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import api from "../../services/api";

export default function LeftSidebar() {
  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");

      logout();

      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  }

  const navItems = [
    {
      label: "Home",

      to: "/feed",

      icon: Home,
    },

    {
      label: "Explore",

      to: "/explore",

      icon: Compass,
    },

    {
      label: "Messages",

      to: "/chat",

      icon: MessageCircle,
    },

    {
      label: "Go Live",

      to: "/live",

      icon: Radio,
    },

    {
      label: "Story",

      to: "/story/create",

      icon: Sparkles,
    },

    {
      label: "Profile",

      to: `/profile/${user?.username}`,

      icon: User,
    },
  ];

  return (
    <div
      style={{
        height: "100%",

        background: "#fff",

        padding: "36px 24px",

        display: "flex",

        flexDirection: "column",
      }}
    >
      <div
        style={{
          paddingLeft: 14,

          marginBottom: 42,
        }}
      >
        <div
          style={{
            fontSize: 34,

            fontWeight: 900,

            color: "#0f1419",
          }}
        >
          CohortX
        </div>

        <div
          style={{
            color: "#536471",

            marginTop: 8,
          }}
        >
          Build. Share. Grow.
        </div>
      </div>

      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: 8,

          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const active =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to);

          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex",

                alignItems: "center",

                gap: 18,

                padding: "18px",

                borderRadius: 22,

                color: active ? "#fff" : "#111827",

                background: active ? "#1d9bf0" : "transparent",

                fontWeight: active ? 700 : 600,

                transition: ".2s",
              }}
            >
              <Icon size={24} />

              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/create")}
        style={{
          width: "100%",

          height: 58,

          border: "none",

          borderRadius: 22,

          background: "#1d9bf0",

          color: "#fff",

          fontSize: 16,

          fontWeight: 800,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          gap: 10,

          marginBottom: 18,
        }}
      >
        <Plus size={20} />
        Create
      </button>

      <div
        style={{
          display: "flex",

          gap: 12,

          alignItems: "center",

          padding: 14,

          borderRadius: 22,

          background: "#f7f9fa",
        }}
      >
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt=""
          style={{
            width: 52,

            height: 52,

            borderRadius: "50%",

            objectFit: "cover",
          }}
        />

        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              fontWeight: 700,
            }}
          >
            @{user?.username}
          </div>

          <div
            style={{
              color: "#536471",

              fontSize: 13,
            }}
          >
            Builder
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            border: "none",

            background: "transparent",

            color: "#1d9bf0",

            display: "flex",

            alignItems: "center",
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

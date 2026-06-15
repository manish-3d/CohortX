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
    { label: "Home", to: "/feed", icon: Home },
    { label: "Explore", to: "/explore", icon: Compass },
    { label: "Messages", to: "/chat", icon: MessageCircle },
    { label: "Go Live", to: "/live", icon: Radio },
    { label: "Story", to: "/story/create", icon: Sparkles },
    { label: "Profile", to: `/profile/${user?.username}`, icon: User },
  ];

  return (
    <div
      style={{
        height: "100%",
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Logo */}
      <div className="fade-up" style={{ paddingLeft: 16, marginBottom: 44 }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: "-1px",
            background: "linear-gradient(135deg, #0f1419 30%, #1d9bf0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
            marginBottom: 6,
          }}
        >
          CohortX
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          Build · Share · Grow
        </div>
        {/* accent line */}
        <div
          style={{
            marginTop: 14,
            width: 40,
            height: 3,
            borderRadius: 99,
            background: "linear-gradient(90deg, #1d9bf0, rgba(29,155,240,0))",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}
      >
        {navItems.map((item, i) => {
          const active =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link fade-up d${i + 1}${active ? " active" : ""}`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span>{item.label}</span>
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.7)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Create Button */}
      <button
        onClick={() => navigate("/create")}
        className="solid-btn fade-up"
        style={{ width: "100%", height: 54, marginBottom: 16, fontSize: 15 }}
      >
        <Plus size={18} strokeWidth={2.5} />
        Create Post
      </button>

      {/* User card */}
      <div
        className="card fade-up"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: "12px 14px",
          transition: "box-shadow 0.3s",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.username}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(29,155,240,0.3)",
            }}
          />
          {/* online dot */}
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid white",
            }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--black)",
              truncate: true,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{user?.username}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
            Builder
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="glass-btn"
          style={{
            height: 36,
            width: 36,
            padding: 0,
            borderRadius: "50%",
            flexShrink: 0,
            color: "var(--muted)",
          }}
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}

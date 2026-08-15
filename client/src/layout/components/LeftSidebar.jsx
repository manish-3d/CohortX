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
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        background: "transparent",
      }}
    >
      {/* ── Logo ── */}
      <div
        className="fade-up sidebar-logo-full"
        style={{ paddingLeft: 8, marginBottom: 22 }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: "-0.5px",
            fontFamily: "'Syne', 'Space Grotesk', sans-serif",
            color: "#fff",
            lineHeight: 1.05,
            marginBottom: 3,
          }}
        >
          Cohort
          <span
            style={{
              color: "var(--white)",
              textShadow:
                "0 0 18px var(--white-85), 0 0 40px var(--white-30)",
            }}
          >
            X
          </span>
        </div>
        <div
          style={{
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
          }}
        >
          Build · Share · Grow
        </div>
        <div
          style={{
            marginTop: 8,
            width: 24,
            height: 1.5,
            borderRadius: 999,
            background: "linear-gradient(90deg, var(--white), transparent)",
            boxShadow: "0 0 8px var(--white-60)",
          }}
        />
      </div>

      {/* ── Nav (FIX APPLIED HERE) ── */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          /* ↓ This forcefully overrides the sneaky white background rule ↓ */
          background: "transparent",
          backgroundColor: "transparent",
        }}
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
              style={{ padding: "9px 10px", minHeight: 36, fontSize: 12 }}
            >
              <Icon size={14} strokeWidth={active ? 2.5 : 1.9} />
              <span className="sidebar-label" style={{ fontSize: 12 }}>
                {item.label}
              </span>
              {active && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow:
                      "0 0 8px rgba(255,255,255,0.8), 0 0 16px var(--white-60)",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Create button ── */}
      <button
        onClick={() => navigate("/create")}
        className="solid-btn sidebar-create-btn fade-up"
        style={{
          width: "100%",
          height: 34,
          marginBottom: 10,
          fontSize: 11,
          gap: 6,
        }}
      >
        <Plus size={12} />
        <span>Create</span>
      </button>

      {/* ── User card ── */}
      <div
        className="card fade-up sidebar-user-wrap"
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "9px 10px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.username}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid var(--white-30)",
              boxShadow: "0 0 10px var(--white-12)",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              border: "1.5px solid rgba(3,13,26,0.9)",
              boxShadow: "0 0 6px rgba(34,197,94,0.8)",
            }}
          />
        </div>

        <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 10,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "var(--text)",
            }}
          >
            @{user?.username}
          </div>
          <div
            style={{
              fontSize: 9,
              color: "var(--text-muted)",
              marginTop: 1,
              fontWeight: 600,
              textShadow: "0 0 8px var(--white-30)",
            }}
          >
            Builder
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="glass-btn"
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            padding: 0,
            border: "1px solid rgba(242, 242, 242, 0.3)",
            color: "rgba(252, 246, 246, 0.8)",
            background: "rgba(51, 103, 193, 0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(242, 242, 242, 0.3)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <LogOut size={11} color="black" />
        </button>
      </div>
    </div>
  );
}


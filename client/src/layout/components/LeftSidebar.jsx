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
              color: "var(--blue)",
              textShadow:
                "0 0 18px rgba(29,155,240,0.8), 0 0 40px rgba(29,155,240,0.4)",
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
            background: "linear-gradient(90deg, var(--blue), transparent)",
            boxShadow: "0 0 8px rgba(29,155,240,0.6)",
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
                      "0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(29,155,240,0.6)",
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
          position: "relative",
          overflow: "hidden",
        }}
        onMouseEnter={smokeEffect}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
            animation: "shineSweep 2.8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
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
          background: "rgba(6,25,41,0.75)",
          border: "1px solid rgba(29,155,240,0.22)",
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
              border: "1.5px solid rgba(29,155,240,0.5)",
              boxShadow: "0 0 10px rgba(29,155,240,0.3)",
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
              color: "var(--blue)",
              marginTop: 1,
              fontWeight: 600,
              textShadow: "0 0 8px rgba(29,155,240,0.6)",
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
            border: "1px solid rgba(239,68,68,0.3)",
            color: "rgba(239,68,68,0.8)",
            background: "rgba(239,68,68,0.08)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.18)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.6)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(239,68,68,0.35)";
            smokeEffect(e);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <LogOut size={11} />
        </button>
      </div>
    </div>
  );
}

/* ── Smoke particle effect ── */
function smokeEffect(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const count = 12;

  for (let i = 0; i < count; i++) {
    const puff = document.createElement("div");
    const size = Math.random() * 14 + 6;
    const startX = Math.random() * rect.width;
    const dirX = (Math.random() - 0.5) * 50;
    const dirY = -(Math.random() * 40 + 16);
    const dur = Math.random() * 500 + 350;
    const delay = Math.random() * 180;

    Object.assign(puff.style, {
      position: "fixed",
      left: rect.left + startX + "px",
      top: rect.top + rect.height / 2 + "px",
      width: size + "px",
      height: size + "px",
      borderRadius: "50%",
      background:
        i % 3 === 0
          ? "rgba(29,155,240,0.65)"
          : i % 3 === 1
            ? "rgba(66,176,245,0.5)"
            : "rgba(255,255,255,0.35)",
      pointerEvents: "none",
      zIndex: 9999,
      filter: "blur(3px)",
      transition: `all ${dur}ms cubic-bezier(0.22,1,0.36,1)`,
      opacity: "0.85",
      transform: "scale(0.3)",
    });

    document.body.appendChild(puff);
    setTimeout(() => {
      puff.style.transform = `translate(${dirX}px, ${dirY}px) scale(${Math.random() * 1.6 + 1.1})`;
      puff.style.opacity = "0";
    }, delay);
    setTimeout(() => puff.remove(), dur + delay + 50);
  }
}

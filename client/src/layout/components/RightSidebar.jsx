import {
  Bell,
  Radio,
  Eye,
  Play,
  Square,
  Video,
  X,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import RightChatPanel from "../../components/RightChatPanel";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [selectedLive, setSelectedLive] = useState(null);
  const [unread, setUnread] = useState(0);
  const [lives, setLives] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnread();
    loadLives();
    const interval = setInterval(loadLives, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.slice(0, 5));
    } catch {}
  }
  async function loadUnread() {
    try {
      const res = await api.get("/notifications/count");
      setUnread(res.data.count);
    } catch {}
  }
  async function loadLives() {
    try {
      const res = await api.get("/live");
      setLives(res.data);
    } catch {}
  }
  async function startLive() {
    try {
      const title = prompt("Live title");
      if (!title) return;
      const description = prompt("Description");
      setLiveLoading(true);
      await api.post("/live/start", { title, description });
      loadLives();
      alert("Live started");
    } finally {
      setLiveLoading(false);
    }
  }
  async function endLive(id) {
    try {
      await api.patch(`/live/${id}/end`);
      loadLives();
    } catch {}
  }

  async function markRead(id) {
    const wasUnread = notifications.some((n) => n.id === id && !n.isRead);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (wasUnread) setUnread((c) => Math.max(0, c - 1));
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {}
  }

  function openNotification(n) {
    markRead(n.id);
    if (n.link) navigate(n.link);
  }

  function openActorProfile(n, e) {
    e.stopPropagation();
    const actor = n.actor || n.user;
    if (actor?.username) {
      markRead(n.id);
      navigate(`/profile/${actor.username}`);
    }
  }

  async function joinLive() {
    try {
      window.open(selectedLive.zoomJoinUrl, "_blank");
      await api.patch(`/live/${selectedLive.id}/view`, { change: 1 });
      loadLives();
    } catch {}
  }

  const sectionStyle = {
    borderRadius: "var(--radius-xl)",
    overflow: "hidden",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(29,155,240,0.13)",
    boxShadow: "var(--shadow-sm)",
    transition: "box-shadow 0.3s",
  };

  const panelHeaderStyle = (open) => ({
    width: "100%",
    padding: "16px 20px",
    border: "none",
    background: "transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    color: "var(--black)",
    letterSpacing: "0.01em",
    transition: "background 0.2s",
  });

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Notifications */}
      <div className="fade-up d1" style={sectionStyle}>
        <button
          onClick={() => setShowNotifications((v) => !v)}
          style={panelHeaderStyle(showNotifications)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(29,155,240,0.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={17} color="var(--blue)" strokeWidth={2} />
            Notifications
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!!unread && (
              <span
                className="pulse-glow"
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: "var(--radius-full)",
                  background: "var(--blue)",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {unread}
              </span>
            )}
            <ChevronDown
              size={16}
              color="var(--muted)"
              style={{
                transition: "transform 0.3s var(--ease)",
                transform: showNotifications
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            />
          </div>
        </button>

        <div
          style={{
            maxHeight: showNotifications ? "600px" : "0",
            opacity: showNotifications ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s var(--ease), opacity 0.3s",
          }}
        >
          <div
            style={{
              padding: "0 14px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              borderTop: "1px solid rgba(29,155,240,0.08)",
              paddingTop: 12,
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  color: "var(--muted)",
                  padding: "8px 4px",
                  fontSize: 13,
                }}
              >
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => {
                const actor = n.actor || n.user;
                return (
                  <div
                    key={n.id}
                    onClick={() => openNotification(n)}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "11px 12px",
                      borderRadius: "var(--radius-md)",
                      background: n.isRead
                        ? "rgba(247,249,250,0.7)"
                        : "rgba(29,155,240,0.07)",
                      border: n.isRead
                        ? "1px solid rgba(29,155,240,0.06)"
                        : "1px solid rgba(29,155,240,0.22)",
                      cursor: n.link ? "pointer" : "default",
                      transition: "background 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (n.link)
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <button
                      type="button"
                      onClick={(e) => openActorProfile(n, e)}
                      disabled={!actor?.username}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        cursor: actor?.username ? "pointer" : "default",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={actor?.avatar || "/default-avatar.png"}
                        alt={actor?.username}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid rgba(29,155,240,0.2)",
                        }}
                      />
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: n.isRead ? 500 : 700,
                          fontSize: 13,
                          color: "var(--black)",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--muted)",
                          marginTop: 3,
                        }}
                      >
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="fade-up d2" style={sectionStyle}>
        <button
          onClick={() => setShowChat((v) => !v)}
          style={{
            ...panelHeaderStyle(showChat),
            background: showChat ? "var(--black)" : "transparent",
            color: showChat ? "#fff" : "var(--black)",
            borderRadius: showChat
              ? "var(--radius-xl) var(--radius-xl) 0 0"
              : "var(--radius-xl)",
            transition: "background 0.3s, color 0.3s, border-radius 0.3s",
          }}
          onMouseEnter={(e) => {
            if (!showChat)
              e.currentTarget.style.background = "rgba(15,20,25,0.06)";
          }}
          onMouseLeave={(e) => {
            if (!showChat) e.currentTarget.style.background = "transparent";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MessageCircle size={17} strokeWidth={2} />
            Messages
          </div>
          <ChevronDown
            size={16}
            style={{
              transition: "transform 0.3s var(--ease)",
              transform: showChat ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        <div
          style={{
            maxHeight: showChat ? "600px" : "0",
            opacity: showChat ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s var(--ease), opacity 0.3s",
          }}
        >
          <div style={{ padding: "14px" }}>
            <RightChatPanel />
          </div>
        </div>
      </div>

      {/* Live */}
      <div className="fade-up d3" style={{ ...sectionStyle, padding: 16 }}>
        <button
          onClick={startLive}
          disabled={liveLoading}
          className="solid-btn"
          style={{ width: "100%", height: 50, fontSize: 14 }}
        >
          <Video size={16} />
          {liveLoading ? "Starting..." : "Go Live"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 18,
            marginBottom: 12,
            fontWeight: 800,
            fontSize: 13,
            color: "var(--black)",
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          <Radio size={14} color="var(--blue)" />
          Live Now
          {lives.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(29,155,240,0.1)",
                color: "var(--blue)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              {lives.length}
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lives.map((live) => (
            <div
              key={live.id}
              style={{
                background: "rgba(247,249,250,0.8)",
                border: "1px solid rgba(29,155,240,0.12)",
                borderRadius: "var(--radius-lg)",
                padding: 12,
                transition: "box-shadow 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={live.host.avatar}
                    alt=""
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      border: "2px solid rgba(29,155,240,0.3)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#ef4444",
                      border: "1.5px solid white",
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--black)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {live.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    <Eye size={11} />
                    {live.viewerCount || 0} watching
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => setSelectedLive(live)}
                  className="solid-btn"
                  style={{
                    flex: 1,
                    height: 34,
                    fontSize: 12,
                    padding: "0 12px",
                  }}
                >
                  <Play size={11} />
                  Watch
                </button>
                <button
                  onClick={() => endLive(live.id)}
                  className="glass-btn"
                  style={{
                    flex: 1,
                    height: 34,
                    fontSize: 12,
                    padding: "0 12px",
                    color: "#ef4444",
                    borderColor: "rgba(239,68,68,0.25)",
                  }}
                >
                  <Square size={11} />
                  End
                </button>
              </div>
            </div>
          ))}

          {lives.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                fontSize: 13,
                color: "var(--muted)",
                fontWeight: 500,
              }}
            >
              No active streams right now
            </div>
          )}
        </div>
      </div>

      {/* Live modal */}
      {selectedLive && (
        <div
          onClick={() => setSelectedLive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,20,25,0.55)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            animation: "fadeUp 0.25s var(--ease) both",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              width: 400,
              padding: 28,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedLive(null)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                border: "none",
                background: "rgba(29,155,240,0.08)",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "var(--muted)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(29,155,240,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(29,155,240,0.08)")
              }
            >
              <X size={15} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <Radio size={20} color="var(--blue)" />
              <h2
                style={{ fontSize: 18, fontWeight: 800, color: "var(--black)" }}
              >
                {selectedLive.title}
              </h2>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 14,
                marginBottom: 22,
                lineHeight: 1.6,
              }}
            >
              {selectedLive.description}
            </p>
            <button
              onClick={joinLive}
              className="solid-btn"
              style={{ width: "100%", height: 52 }}
            >
              <Play size={16} />
              Join Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

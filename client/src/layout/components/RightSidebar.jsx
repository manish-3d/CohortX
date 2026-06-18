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

  /* ── Shared dark-glass panel style ── */
  const sectionStyle = {
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    background: "rgba(4,14,28,0.72)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    border: "1px solid rgba(29,155,240,0.18)",
    boxShadow:
      "0 2px 20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: "box-shadow 0.3s, border-color 0.3s",
  };

  const panelHeaderStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "none",
    background: "transparent",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 800,
    fontSize: 11,
    cursor: "pointer",
    color: "var(--text-muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    transition: "background 0.2s, color 0.2s",
    fontFamily: "'Syne', 'Inter', sans-serif",
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "14px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* ── Notifications ── */}
      <div className="fade-up d1" style={sectionStyle}>
        <button
          onClick={() => setShowNotifications((v) => !v)}
          style={panelHeaderStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(29,155,240,0.07)";
            e.currentTarget.style.color = "var(--blue-bright)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Bell
              size={12}
              color="var(--blue)"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 0 4px rgba(29,155,240,0.6))" }}
            />
            Notifications
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {!!unread && (
              <span
                className="pulse-glow"
                style={{
                  minWidth: 17,
                  height: 17,
                  borderRadius: "var(--radius-full)",
                  background:
                    "linear-gradient(135deg, var(--blue), var(--blue-bright))",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 9,
                  fontWeight: 900,
                  boxShadow: "0 0 10px rgba(29,155,240,0.6)",
                }}
              >
                {unread}
              </span>
            )}
            <ChevronDown
              size={12}
              color="var(--text-dim)"
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
            maxHeight: showNotifications ? "500px" : "0",
            opacity: showNotifications ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s var(--ease), opacity 0.3s",
          }}
        >
          <div
            style={{
              padding: "0 10px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              borderTop: "1px solid rgba(29,155,240,0.1)",
              paddingTop: 9,
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  color: "var(--text-dim)",
                  padding: "6px 3px",
                  fontSize: 11,
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
                      gap: 8,
                      padding: "8px 9px",
                      borderRadius: "var(--radius-md)",
                      background: n.isRead
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(29,155,240,0.09)",
                      border: n.isRead
                        ? "1px solid rgba(29,155,240,0.07)"
                        : "1px solid rgba(29,155,240,0.28)",
                      cursor: n.link ? "pointer" : "default",
                      transition:
                        "background 0.2s, transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (n.link) {
                        e.currentTarget.style.transform = "translateX(2px)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 12px rgba(29,155,240,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "none";
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
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid rgba(29,155,240,0.35)",
                          boxShadow: "0 0 8px rgba(29,155,240,0.2)",
                        }}
                      />
                    </button>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: n.isRead ? 500 : 700,
                          fontSize: 11,
                          color: n.isRead ? "var(--text-muted)" : "var(--text)",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "var(--text-dim)",
                          marginTop: 2,
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

      {/* ── Messages ── */}
      <div className="fade-up d2" style={sectionStyle}>
        <button
          onClick={() => setShowChat((v) => !v)}
          style={{
            ...panelHeaderStyle,
            background: showChat ? "rgba(29,155,240,0.15)" : "transparent",
            color: showChat ? "var(--blue-bright)" : "var(--text-muted)",
            borderRadius: showChat
              ? "var(--radius-lg) var(--radius-lg) 0 0"
              : "var(--radius-lg)",
            borderBottom: showChat ? "1px solid rgba(29,155,240,0.18)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!showChat) {
              e.currentTarget.style.background = "rgba(29,155,240,0.07)";
              e.currentTarget.style.color = "var(--blue-bright)";
            }
          }}
          onMouseLeave={(e) => {
            if (!showChat) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <MessageCircle
              size={12}
              strokeWidth={2}
              style={{
                filter: showChat
                  ? "drop-shadow(0 0 4px rgba(29,155,240,0.6))"
                  : "none",
              }}
            />
            Messages
          </div>
          <ChevronDown
            size={12}
            style={{
              transition: "transform 0.3s var(--ease)",
              transform: showChat ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        <div
          style={{
            maxHeight: showChat ? "500px" : "0",
            opacity: showChat ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s var(--ease), opacity 0.3s",
          }}
        >
          <div style={{ padding: "10px" }}>
            <RightChatPanel />
          </div>
        </div>
      </div>

      {/* ── Go Live ── */}
      <div className="fade-up d3" style={{ ...sectionStyle, padding: 12 }}>
        {/* Go Live button with shine */}
        <button
          onClick={startLive}
          disabled={liveLoading}
          className="solid-btn"
          style={{
            width: "100%",
            height: 36,
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
              animation: "shineSweep 2.4s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <Video size={12} />
          {liveLoading ? "Starting..." : "Go Live"}
        </button>

        {/* Live Now header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            marginBottom: 9,
            fontWeight: 800,
            fontSize: 9,
            color: "var(--text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "'Syne', 'Inter', sans-serif",
          }}
        >
          <Radio
            size={10}
            color="var(--blue)"
            style={{ filter: "drop-shadow(0 0 4px rgba(29,155,240,0.7))" }}
          />
          <span>Live Now</span>
          {lives.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9,
                fontWeight: 800,
                background: "rgba(29,155,240,0.15)",
                color: "var(--blue-bright)",
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(29,155,240,0.3)",
                boxShadow: "0 0 8px rgba(29,155,240,0.2)",
              }}
            >
              {lives.length}
            </span>
          )}
        </div>

        {/* Live cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {lives.map((live) => (
            <div
              key={live.id}
              style={{
                background: "rgba(6,25,41,0.65)",
                border: "1px solid rgba(29,155,240,0.18)",
                borderRadius: "var(--radius-md)",
                padding: "9px 10px",
                transition: "box-shadow 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(29,155,240,0.2)";
                e.currentTarget.style.borderColor = "rgba(29,155,240,0.38)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(29,155,240,0.18)";
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={live.host.avatar}
                    alt=""
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1.5px solid rgba(29,155,240,0.4)",
                      boxShadow: "0 0 10px rgba(29,155,240,0.25)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ef4444",
                      border: "1.5px solid rgba(3,13,26,0.9)",
                      boxShadow: "0 0 6px rgba(239,68,68,0.7)",
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: "var(--text)",
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
                      gap: 3,
                      fontSize: 9,
                      color: "var(--text-dim)",
                      marginTop: 2,
                    }}
                  >
                    <Eye size={9} />
                    {live.viewerCount || 0} watching
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <button
                  onClick={() => setSelectedLive(live)}
                  className="solid-btn"
                  style={{
                    flex: 1,
                    height: 26,
                    fontSize: 10,
                    padding: "0 8px",
                    gap: 4,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                      animation: "shineSweep 2.8s ease-in-out infinite",
                      pointerEvents: "none",
                    }}
                  />
                  <Play size={9} />
                  Watch
                </button>
                <button
                  onClick={() => endLive(live.id)}
                  className="glass-btn"
                  style={{
                    flex: 1,
                    height: 26,
                    fontSize: 10,
                    padding: "0 8px",
                    gap: 4,
                    color: "#ef4444",
                    borderColor: "rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.08)",
                  }}
                >
                  <Square size={9} />
                  End
                </button>
              </div>
            </div>
          ))}

          {lives.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "12px 0",
                fontSize: 11,
                color: "var(--text-dim)",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              No active streams right now
            </div>
          )}
        </div>
      </div>

      {/* ── Live modal ── */}
      {selectedLive && (
        <div
          onClick={() => setSelectedLive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3,10,20,0.75)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            animation: "fadeUp 0.25s var(--ease) both",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 320,
              padding: 22,
              background: "rgba(4,14,28,0.92)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid rgba(29,155,240,0.28)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(29,155,240,0.1)",
              position: "relative",
            }}
          >
            {/* Glow accent top */}
            <div
              style={{
                position: "absolute",
                top: -1,
                left: "20%",
                right: "20%",
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, var(--blue), transparent)",
                borderRadius: 2,
              }}
            />
            <button
              onClick={() => setSelectedLive(null)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                border: "1px solid rgba(29,155,240,0.2)",
                background: "rgba(29,155,240,0.08)",
                borderRadius: "50%",
                width: 26,
                height: 26,
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                color: "var(--text-muted)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(29,155,240,0.18)";
                e.currentTarget.style.boxShadow =
                  "0 0 10px rgba(29,155,240,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(29,155,240,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <X size={12} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Radio
                size={16}
                color="var(--blue)"
                style={{ filter: "drop-shadow(0 0 6px rgba(29,155,240,0.7))" }}
              />
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "var(--text)",
                  fontFamily: "'Syne', 'Inter', sans-serif",
                }}
              >
                {selectedLive.title}
              </h2>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 12,
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              {selectedLive.description}
            </p>
            <button
              onClick={joinLive}
              className="solid-btn"
              style={{
                width: "100%",
                height: 40,
                fontSize: 12,
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
                  animation: "shineSweep 2.4s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              <Play size={13} />
              Join Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function smokeEffect(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 12; i++) {
    const puff = document.createElement("div");
    const size = Math.random() * 14 + 6;
    const startX = Math.random() * rect.width;
    const dirX = (Math.random() - 0.5) * 48;
    const dirY = -(Math.random() * 38 + 14);
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

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
  Sparkles,
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

  // ── Go Live modal state ──
  const [showGoLive, setShowGoLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDescription, setLiveDescription] = useState("");
  const [liveError, setLiveError] = useState("");

  // ── Lightweight toast (replaces alert()) ──
  const [toast, setToast] = useState(null); // { message, tone: 'success' | 'error' }

  useEffect(() => {
    loadNotifications();
    loadUnread();
    loadLives();
    const interval = setInterval(loadLives, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(message, tone = "success") {
    setToast({ message, tone });
  }

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

  function openGoLive() {
    setLiveTitle("");
    setLiveDescription("");
    setLiveError("");
    setShowGoLive(true);
  }

  async function submitGoLive(e) {
    e.preventDefault();
    if (!liveTitle.trim()) {
      setLiveError("Give your stream a title to continue.");
      return;
    }
    try {
      setLiveLoading(true);
      setLiveError("");
      await api.post("/live/start", {
        title: liveTitle.trim(),
        description: liveDescription.trim(),
      });
      setShowGoLive(false);
      loadLives();
      showToast("You're live! Viewers can now join your stream.");
    } catch (err) {
      setLiveError(
        err.response?.data?.message || "Couldn't start your stream. Try again."
      );
    } finally {
      setLiveLoading(false);
    }
  }

  async function endLive(id) {
    try {
      await api.patch(`/live/${id}/end`);
      loadLives();
      showToast("Stream ended.");
    } catch {
      showToast("Couldn't end the stream. Try again.", "error");
    }
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
    background: "linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.80) 100%)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    border: "1px solid var(--white-12)",
    boxShadow:
      "0 2px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
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

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid var(--white-30)",
    borderRadius: "var(--radius-md)",
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };

  function focusInput(e) {
    e.currentTarget.style.borderColor = "var(--white-60)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--white-12)";
    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
  }
  function blurInput(e) {
    e.currentTarget.style.borderColor = "var(--white-30)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "14px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}
    >
      {/* ── Notifications ── */}
      <div className="fade-up d1" style={sectionStyle}>
        <button
          onClick={() => setShowNotifications((v) => !v)}
          style={panelHeaderStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--white-07)";
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
              color="var(--text-muted)"
              strokeWidth={2}
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
                    "linear-gradient(135deg, #fff, rgba(200,200,200,0.8))",
                  color: "#000",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 9,
                  fontWeight: 900,
                  boxShadow: "0 0 8px rgba(255,255,255,0.4)",
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
              borderTop: "1px solid var(--white-12)",
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
                        : "var(--white-07)",
                      border: n.isRead
                        ? "1px solid var(--white-07)"
                        : "1px solid var(--white-30)",
                      cursor: n.link ? "pointer" : "default",
                      transition:
                        "background 0.2s, transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (n.link) {
                        e.currentTarget.style.transform = "translateX(2px)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 12px var(--white-30)";
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
                          border: "1.5px solid var(--white-30)",
                          boxShadow: "0 0 8px var(--white-30)",
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
      <div
        className="fade-up d2"
        style={{
          ...sectionStyle,
          borderColor: showChat
            ? "var(--white-30)"
            : "var(--white-12)",
          boxShadow: showChat
            ? "0 4px 28px var(--white-12), inset 0 1px 0 rgba(255,255,255,0.05)"
            : sectionStyle.boxShadow,
        }}
      >
        <button
          onClick={() => setShowChat((v) => !v)}
          style={{
            ...panelHeaderStyle,
            background: showChat
              ? "linear-gradient(180deg, var(--white-12), var(--white-07))"
              : "transparent",
            color: showChat ? "var(--blue-bright)" : "var(--text-muted)",
            borderRadius: showChat
              ? "var(--radius-lg) var(--radius-lg) 0 0"
              : "var(--radius-lg)",
            borderBottom: showChat ? "1px solid var(--white-30)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!showChat) {
              e.currentTarget.style.background = "var(--white-07)";
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
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "var(--radius-full)",
                display: "grid",
                placeItems: "center",
                background: showChat
                  ? "var(--white-30)"
                  : "var(--white-12)",
                transition: "background 0.2s",
              }}
            >
              <MessageCircle
                size={11}
                strokeWidth={2.2}
              />
            </span>
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
            maxHeight: showChat ? "560px" : "0",
            opacity: showChat ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.4s var(--ease), opacity 0.3s",
          }}
        >
          <div
            style={{
              padding: "12px",
              background:
                "linear-gradient(180deg, var(--white-07), transparent 60px)",
            }}
          >
            <div
              style={{
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--white-12)",
                background: "rgba(2,9,18,0.4)",
              }}
            >
              <RightChatPanel />
            </div>
          </div>
        </div>
      </div>

      {/* ── Go Live ── */}
      <div className="fade-up d3" style={{ ...sectionStyle, padding: 12 }}>
        {/* Go Live button with shine */}
        <button
          onClick={openGoLive}
          className="solid-btn"
          style={{
            width: "100%",
            height: 36,
            fontSize: 11,
            gap: 6,
          }}
        >
          <Video size={12} />
          Go Live
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
            color="var(--text-muted)"
          />
          <span>Live Now</span>
          {lives.length > 0 && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 9,
                fontWeight: 800,
                background: "var(--white-12)",
                color: "var(--text-muted)",
                padding: "1px 6px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--white-30)",
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
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)",
                border: "1px solid var(--white-12)",
                borderRadius: "var(--radius-md)",
                padding: "9px 10px",
                transition: "box-shadow 0.25s, border-color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px var(--white-30)";
                e.currentTarget.style.borderColor = "var(--white-30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--white-12)";
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
                      border: "1.5px solid var(--white-30)",
                      boxShadow: "0 0 10px var(--white-30)",
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
                  }}
                >
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

      {/* ── Go Live modal (replaces prompt()) ── */}
      {showGoLive && (
        <div
          onClick={() => !liveLoading && setShowGoLive(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            animation: "fadeUp 0.25s var(--ease) both",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              maxWidth: "100%",
              padding: 24,
              background: "rgba(10,10,10,0.95)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--white-30)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px var(--white-12)",
              position: "relative",
            }}
          >
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
              type="button"
              onClick={() => !liveLoading && setShowGoLive(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                border: "1px solid var(--white-30)",
                background: "var(--white-07)",
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
                e.currentTarget.style.background = "var(--white-12)";
                e.currentTarget.style.boxShadow =
                  "0 0 10px var(--white-30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--white-07)";
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
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--radius-md)",
                  display: "grid",
                  placeItems: "center",
                  background: "var(--white-12)",
                  border: "1px solid var(--white-30)",
                  flexShrink: 0,
                }}
              >
                <Video
                  size={15}
                  color="var(--blue-bright)"
                  style={{
                    filter: "drop-shadow(0 0 6px var(--white-60))",
                  }}
                />
              </span>
              <div>
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--text)",
                    fontFamily: "'Syne', 'Inter', sans-serif",
                  }}
                >
                  Go Live
                </h2>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-dim)",
                    marginTop: 1,
                  }}
                >
                  Start a stream your followers can join
                </p>
              </div>
            </div>

            <form onSubmit={submitGoLive}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    marginBottom: 6,
                  }}
                >
                  Title
                </label>
                <input
                  autoFocus
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="e.g. Building a React dashboard"
                  maxLength={80}
                  style={inputStyle}
                  disabled={liveLoading}
                />
              </div>

              <div style={{ marginBottom: liveError ? 8 : 18 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    marginBottom: 6,
                  }}
                >
                  Description{" "}
                  <span style={{ textTransform: "none", fontWeight: 500 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  placeholder="What are you working on?"
                  rows={3}
                  maxLength={240}
                  style={{
                    ...inputStyle,
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                  disabled={liveLoading}
                />
              </div>

              {liveError && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#f87171",
                    marginBottom: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {liveError}
                </div>
              )}

              <button
                type="submit"
                disabled={liveLoading}
                className="solid-btn"
                style={{
                  width: "100%",
                  height: 42,
                  fontSize: 12,
                  position: "relative",
                  overflow: "hidden",
                  opacity: liveLoading ? 0.75 : 1,
                  cursor: liveLoading ? "wait" : "pointer",
                }}
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
                <Sparkles size={13} />
                {liveLoading ? "Starting your stream…" : "Start Streaming"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Live modal ── */}
      {selectedLive && (
        <div
          onClick={() => setSelectedLive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
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
              background: "rgba(10,10,10,0.94)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--white-30)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px var(--white-12)",
              position: "relative",
            }}
          >
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
                border: "1px solid var(--white-30)",
                background: "var(--white-07)",
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
                e.currentTarget.style.background = "var(--white-12)";
                e.currentTarget.style.boxShadow =
                  "0 0 10px var(--white-30)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--white-07)";
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
                style={{ filter: "drop-shadow(0 0 6px var(--white-85))" }}
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

      {/* ── Toast (replaces alert()) ── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            background: "rgba(10,10,10,0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border:
              toast.tone === "error"
                ? "1px solid rgba(239,68,68,0.35)"
                : "1px solid var(--white-30)",
            boxShadow:
              toast.tone === "error"
                ? "0 8px 30px rgba(239,68,68,0.18), 0 0 0 1px rgba(0,0,0,0.2)"
                : "0 8px 30px var(--white-12), 0 0 0 1px rgba(0,0,0,0.2)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text)",
            maxWidth: 280,
            animation: "fadeUp 0.25s var(--ease) both",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              flexShrink: 0,
              background:
                toast.tone === "error" ? "#ef4444" : "var(--blue-bright)",
              boxShadow:
                toast.tone === "error"
                  ? "0 0 8px rgba(239,68,68,0.7)"
                  : "0 0 8px var(--white-85)",
            }}
          />
          {toast.message}
        </div>
      )}
    </div>
  );
}


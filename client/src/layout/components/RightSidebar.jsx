import { Bell, Radio, Eye, Play, Square, Video, X } from "lucide-react";

import { useEffect, useState } from "react";

import { MessageCircle, ChevronDown } from "lucide-react";

import api from "../../services/api";

import RightChatPanel from "../../components/RightChatPanel";

export default function RightSidebar() {
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

      await api.post("/live/start", {
        title,
        description,
      });

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

  function openNotifications() {
    setShowNotifications(!showNotifications);

    if (!showNotifications) {
      setUnread(0);

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,

          isRead: true,
        }))
      );
    }
  }

  async function joinLive() {
    try {
      window.open(
        selectedLive.zoomJoinUrl,

        "_blank"
      );

      await api.patch(`/live/${selectedLive.id}/view`, {
        change: 1,
      });

      loadLives();
    } catch {}
  }

  return (
    <div
      style={{
        height: "100%",

        overflow: "auto",

        padding: 18,

        background: "#fafafa",

        display: "flex",

        flexDirection: "column",

        gap: 22,
      }}
    >
      {/* Notifications */}

      <div
        style={{
          background: "#fff",

          border: "1px solid #ececec",

          borderRadius: 28,

          overflow: "hidden",

          boxShadow: "0 10px 40px rgba(0,0,0,.04)",

          marginBottom: 28,
        }}
      >
        <button
          onClick={openNotifications}
          style={{
            width: "100%",

            padding: "20px",

            border: 0,

            background: "#000",

            color: "#fff",

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            fontWeight: 800,

            fontSize: 16,
          }}
        >
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 12,
            }}
          >
            <Bell size={20} color="#1d9bf0" />
            Notifications
          </div>

          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 12,
            }}
          >
            {!!unread && (
              <div
                style={{
                  minWidth: 24,

                  height: 24,

                  borderRadius: 999,

                  background: "#1d9bf0",

                  color: "#fff",

                  display: "grid",

                  placeItems: "center",

                  fontSize: 12,

                  fontWeight: 700,
                }}
              >
                {unread}
              </div>
            )}

            <ChevronDown
              color="#fff"
              style={{
                transition: ".25s",

                transform: showNotifications ? "rotate(180deg)" : "",
              }}
            />
          </div>
        </button>

        <div
          style={{
            maxHeight: showNotifications ? "700px" : "0",

            opacity: showNotifications ? 1 : 0,

            overflow: "hidden",

            transition: "all .35s ease",
          }}
        >
          <div
            style={{
              padding: 16,

              display: "flex",

              flexDirection: "column",

              gap: 10,
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  color: "#6b7280",

                  padding: 10,
                }}
              >
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",

                    gap: 12,

                    padding: 14,

                    borderRadius: 18,

                    background: "#fafafa",
                  }}
                >
                  <img
                    src={n.user?.avatar}
                    alt=""
                    style={{
                      width: 46,

                      height: 46,

                      borderRadius: "50%",

                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {n.message}
                    </div>

                    <small
                      style={{
                        color: "#6b7280",
                      }}
                    >
                      {new Date(n.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",

          border: "1px solid #ececec",

          borderRadius: 28,

          overflow: "hidden",

          boxShadow: "0 10px 40px rgba(0,0,0,.04)",
        }}
      >
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            width: "100%",

            padding: "20px",

            border: 0,

            background: "#000000",

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            fontWeight: 800,

            fontSize: 16,
          }}
        >
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 12,
            }}
          >
            <MessageCircle />
            Messages
          </div>

          <ChevronDown
            style={{
              transition: ".25s",

              transform: showChat ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        <div
          style={{
            maxHeight: showChat ? "700px" : "0",

            opacity: showChat ? 1 : 0,

            overflow: "hidden",

            transition: "all .35s ease",
          }}
        >
          <div
            style={{
              padding: 16,
            }}
          >
            <RightChatPanel />
          </div>
        </div>
      </div>

      {/* Live */}

      <div
        style={{
          background: "#fff",

          borderRadius: 28,

          padding: 20,

          border: "1px solid #ececec",
        }}
      >
        <button
          onClick={startLive}
          disabled={liveLoading}
          style={{
            width: "100%",

            height: 56,

            border: 0,

            borderRadius: 18,

            background: "#1d9bf0",

            color: "#fff",

            fontWeight: 700,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            gap: 10,
          }}
        >
          <Video />

          {liveLoading ? "Starting..." : "Go Live"}
        </button>

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 10,

            marginTop: 24,

            fontWeight: 800,
          }}
        >
          <Radio />
          Live Now
        </div>

        {lives.map((live) => (
          <div
            key={live.id}
            style={{
              marginTop: 14,

              background: "#fafafa",

              borderRadius: 18,

              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",

                gap: 12,
              }}
            >
              <img
                src={live.host.avatar}
                alt=""
                style={{
                  width: 48,

                  height: 48,

                  borderRadius: "50%",
                }}
              />

              <div>
                <div>{live.title}</div>

                <small
                  style={{
                    display: "flex",

                    gap: 6,

                    alignItems: "center",
                  }}
                >
                  <Eye size={14} />

                  {live.viewerCount || 0}
                </small>
              </div>
            </div>

            <button
              onClick={() => setSelectedLive(live)}
              style={{
                width: "100%",

                marginTop: 12,
              }}
            >
              <Play size={16} />
              View
            </button>

            <button
              onClick={() => endLive(live.id)}
              style={{
                width: "100%",

                marginTop: 8,
              }}
            >
              <Square size={16} />
              End
            </button>
          </div>
        ))}
      </div>

      {selectedLive && (
        <div
          onClick={() => setSelectedLive(null)}
          style={{
            position: "fixed",

            inset: 0,

            background: "rgba(0,0,0,.6)",

            display: "flex",

            justifyContent: "center",

            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,

              background: "#fff",

              borderRadius: 30,

              padding: 28,
            }}
          >
            <button
              onClick={() => setSelectedLive(null)}
              style={{
                float: "right",

                border: 0,

                background: "transparent",
              }}
            >
              <X />
            </button>

            <h2>{selectedLive.title}</h2>

            <p>{selectedLive.description}</p>

            <button
              onClick={joinLive}
              style={{
                width: "100%",

                height: 54,

                border: 0,

                borderRadius: 18,

                background: "#1d9bf0",

                color: "#fff",
              }}
            >
              Join Live
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

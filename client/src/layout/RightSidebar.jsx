import { useEffect, useState } from "react";
import api from "../services/api";
import RightChatPanel from "../components/RightChatPanel";

export default function RightSidebar() {
  const [notifications, setNotifications] = useState([]);
  const [selectedLive, setSelectedLive] = useState(null);
  const [unread, setUnread] = useState(0);
  const [lives, setLives] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadUnread();
    loadLives();

    const interval = setInterval(() => {
      loadLives();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  }

  async function loadUnread() {
    try {
      const res = await api.get("/notifications/count");
      setUnread(res.data.count);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadLives() {
    try {
      const res = await api.get("/live");
      setLives(res.data);
    } catch (err) {
      console.log(err);
    }
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

      await loadLives();

      alert("Live started");
    } catch (err) {
      console.log(err);
      alert("Failed");
    } finally {
      setLiveLoading(false);
    }
  }

  async function endLive(id) {
    try {
      await api.patch(`/live/${id}/end`);
      loadLives();
    } catch (err) {
      console.log(err);
    }
  }

  async function openNotifications() {
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
      window.open(selectedLive.zoomJoinUrl, "_blank");

      try {
        await api.patch(`/live/${selectedLive.id}/view`, {
          change: 1,
        });

        await loadLives();
      } catch (err) {
        console.log("viewer failed", err);
      }
    } catch (err) {
      console.log(err);

      alert("Failed to join");
    }
  }

  return (
    <div
      style={{
        padding: 24,
        background: "#000",
        color: "#fff",
        borderLeft: "1px solid #202020",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <div
        style={{
          marginBottom: 30,
          position: "relative",
        }}
      >
        <button
          onClick={openNotifications}
          style={{
            background: "#171717",
            color: "#fff",
            border: "1px solid #2b2b2b",
            padding: "12px 18px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          Notification {unread > 0 && `(${unread})`}
        </button>

        {showNotifications && (
          <div
            style={{
              position: "absolute",
              top: 60,
              right: 0,
              width: 340,
              background: "#111",
              border: "1px solid #222",
              borderRadius: 20,
              padding: 16,
              zIndex: 999,
            }}
          >
            <h4>Notifications</h4>

            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 12,
                    padding: 12,
                    borderRadius: 16,
                    background: n.isRead ? "#171717" : "#202020",
                  }}
                >
                  <img
                    src={n.user?.avatar}
                    alt=""
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                    }}
                  />

                  <div>
                    <div>{n.message}</div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#888",
                      }}
                    >
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <RightChatPanel />

      <div
        style={{
          marginTop: 30,
          background: "#0f0f0f",
          border: "1px solid #232323",
          borderRadius: 22,
          padding: 20,
        }}
      >
        <button
          onClick={startLive}
          disabled={liveLoading}
          style={{
            width: "100%",
            padding: 14,
            border: "none",
            borderRadius: 14,
            background: "#fff",
            color: "#000",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {liveLoading ? "Starting..." : "🔴 Go Live"}
        </button>

        <h4
          style={{
            marginTop: 24,
          }}
        >
          LIVE NOW
        </h4>

        {lives.length === 0 ? (
          <p
            style={{
              color: "#888",
            }}
          >
            No active lives
          </p>
        ) : (
          lives.map((live) => (
            <div
              key={live.id}
              style={{
                background: "#151515",
                padding: 16,
                borderRadius: 18,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <img
                  src={live.host.avatar}
                  alt=""
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <div>{live.host.username}</div>

                  <div>{live.title}</div>

                  <div
                    style={{
                      color: "#ef4444",
                      fontSize: 12,
                    }}
                  >
                    🔴 LIVE
                  </div>

                  <div
                    style={{
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    👁 {live.viewerCount || 0} watching
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLive(live)}
                style={{
                  width: "100%",
                  marginTop: 12,
                  padding: 10,
                  border: "none",
                  borderRadius: 12,
                  background: "#2a2a2a",
                  color: "#fff",
                }}
              >
                View
              </button>

              <button
                onClick={() => endLive(live.id)}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 10,
                  border: "1px solid #303030",
                  background: "#1a1a1a",
                  color: "#fff",
                  borderRadius: 12,
                }}
              >
                End Live
              </button>
            </div>
          ))
        )}
      </div>

      {selectedLive && (
        <div
          onClick={() => setSelectedLive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 430,
              background: "#111",
              color: "#fff",
              padding: 24,
              borderRadius: 22,
            }}
          >
            <img
              src={selectedLive.host.avatar}
              alt=""
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
              }}
            />

            <h2>{selectedLive.title}</h2>

            <p>{selectedLive.description}</p>

            <button
              onClick={() => joinLive()}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#2b2b2b",
                color: "#fff",
                cursor: "pointer",
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

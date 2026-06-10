import { useEffect, useState } from "react";

import api from "../services/api";

import RightChatPanel from "../components/RightChatPanel";

export default function RightSidebar() {
  const [notifications, setNotifications] = useState([]);

  const [unread, setUnread] = useState(0);
  const [lives, setLives] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  useEffect(() => {
    loadNotifications();

    loadUnread();
    loadLives();
  }, []);
  async function loadLives() {
    try {
      const res = await api.get("/live");

      setLives(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  async function loadNotifications() {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  }
  async function startLive() {
    try {
      const title = prompt("Live title");

      if (!title) {
        return;
      }

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
  async function loadUnread() {
    try {
      const res = await api.get("/notifications/count");

      setUnread(res.data.count);
    } catch (err) {
      console.log(err);
    }
  }

  async function openNotifications() {
    const opening = !showNotifications;

    setShowNotifications(opening);

    if (opening) {
      try {
        await api.patch("/notifications/read-all");

        setUnread(0);

        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,

            isRead: true,
          }))
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div
      style={{
        padding: "24px",

        borderLeft: "1px solid #e5e7eb",

        background: "#fff",

        position: "sticky",

        top: 0,

        height: "100vh",

        overflow: "auto",
      }}
    >
      <div
        style={{
          marginBottom: "28px",

          position: "relative",
        }}
      >
        <button
          onClick={openNotifications}
          style={{
            background: "#111827",

            color: "white",

            border: "none",

            padding: "12px 18px",

            borderRadius: "999px",

            cursor: "pointer",

            fontWeight: "600",
          }}
        >
          🔔
          {unread > 0 && ` (${unread})`}
        </button>

        {showNotifications && (
          <div
            style={{
              position: "absolute",

              top: "60px",

              right: 0,

              width: "340px",

              background: "white",

              border: "1px solid #ddd",

              borderRadius: "18px",

              padding: "16px",

              zIndex: 999,

              boxShadow: "0 20px 60px rgba(0,0,0,.15)",
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

                    gap: "12px",

                    padding: "14px",

                    marginBottom: "10px",

                    borderRadius: "14px",

                    background: n.isRead ? "white" : "#eff6ff",

                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={n.user?.avatar}
                    alt="avatar"
                    style={{
                      width: "42px",

                      height: "42px",

                      borderRadius: "50%",

                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div>{n.message}</div>

                    <div
                      style={{
                        fontSize: "12px",

                        color: "#777",

                        marginTop: "4px",
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

      <br />
      <div
        style={{
          marginTop: "30px",

          background: "#fff",

          border: "1px solid #eee",

          borderRadius: "20px",

          padding: "18px",
        }}
      >
        <button
          onClick={startLive}
          disabled={liveLoading}
          style={{
            width: "100%",

            background: "#000000",

            color: "white",

            border: "none",

            padding: "14px",

            borderRadius: "14px",

            fontWeight: "700",

            cursor: "pointer",

            opacity: liveLoading ? 0.7 : 1,
          }}
        >
          {liveLoading ? "Starting..." : " Go Live"}
        </button>
        <div
          style={{
            marginTop: "20px",
          }}
        >
          <h4>Live Now</h4>

          {lives.length === 0 ? (
            <p>No active lives</p>
          ) : (
            lives.map((live) => (
              <div
                key={live.id}
                style={{
                  padding: "12px 0",

                  borderBottom: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    gap: "10px",

                    alignItems: "center",
                  }}
                >
                  <img
                    src={live.host.avatar}
                    alt="avatar"
                    style={{
                      width: "40px",

                      height: "40px",

                      borderRadius: "50%",

                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <div>{live.host.username}</div>

                    <div
                      style={{
                        fontSize: "13px",

                        color: "#777",
                      }}
                    >
                      {live.title}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (live.zoomJoinUrl) {
                      window.open(
                        live.zoomJoinUrl,

                        "_blank"
                      );
                    } else {
                      alert("Zoom not attached yet");
                    }
                  }}
                  style={{
                    marginTop: "10px",

                    width: "100%",

                    padding: "10px",

                    border: "none",

                    borderRadius: "10px",

                    background: "#111",

                    color: "white",

                    cursor: "pointer",
                  }}
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import api from "../services/api";

import RightChatPanel from "../components/RightChatPanel";

export default function RightSidebar() {
  const [notifications, setNotifications] = useState([]);

  const [unread, setUnread] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();

    loadUnread();
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

      <h3>Live Now</h3>

      <p>Future Feature</p>

      <br />

      <h3>Trending Projects</h3>

      <p>Coming Soon</p>
    </div>
  );
}

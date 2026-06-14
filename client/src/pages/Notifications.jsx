import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import AppLayout from "../layout/AppLayout";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/notifications");

      setNotifications(
        Array.isArray(res.data) ? res.data : res.data.notifications || []
      );
    } catch (err) {
      console.log(err);

      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              isRead: true,
            }
          : notification
      )
    );

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {}
  }

  function handleClick(item) {
    markRead(item.id);

    if (item.link) {
      navigate(item.link);
    }
  }

  function openActorProfile(item, event) {
    event.stopPropagation();

    const actor = item.actor || item.user;

    if (actor?.username) {
      markRead(item.id);
      navigate(`/profile/${actor.username}`);
    }
  }

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
          }}
        >
          Notifications
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((item) => {
            const actor = item.actor || item.user;

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "18px",
                  marginBottom: "14px",
                  border: item.isRead
                    ? "1px solid #e5e7eb"
                    : "1px solid #93c5fd",
                  borderRadius: "14px",
                  background: item.isRead ? "#fff" : "#eff6ff",
                  boxShadow: item.isRead
                    ? "none"
                    : "0 10px 30px rgba(29,155,240,.12)",
                  cursor: item.link ? "pointer" : "default",
                }}
              >
                <button
                  type="button"
                  onClick={(event) => openActorProfile(item, event)}
                  disabled={!actor?.username}
                  style={{
                    width: "52px",
                    height: "52px",
                    padding: 0,
                    border: "none",
                    borderRadius: "50%",
                    background: "transparent",
                    cursor: actor?.username ? "pointer" : "default",
                    flex: "0 0 auto",
                  }}
                >
                  <img
                    src={actor?.avatar || "/default-avatar.png"}
                    alt={actor?.username || "User avatar"}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </button>

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {actor?.username || "Unknown User"}
                  </div>

                  <div>{item.message}</div>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#888",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                {!item.isRead && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#2563eb",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}

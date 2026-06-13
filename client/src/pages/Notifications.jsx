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

      console.log("NOTIFICATIONS ↓", res.data);

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

  function handleClick(item) {
    if (item.link) {
      navigate(item.link);
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
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "18px",
                marginBottom: "14px",
                border: "1px solid #eee",
                borderRadius: "14px",
                background: "#fff",
                cursor: item.link ? "pointer" : "default",
              }}
            >
              <img
                src={item.user?.avatar || "/default-avatar.png"}
                alt=""
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {item.user?.username || "Unknown User"}
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
          ))
        )}
      </div>
    </AppLayout>
  );
}

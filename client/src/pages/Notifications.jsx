import { useEffect, useState } from "react";

import api from "../services/api";

import AppLayout from "../layout/AppLayout";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await api.get("/notifications");

      setNotifications(res.data);
    } catch (err) {
      console.log(err);

      alert("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: "700px",

          margin: "0 auto",
        }}
      >
        <h1>🔔 Notifications</h1>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "18px",

                marginBottom: "14px",

                border: "1px solid #eee",

                borderRadius: "14px",

                background: "#fff",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                }}
              >
                {item.message}
              </div>

              <div
                style={{
                  marginTop: "8px",

                  color: "#888",

                  fontSize: "14px",
                }}
              >
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}

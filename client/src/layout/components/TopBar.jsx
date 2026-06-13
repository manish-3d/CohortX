import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import { useAuth } from "../../context/AuthContext";

export default function TopBar() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [query, setQuery] = useState("");

  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function searchUsers() {
    if (!query.trim()) {
      setUsers([]);

      setOpen(false);

      return;
    }

    try {
      const res = await api.get(`/users/search?q=${query}`);

      setUsers(res.data || []);

      setOpen(true);
    } catch {
      setUsers([]);

      setOpen(false);
    }
  }

  function openProfile(username) {
    setQuery("");

    setUsers([]);

    setOpen(false);

    navigate(`/profile/${username}`);
  }

  return (
    <div
      style={{
        position: "relative",

        height: 88,

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        gap: 20,
      }}
    >
      {/* SEARCH */}

      <div
        style={{
          flex: 1,

          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            background: "#fff",

            border: "1px solid #eff3f4",

            borderRadius: 999,

            height: 58,

            padding: "0 22px",

            gap: 14,
          }}
        >
          <span
            style={{
              fontSize: 22,
            }}
          >
            <Search color="#000000" strokeWidth={1.75} />
          </span>

          <input
            value={query}
            placeholder="Search users..."
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,

              border: 0,

              outline: "none",

              fontSize: 16,

              background: "transparent",
            }}
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");

                setUsers([]);

                setOpen(false);
              }}
              style={{
                border: 0,

                background: "transparent",

                fontSize: 18,

                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {open && users.length > 0 && (
          <div
            style={{
              position: "absolute",

              top: 70,

              left: 0,

              right: 0,

              background: "#fff",

              border: "1px solid #eff3f4",

              borderRadius: 28,

              overflow: "hidden",

              boxShadow: "0 20px 80px rgba(0,0,0,.08)",

              zIndex: 100,
            }}
          >
            {users.map((item) => (
              <div
                key={item.id}
                onClick={() => openProfile(item.username)}
                style={{
                  display: "flex",

                  gap: 14,

                  padding: 18,

                  cursor: "pointer",

                  alignItems: "center",
                }}
              >
                <img
                  src={item.avatar}
                  alt=""
                  style={{
                    width: 52,

                    height: 52,

                    borderRadius: "50%",

                    objectFit: "cover",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {item.username}
                  </div>

                  <div
                    style={{
                      color: "#536471",

                      fontSize: 14,
                    }}
                  >
                    {item.bio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 18,
        }}
      >
        <button
          onClick={() => navigate("/create")}
          style={{
            height: 56,

            padding: "0 30px",

            border: 0,

            borderRadius: 999,

            background: "#0f1419",

            color: "#fff",

            fontWeight: 700,
          }}
        >
          + Create
        </button>

        <img
          src={user?.avatar}
          alt=""
          onClick={() => navigate(`/profile/${user?.username}`)}
          style={{
            width: 52,

            height: 52,

            borderRadius: "50%",

            objectFit: "cover",

            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}

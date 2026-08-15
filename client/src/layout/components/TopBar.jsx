import { useEffect, useRef, useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(searchUsers, 300);
    return () => clearTimeout(t);
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

  function clearSearch() {
    setQuery("");
    setUsers([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 60 }}>
      {/* Search */}
      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            height: 50,
            padding: "0 18px",
            borderRadius: "var(--radius-full)",
            background: focused
              ? "rgba(0, 0, 0, 0.85)"
              : "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: focused
              ? "1.5px solid var(--white-60)"
              : "1.5px solid var(--white-12)",
            boxShadow: focused
              ? "0 0 0 4px var(--white-12), var(--shadow-sm)"
              : "var(--shadow-sm)",
            transition:
              "border-color 0.25s, box-shadow 0.25s, background 0.25s",
          }}
        >
          <Search
            size={18}
            color={focused ? "#ffffff" : "var(--text-muted)"}
            strokeWidth={2}
            style={{ transition: "color 0.25s", flexShrink: 0 }}
          />
          <input
            ref={inputRef}
            value={query}
            placeholder="Search users..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            style={{
              flex: 1,
              border: 0,
              outline: "none",
              fontSize: 14,
              fontWeight: 500,
              background: "transparent",
              color: "#ffffff",
              fontFamily: "inherit",
            }}
          />
          {query && (
            <button
              onClick={clearSearch}
              style={{
                border: 0,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "var(--text-muted)",
                padding: 2,
                borderRadius: "50%",
                transition: "color 0.2s",
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && users.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              right: 0,
              zIndex: 100,
              overflow: "hidden",
              borderRadius: "20px",
              background: "rgba(10, 10, 10, 0.96)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "var(--shadow-lg)",
              animation: "fadeUp 0.25s var(--ease) both",
            }}
          >
            {users.map((item, i) => (
              <div
                key={item.id}
                onClick={() => openProfile(item.username)}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 18px",
                  cursor: "pointer",
                  alignItems: "center",
                  borderBottom:
                    i < users.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--white-07)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <img
                  src={item.avatar}
                  alt=""
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--white-30)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#ffffff",
                    }}
                  >
                    @{item.username}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      marginTop: 2,
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

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("/create")}
          className="dark-btn"
          style={{
            height: 50,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: 14,
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Create
        </button>

        <button
          onClick={() => navigate(`/profile/${user?.username}`)}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
            borderRadius: "50%",
          }}
        >
          <img
            src={user?.avatar}
            alt={user?.username}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid var(--white-30)",
              transition: "border-color 0.25s, box-shadow 0.25s",
              boxShadow: "0 2px 10px var(--white-12)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--blue)";
              e.currentTarget.style.boxShadow = "0 4px 18px var(--blue-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--white-30)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px var(--white-12)";
            }}
          />
        </button>
      </div>
    </div>
  );
}

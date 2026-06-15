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
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: focused
              ? "1.5px solid rgba(29,155,240,0.55)"
              : "1.5px solid rgba(29,155,240,0.15)",
            boxShadow: focused
              ? "0 0 0 4px rgba(29,155,240,0.10), var(--shadow-sm)"
              : "var(--shadow-sm)",
            transition:
              "border-color 0.25s, box-shadow 0.25s, background 0.25s",
          }}
        >
          <Search
            size={18}
            color={focused ? "var(--blue)" : "var(--muted)"}
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
              color: "var(--black)",
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
                color: "var(--muted)",
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
            className="card"
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              right: 0,
              zIndex: 100,
              overflow: "hidden",
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
                      ? "1px solid rgba(29,155,240,0.07)"
                      : "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(29,155,240,0.05)")
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
                    border: "1.5px solid rgba(29,155,240,0.2)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: "var(--black)",
                    }}
                  >
                    @{item.username}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--muted)",
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
              border: "2px solid rgba(29,155,240,0.35)",
              transition: "border-color 0.25s, box-shadow 0.25s",
              boxShadow: "0 2px 10px rgba(29,155,240,0.18)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--blue)";
              e.currentTarget.style.boxShadow = "0 4px 18px var(--blue-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(29,155,240,0.35)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px rgba(29,155,240,0.18)";
            }}
          />
        </button>
      </div>
    </div>
  );
}

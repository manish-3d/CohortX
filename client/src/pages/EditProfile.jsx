import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import api from "../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    githubUsername: "",
    linkedinUrl: "",
    xUrl: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get("/auth/me");
      setForm({
        bio: res.data.bio || "",
        githubUsername: res.data.githubUsername || "",
        linkedinUrl: res.data.linkedinUrl || "",
        xUrl: res.data.xUrl || "",
      });
    } catch {
      alert("Failed to load profile");
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put("/users/profile/edit", form);
      navigate(`/profile/${form.githubUsername || ""}`);
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
          background: "transparent",
          boxSizing: "border-box",
          fontFamily: "'Space Grotesk', sans-serif",
          padding: "30px 16px 80px",
        }}
      >
        {/* Style Matrix Injector */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&display=swap');

          * {
            box-sizing: border-box;
          }
          .gradient-heading {
            font-family: 'Space Grotesk', sans-serif;
            background: linear-gradient(135deg, var(--text) 30%, var(--text-muted) 70%, var(--text-dim) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .premium-input {
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 14px;
            padding: 14px 20px;
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #ffffff;
            outline: none;
            font-size: 15px;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .premium-input:focus {
            border-color: var(--text);
            background: var(--surface);
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
          }
          [data-theme="light"] .premium-input:focus {
            box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.03);
          }
          .premium-input::placeholder {
            color: var(--text-dim);
          }
          .interactive-btn {
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.2s ease;
          }
          .interactive-btn:hover {
            transform: translateY(-1px);
            filter: brightness(1.1);
          }
          .interactive-btn:active {
            transform: translateY(0);
          }
        `}</style>

        {/* Global Floating Layout Container */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Back Navigation Trigger */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="interactive-btn"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "999px",
              padding: "6px 14px",
              color: "#94a3b8",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 24,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            Back
          </button>

          {/* Main Glassmorphic Workspace Container */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              background: "var(--surface)",
              backdropFilter: "blur(24px) saturate(120%)",
              WebkitBackdropFilter: "blur(24px) saturate(120%)",
              border: "1px solid var(--border)",
              borderRadius: 28,
              padding: "40px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div>
              <h1
                className="gradient-heading"
                style={{
                  margin: "0 0 6px 0",
                  fontSize: 40,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                }}
              >
                Shape your identity
              </h1>
              <p
                style={{
                  color: "#64748b",
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Customize how people see your profile.
              </p>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell people what you build..."
                  className="premium-input"
                  style={{ minHeight: 120, resize: "vertical" }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  GitHub Username
                </label>
                <input
                  name="githubUsername"
                  value={form.githubUsername}
                  onChange={handleChange}
                  placeholder="your-github"
                  className="premium-input"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  LinkedIn URL
                </label>
                <input
                  name="linkedinUrl"
                  value={form.linkedinUrl}
                  onChange={handleChange}
                  placeholder="linkedin.com/in/..."
                  className="premium-input"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#64748b",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  X URL
                </label>
                <input
                  name="xUrl"
                  value={form.xUrl}
                  onChange={handleChange}
                  placeholder="x.com/..."
                  className="premium-input"
                />
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              disabled={loading}
              className="interactive-btn"
              style={{
                height: 48,
                width: "100%",
                marginTop: 12,
                border: 0,
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 14,
                color: "var(--bg)",
                fontWeight: 700,
                fontSize: 14,
                background: "var(--text)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                opacity: loading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

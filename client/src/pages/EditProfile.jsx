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

      navigate("/feed");
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",

    height: 62,

    borderRadius: 22,

    border: "1px solid rgba(255,255,255,.9)",

    background: "rgba(255,255,255,.62)",

    backdropFilter: "blur(18px)",

    padding: "0 22px",

    outline: "none",

    fontSize: 15,

    boxSizing: "border-box",
  };

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 900,

          margin: "40px auto",

          padding: 40,

          borderRadius: 38,

          background: "rgba(255,255,255,.55)",

          backdropFilter: "blur(30px)",

          border: "1px solid rgba(255,255,255,.95)",

          boxShadow: "0 30px 90px rgba(29,155,240,.08)",
        }}
      >
        <div
          style={{
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              alignItems: "center",

              gap: 10,

              background: "#eef8ff",

              color: "#1d9bf0",

              padding: "10px 18px",

              borderRadius: 999,

              fontWeight: 700,
            }}
          >
            ✨ Edit Profile
          </div>

          <h1
            style={{
              margin: "18px 0 10px",

              fontSize: 48,
            }}
          >
            Shape your identity
          </h1>

          <p
            style={{
              color: "#64748b",

              fontSize: 18,
            }}
          >
            Customize how people see your profile.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 26,
          }}
        >
          <div>
            <label
              style={{
                fontWeight: 700,
              }}
            >
              Bio
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell people what you build..."
              style={{
                ...inputStyle,

                minHeight: 180,

                padding: 22,

                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontWeight: 700,
              }}
            >
              GitHub Username
            </label>

            <input
              name="githubUsername"
              value={form.githubUsername}
              onChange={handleChange}
              placeholder="your-github"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                fontWeight: 700,
              }}
            >
              LinkedIn URL
            </label>

            <input
              name="linkedinUrl"
              value={form.linkedinUrl}
              onChange={handleChange}
              placeholder="linkedin.com/in/..."
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                fontWeight: 700,
              }}
            >
              X URL
            </label>

            <input
              name="xUrl"
              value={form.xUrl}
              onChange={handleChange}
              placeholder="x.com/..."
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 12,

              height: 68,

              border: 0,

              borderRadius: 999,

              background: "#1d9bf0",

              color: "#fff",

              fontSize: 16,

              fontWeight: 800,

              cursor: "pointer",

              boxShadow: "0 20px 60px rgba(29,155,240,.25)",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

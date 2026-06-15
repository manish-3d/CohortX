import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import api from "../services/api";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
  });

  const [media, setMedia] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [hover, setHover] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  function handleMedia(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setMedia(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (media) {
        fd.append("media", media);
      }

      await api.post("/projects", fd);

      navigate("/feed");
    } catch {
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  }

  const input = {
    width: "100%",

    height: 62,

    border: "1px solid rgba(255,255,255,.95)",

    borderRadius: 22,

    padding: "0 22px",

    background: "rgba(255,255,255,.72)",

    backdropFilter: "blur(20px)",

    outline: "none",

    fontSize: 15,

    boxSizing: "border-box",
  };

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 1080,

          margin: "40px auto",

          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "grid",

            gridTemplateColumns: "220px 1fr",

            gap: 36,

            alignItems: "start",
          }}
        >
          <label
            htmlFor="media"
            style={{
              cursor: "pointer",
            }}
          >
            <input
              hidden
              id="media"
              type="file"
              accept="image/*,video/*"
              onChange={handleMedia}
            />

            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                width: "100%",

                aspectRatio: "1 / 1",

                borderRadius: 28,

                overflow: "hidden",

                position: "relative",

                transform: hover ? "translateY(-4px)" : "",

                transition: ".25s",

                background: "rgba(255,255,255,.7)",

                backdropFilter: "blur(30px)",

                border: hover
                  ? "1px solid rgba(29,155,240,.45)"
                  : "1px solid rgba(255,255,255,.95)",

                boxShadow: "0 20px 60px rgba(29,155,240,.08)",
              }}
            >
              {!preview ? (
                <div
                  style={{
                    position: "absolute",

                    inset: 0,

                    display: "flex",

                    flexDirection: "column",

                    justifyContent: "center",

                    alignItems: "center",

                    textAlign: "center",

                    height: "100%",

                    transform: "translateY(-8px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 64,

                      lineHeight: 1,

                      marginBottom: 18,

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",
                    }}
                  >
                    +
                  </div>

                  <h3
                    style={{
                      margin: "0 0 10px",

                      fontSize: 32,

                      fontWeight: 800,

                      color: "#071326",
                    }}
                  >
                    Add Cover
                  </h3>

                  <p
                    style={{
                      color: "#64748b",

                      fontSize: 15,
                    }}
                  >
                    Click to upload
                  </p>
                </div>
              ) : media?.type.startsWith("video") ? (
                <video
                  controls
                  src={preview}
                  style={{
                    width: "100%",

                    height: "100%",

                    objectFit: "cover",
                  }}
                />
              ) : (
                <img
                  src={preview}
                  alt=""
                  style={{
                    width: "100%",

                    height: "100%",

                    objectFit: "cover",
                  }}
                />
              )}

              {preview && (
                <div
                  style={{
                    position: "absolute",

                    left: 14,

                    right: 14,

                    bottom: 14,

                    padding: 14,

                    borderRadius: 18,

                    background: "rgba(0,0,0,.18)",

                    color: "#fff",

                    backdropFilter: "blur(20px)",
                  }}
                >
                  {form.title || "Project"}
                </div>
              )}
            </div>
          </label>

          <form onSubmit={handleSubmit}>
            <h1
              style={{
                fontSize: 58,

                margin: "0 0 8px",

                color: "#071326",
              }}
            >
              Create Project
            </h1>

            <p
              style={{
                color: "#64748b",

                marginBottom: 28,
              }}
            >
              Share your work beautifully.
            </p>

            <div
              style={{
                display: "grid",

                gap: 18,
              }}
            >
              <input
                name="title"
                placeholder="Project title"
                value={form.title}
                onChange={handleChange}
                style={input}
              />

              <textarea
                name="description"
                placeholder="Describe project"
                value={form.description}
                onChange={handleChange}
                style={{
                  ...input,

                  minHeight: 180,

                  padding: 22,

                  resize: "vertical",
                }}
              />

              <input
                name="githubUrl"
                placeholder="GitHub URL"
                value={form.githubUrl}
                onChange={handleChange}
                style={input}
              />

              <input
                name="demoUrl"
                placeholder="Live Demo URL"
                value={form.demoUrl}
                onChange={handleChange}
                style={input}
              />
            </div>

            <button
              disabled={loading}
              style={{
                width: "100%",

                height: 68,

                marginTop: 28,

                border: 0,

                borderRadius: 999,

                background: "#1d9bf0",

                color: "#fff",

                fontWeight: 800,

                fontSize: 16,

                cursor: "pointer",

                boxShadow: "0 20px 60px rgba(29,155,240,.18)",
              }}
            >
              {loading ? "Publishing..." : "Publish Project"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

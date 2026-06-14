import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

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

  const [preview, setPreview] = useState(null);

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

    border: "1px solid rgba(255,255,255,.9)",

    borderRadius: 22,

    padding: "0 22px",

    background: "rgba(255,255,255,.55)",

    backdropFilter: "blur(20px)",

    outline: "none",

    fontSize: 15,

    boxSizing: "border-box",
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: 900,

          margin: "40px auto",

          padding: 36,

          background: "rgba(255,255,255,.55)",

          backdropFilter: "blur(30px)",

          border: "1px solid rgba(0, 0, 0, 0.9)",

          borderRadius: 36,

          boxShadow: "0 30px 90px rgba(29,155,240,.08)",
        }}
      >
        <div
          style={{
            marginBottom: 34,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              padding: "10px 18px",

              borderRadius: 999,

              background: "#eef8ff",

              color: "#1d9bf0",

              fontWeight: 700,
            }}
          >
            + Create Project
          </div>

          <h1
            style={{
              fontSize: 52,

              margin: "18px 0 10px",
            }}
          >
            Launch something beautiful
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Share your work with the world.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="media"
            style={{
              display: "block",

              cursor: "pointer",
            }}
          >
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                width: "100%",

                height: 420,

                borderRadius: 30,

                overflow: "hidden",

                background: "#f8fcff",

                border: hover ? "2px solid #1d9bf0" : "2px dashed #cde8ff",

                transition: ".25s",

                transform: hover ? "scale(1.01)" : "scale(1)",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
              }}
            >
              {!preview ? (
                <div
                  style={{
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 74,

                      marginBottom: 12,
                    }}
                  >
                    +ADD
                  </div>

                  <h2>Upload Project</h2>

                  <p
                    style={{
                      color: "#64748b",
                    }}
                  >
                    Image or video
                  </p>
                </div>
              ) : media?.type.startsWith("video") ? (
                <video
                  src={preview}
                  controls
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
            </div>
          </label>

          <input
            hidden
            id="media"
            type="file"
            accept="image/*,video/*"
            onChange={handleMedia}
          />

          <div
            style={{
              display: "grid",

              gap: 18,

              marginTop: 26,
            }}
          >
            <input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
              style={input}
            />

            <textarea
              name="description"
              placeholder="Describe your project"
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

              transition: ".25s",

              boxShadow: "0 20px 60px rgba(29,155,240,.25)",
            }}
          >
            {loading ? "Publishing..." : "Publish Project"}
          </button>
        </form>
      </div>
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";

import api from "../services/api";

export default function CreateStory() {
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);

  const [preview, setPreview] = useState("");

  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(false);

  function handleMedia(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setMedia(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!media) {
      return alert("Select media");
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append("media", media);

      form.append("caption", caption);

      await api.post("/stories", form);

      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: 760,

          margin: "40px auto",

          padding: 34,

          borderRadius: 36,

          background: "rgba(255,255,255,.56)",

          backdropFilter: "blur(30px)",

          border: "1px solid rgba(255,255,255,.95)",

          boxShadow: "0 30px 80px rgba(29,155,240,.08)",
        }}
      >
        <div
          style={{
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              padding: "10px 18px",

              borderRadius: 999,

              background: "#edf8ff",

              color: "#1d9bf0",

              fontWeight: 700,
            }}
          >
            ✨ New Story
          </div>

          <h1
            style={{
              fontSize: 48,

              margin: "18px 0 8px",
            }}
          >
            Share Story
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Post moments for your audience.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "block",

              cursor: "pointer",
            }}
          >
            <input
              hidden
              type="file"
              accept="image/*,video/*"
              onChange={handleMedia}
            />

            <div
              style={{
                width: "100%",

                height: 420,

                borderRadius: 30,

                border: "2px dashed #b9def8",

                background: "#f8fcff",

                overflow: "hidden",

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
                      fontSize: 70,
                    }}
                  >
                    ☁️
                  </div>

                  <h2>Upload Story</h2>

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

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something..."
            style={{
              width: "100%",

              marginTop: 24,

              minHeight: 140,

              padding: 22,

              borderRadius: 24,

              border: "1px solid rgba(255,255,255,.9)",

              background: "rgba(255,255,255,.65)",

              backdropFilter: "blur(20px)",

              resize: "vertical",

              boxSizing: "border-box",
            }}
          />

          <button
            disabled={loading}
            style={{
              width: "100%",

              height: 68,

              marginTop: 24,

              border: 0,

              borderRadius: 999,

              background: "#1d9bf0",

              color: "#fff",

              fontWeight: 800,

              fontSize: 16,

              boxShadow: "0 20px 60px rgba(29,155,240,.25)",
            }}
          >
            {loading ? "Posting..." : "Post Story"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}

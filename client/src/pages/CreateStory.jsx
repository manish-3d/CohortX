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

  // Core media upload pipeline
  function handleMedia(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMedia(file);
    setPreview(URL.createObjectURL(file));
  }

  // Submit handler targeting server endpoint
  async function handleSubmit(e) {
    e.preventDefault();
    if (!media) {
      alert("Select media");
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("media", media);
      fd.append("caption", caption);

      await api.post("/stories", fd);
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
            background: linear-gradient(135deg, #ffffff 30%, #1d9bf0 70%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .premium-textarea {
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #ffffff;
            outline: none;
            font-size: 15px;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .premium-textarea:focus {
            border-color: rgba(29, 155, 240, 0.5);
            background: rgba(15, 23, 42, 0.4);
            box-shadow: 0 0 0 4px rgba(29, 155, 240, 0.12);
          }
          .premium-textarea::placeholder {
            color: #4b5563;
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

          @media (max-width: 968px) {
            .story-grid {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
            .story-preview-wrapper {
              max-width: 320px;
              margin: 0 auto;
            }
          }
        `}</style>

        {/* Global Floating Layout Container */}
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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

          {/* Main Glassmorphic Workspace Grid */}
          <form
            onSubmit={handleSubmit}
            className="story-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 440px",
              gap: 40,
              background: "rgba(13, 20, 38, 0.35)",
              backdropFilter: "blur(24px) saturate(120%)",
              WebkitBackdropFilter: "blur(24px) saturate(120%)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 28,
              padding: "32px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Left Column: Context Previewer Box */}
            <div
              className="story-preview-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label
                style={{ cursor: "pointer", width: "100%", maxWidth: 340 }}
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
                    aspectRatio: "9/16",
                    borderRadius: 24,
                    overflow: "hidden",
                    position: "relative",
                    background: "rgba(255, 255, 255, 0.01)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: "inset 0 0 20px rgba(29, 155, 240, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!preview ? (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(29, 155, 240, 0.08), transparent)",
                          pointerEvents: "none",
                        }}
                      />

                      <div
                        style={{ textAlign: "center", padding: 20, zIndex: 1 }}
                      >
                        <div
                          style={{
                            color: "#1d9bf0",
                            fontSize: 48,
                            fontWeight: 300,
                            marginBottom: 8,
                          }}
                        >
                          ＋
                        </div>
                        <h3
                          style={{
                            color: "#ffffff",
                            margin: "0 0 6px 0",
                            fontSize: 18,
                            fontWeight: 600,
                          }}
                        >
                          Create Story
                        </h3>
                        <p
                          style={{
                            color: "#4b5563",
                            margin: 0,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Tap to select asset
                        </p>
                      </div>
                    </>
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

                  {/* Floating Caption Overrides */}
                  {preview && (
                    <div
                      style={{
                        position: "absolute",
                        left: 14,
                        right: 14,
                        bottom: 14,
                        padding: "12px 16px",
                        color: "#ffffff",
                        borderRadius: 14,
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        background: "rgba(11, 17, 30, 0.7)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        fontSize: 12,
                        wordBreak: "break-word",
                      }}
                    >
                      {caption || "Dynamic layout preview data..."}
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Right Column: Text Entry and Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div>
                <h1
                  className="gradient-heading"
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: 44,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Story Studio
                </h1>
                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  Broadcast instant, raw developer logs and telemetry parameters
                  directly into the environment flow layout.
                </p>
              </div>

              {/* Functional Entry Block */}
              <div style={{ marginTop: 32 }}>
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
                  Telemetry Log Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Type something descriptive or paste code updates..."
                  className="premium-textarea"
                  style={{ minHeight: 140, resize: "none" }}
                />
              </div>

              {/* Action Trigger Button - Solid Premium Layout */}
              <button
                disabled={loading}
                className="interactive-btn"
                style={{
                  height: 48,
                  width: "100%",
                  marginTop: 20,
                  border: 0,
                  cursor: loading ? "not-allowed" : "pointer",
                  borderRadius: 14,
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 14,
                  background: "#1d9bf0",
                  boxShadow: "0 10px 25px rgba(29, 155, 240, 0.15)",
                  opacity: loading ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading
                  ? "Publishing Environment State..."
                  : "Broadcast Story Target"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

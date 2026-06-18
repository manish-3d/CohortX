import { useState, useEffect, useRef } from "react";
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

  const canvasRef = useRef(null);

  // Deep Cosmic Galaxy & Star Particle Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    const maxStars = 80;

    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        phase: Math.random() * Math.PI,
        color:
          Math.random() > 0.4
            ? "#fff"
            : Math.random() > 0.5
              ? "#7cc8ff"
              : "#a855f7",
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.3,
        10,
        canvas.width * 0.7,
        canvas.height * 0.3,
        canvas.width * 0.6
      );
      gradient.addColorStop(0, "rgba(29, 155, 240, 0.03)");
      gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.01)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const alpha = ((Math.sin(star.phase) + 1) / 2) * 0.6 + 0.2;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

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
        }}
      >
        {/* Font CDN Import & Glassmorphism Rules */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');

          * {
            box-sizing: border-box;
          }
          .premium-input {
            width: 100%;
            height: 44px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            padding: 0 14px;
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #ffffff;
            outline: none;
            font-size: 14px;
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .premium-input:focus {
            border-color: rgba(29, 155, 240, 0.5);
            background: rgba(15, 23, 42, 0.4);
            box-shadow: 0 0 0 4px rgba(29, 155, 240, 0.12);
          }
          .premium-input::placeholder {
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
          
          @media (max-width: 768px) {
            .composer-layout {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            .media-uploader-box {
              max-width: 200px;
              margin: 0 auto;
            }
            .page-title {
              font-size: 30px !important;
            }
          }
        `}</style>

        {/* Shimmering Dynamic Star Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Floating Content Matrix Layer */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            maxWidth: 800,
            margin: "0 auto",
            padding: "30px 16px 80px",
          }}
        >
          {/* Transparent Glass Back Control */}
          <button
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
              marginBottom: 20,
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            Back
          </button>

          {/* Ultra-Transparent Glass Composer Container */}
          <div
            style={{
              background: "rgba(13, 20, 38, 0.35)",
              backdropFilter: "blur(24px) saturate(120%)",
              WebkitBackdropFilter: "blur(24px) saturate(120%)",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              borderRadius: 24,
              padding: "28px",
              boxShadow:
                "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Header Module */}
            <div
              style={{
                marginBottom: 24,
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                paddingBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 4,
                }}
              >
                <h1
                  className="page-title"
                  style={{
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Create Project
                </h1>
                <div
                  style={{
                    background: "rgba(168, 85, 247, 0.12)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    color: "#c084fc",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Composer
                </div>
              </div>
              <p style={{ color: "#64748b", margin: 0, fontSize: 13 }}>
                Design and ship your workspace showcase asset.
              </p>
            </div>

            {/* Split Composer Grid */}
            <div
              className="composer-layout"
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 28,
                alignItems: "start",
              }}
            >
              {/* Media Dropper Block */}
              <label
                htmlFor="media"
                className="media-uploader-box"
                style={{ cursor: "pointer", display: "block" }}
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
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                    transform: hover ? "translateY(-2px)" : "",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    background: "rgba(255, 255, 255, 0.01)",
                    border: hover
                      ? "1px solid rgba(29, 155, 240, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.05)",
                    boxShadow: hover
                      ? "0 12px 30px rgba(29, 155, 240, 0.1)"
                      : "none",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!preview ? (
                    <div
                      style={{
                        padding: 12,
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 300,
                          color: "#4b5563",
                          marginBottom: 4,
                        }}
                      >
                        +
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#e2e8f0",
                          display: "block",
                          marginBottom: 2,
                        }}
                      >
                        Cover Asset
                      </span>
                      <span style={{ fontSize: 10, color: "#4b5563" }}>
                        IMG / MP4
                      </span>
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
                        inset: "auto 8px 8px 8px",
                        padding: "6px 10px",
                        borderRadius: 8,
                        background: "rgba(11, 17, 30, 0.65)",
                        color: "#fff",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        fontSize: 10,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "center",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {form.title || "Untitled"}
                    </div>
                  )}
                </div>
              </label>

              {/* Data Form Entry Segment */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Project Identity
                  </label>
                  <input
                    name="title"
                    placeholder="Enter project name..."
                    value={form.title}
                    onChange={handleChange}
                    className="premium-input"
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#64748b",
                      marginBottom: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Core Scope Blueprint
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe engineering stack and parameters..."
                    value={form.description}
                    onChange={handleChange}
                    className="premium-input"
                    style={{
                      minHeight: 90,
                      padding: "10px 14px",
                      resize: "vertical",
                      height: "auto",
                    }}
                  />
                </div>

                {/* Grid Input Link Mapping */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Repository Link
                    </label>
                    <input
                      name="githubUrl"
                      placeholder="https://github.com/..."
                      value={form.githubUrl}
                      onChange={handleChange}
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
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Live Link
                    </label>
                    <input
                      name="demoUrl"
                      placeholder="https://demo.dev..."
                      value={form.demoUrl}
                      onChange={handleChange}
                      className="premium-input"
                    />
                  </div>
                </div>

                {/* Form Action Fire Trigger */}
                <button
                  disabled={loading}
                  className="interactive-btn"
                  style={{
                    width: "100%",
                    height: 44,
                    marginTop: 8,
                    border: 0,
                    borderRadius: 12,
                    background: "#1d9bf0",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 10px 20px rgba(29,155,240,0.15)",
                    opacity: loading ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loading
                    ? "Deploying Artifact..."
                    : "Publish Environment Target"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

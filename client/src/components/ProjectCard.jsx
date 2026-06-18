import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    const ok = window.confirm("Delete project?");
    if (!ok) return;

    try {
      await api.delete(`/projects/${project.id}`);
      window.location.reload();
    } catch {
      alert("Delete failed");
    }
  }

  return (
    <div
      className="card"
      style={{
        position: "relative",
        width: "100%",
        /* Completely transparent pristine glassmorphism framework */
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(16px) saturate(140%)",
        WebkitBackdropFilter: "blur(16px) saturate(140%)",
        border: "1px solid rgba(29, 155, 240, 0.15)",
        borderRadius: "var(--radius-xl)",
        color: "var(--text)",
        overflow: "hidden",
        marginBottom: "13px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* HEADER BLOCK */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "13px 15px",
          borderBottom: "1px solid rgba(29, 155, 240, 0.08)",
          background: "rgba(255, 255, 255, 0.01)",
        }}
      >
        <div
          onClick={() => navigate(`/profile/${project.author?.username}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
            cursor: "pointer",
          }}
        >
          <img
            src={project.author?.avatar}
            alt="avatar"
            style={{
              width: "39px",
              height: "39px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(29, 155, 240, 0.2)",
            }}
          />

          <div>
            <div
              style={{
                fontFamily: "'Hookride', 'Space Grotesk', sans-serif",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: "0.02em",
                color: "var(--text)",
              }}
            >
              @{project.author?.username}
            </div>

            <div
              style={{
                fontSize: "10.5px",
                color: "var(--text-dim)",
                marginTop: "1px",
              }}
            >
              {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* SYSTEM DROP CONTROLS */}
        {user?.id === project.authorId && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(!open)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "18px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              ⋮
            </button>

            {open && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "rgba(4, 18, 34, 0.96)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(29, 155, 240, 0.35)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  minWidth: "110px",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={() => navigate(`/projects/edit/${project.id}`)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    color: "var(--text)",
                    fontFamily: "'Hookride', sans-serif",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(29, 155, 240, 0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "transparent",
                    border: "none",
                    textAlign: "left",
                    color: "#ff4a5a",
                    fontFamily: "'Hookride', sans-serif",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderTop: "1px solid rgba(29, 155, 240, 0.08)",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "rgba(255, 74, 90, 0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "transparent")
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* METADATA DESCRIPTIVE AREA */}
      <div style={{ padding: "15px" }}>
        <h2
          style={{
            fontFamily: "'Hookride', 'Space Grotesk', sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--white)",
            letterSpacing: "0.01em",
            marginBottom: "5px",
          }}
        >
          {project.title}
        </h2>

        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          {project.description}
        </p>
      </div>

      {/* COMPONENT RESOURCE RENDERS */}
      {project.mediaType === "image" && (
        <img
          src={project.mediaUrl}
          alt="project"
          style={{
            width: "100%",
            display: "block",
            borderTop: "1px solid rgba(29, 155, 240, 0.06)",
            borderBottom: "1px solid rgba(29, 155, 240, 0.06)",
          }}
        />
      )}

      {project.mediaType === "video" && (
        <video
          controls
          src={project.mediaUrl}
          style={{
            width: "100%",
            display: "block",
            borderTop: "1px solid rgba(29, 155, 240, 0.06)",
            borderBottom: "1px solid rgba(29, 155, 240, 0.06)",
          }}
        />
      )}

      {/* ACTION BAR */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          padding: "12px 15px",
          background: "rgba(255, 255, 255, 0.01)",
          borderTop: "1px solid rgba(29, 155, 240, 0.06)",
        }}
      >
        <LikeButton
          projectId={project.id}
          initialLikes={project._count?.likes || 0}
          initialLiked={project.liked}
        />

        <CommentSection
          projectId={project.id}
          count={project._count?.comments || 0}
        />
      </div>
    </div>
  );
}

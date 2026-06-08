
import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import api
from "../services/api";

import LikeButton
from "./LikeButton";

import CommentSection
from "./CommentSection";

export default function ProjectCard({
  project,
}) {
  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const [open, setOpen] =
    useState(false);

  async function handleDelete() {
    const ok =
      window.confirm(
        "Delete project?"
      );

    if (!ok) {
      return;
    }

    try {
      await api.delete(
        `/projects/${project.id}`
      );

      window.location.reload();

    } catch {
      alert(
        "Delete failed"
      );
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: "18px",
        overflow: "hidden",
        marginBottom: "28px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          padding: "18px",
        }}
      >
        <div
          onClick={() =>
            navigate(
              `/profile/${project.author?.username}`
            )
          }
          style={{
            display: "flex",
            gap: "14px",
            cursor: "pointer",
          }}
        >
          <img
            src={
              project.author
                ?.avatar
            }
            alt="avatar"
            style={{
              width: "52px",
              height: "52px",
              borderRadius:
                "50%",
              objectFit:
                "cover",
            }}
          />

          <div>
            <div
              style={{
                fontWeight:
                  "700",
              }}
            >
              @
              {
                project.author
                  ?.username
              }
            </div>

            <div>
              {new Date(
                project.createdAt
              ).toLocaleDateString()}
            </div>
          </div>
        </div>

        {user?.id ===
          project.authorId && (
          <div
            style={{
              position:
                "relative",
            }}
          >
            <button
              onClick={() =>
                setOpen(
                  !open
                )
              }
              style={{
                background:
                  "transparent",
                color:
                  "#111",
                fontSize:
                  "24px",
                padding: 0,
              }}
            >
              ⋮
            </button>

            {open && (
              <div
                style={{
                  position:
                    "absolute",
                  top: "110%",
                  right: 0,
                  background:
                    "#fff",
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "12px",
                  overflow:
                    "hidden",
                  minWidth:
                    "120px",
                }}
              >
                <button
                  onClick={() =>
                    navigate(
                      `/projects/edit/${project.id}`
                    )
                  }
                  style={{
                    width:
                      "100%",
                    background:
                      "white",
                    color:
                      "black",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={
                    handleDelete
                  }
                  style={{
                    width:
                      "100%",
                    background:
                      "white",
                    color:
                      "red",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          padding:
            "20px",
        }}
      >
        <h2>
          {project.title}
        </h2>

        <p>
          {
            project.description
          }
        </p>
      </div>

      {project.mediaType ===
        "image" && (
        <img
          src={
            project.mediaUrl
          }
          alt="project"
          style={{
            width:
              "100%",
          }}
        />
      )}

      {project.mediaType ===
        "video" && (
        <video
          controls
          src={
            project.mediaUrl
          }
          style={{
            width:
              "100%",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          gap: "18px",
          padding:
            "18px",
          borderTop:
            "1px solid #eee",
        }}
      >
        <LikeButton
          projectId={
            project.id
          }
          initialLikes={
            project._count
              ?.likes || 0
          }
          initialLiked={
            Boolean(
              project.liked
            )
          }
        />

        <CommentSection
          projectId={
            project.id
          }
          count={
            project._count
              ?.comments ||
            0
          }
        />
      </div>
    </div>
  );
}


import {
  useNavigate,
} from "react-router-dom";

import LikeButton
from "./LikeButton";

import CommentSection
from "./CommentSection";

export default function ProjectCard({
  project,
}) {
  const navigate =
    useNavigate();

  return (

    <div

      role="link"

      tabIndex={0}

      onClick={() =>
        navigate(
          `/projects/${project.id}`
        )
      }

      onKeyDown={(e) => {
        if (
          e.key === "Enter" ||
          e.key === " "
        ) {
          navigate(
            `/projects/${project.id}`
          );
        }
      }}

      style={{
        textDecoration:
          "none",

        color:
          "inherit",

        display:
          "block",

        cursor:
          "pointer",
      }}

    >

      <div

        style={{

          background:
            "rgba(255,255,255,.94)",

          backdropFilter:
            "blur(18px)",

          border:
            "1px solid rgba(255,255,255,.72)",

          borderRadius:
            "18px",

          overflow:
            "hidden",

          marginBottom:
            "28px",

          boxShadow:
            "0 24px 70px rgba(15,23,42,.16), 0 1px 0 rgba(255,255,255,.9) inset",

        }}

      >

        {/* HEADER */}

        <div

          style={{

            display:
              "flex",

            alignItems:
              "center",

            padding:
              "18px 20px",

          }}

        >

          <img

            src={
              project.author
                ?.avatar
            }

            alt="avatar"

            style={{

              width:
                "52px",

              height:
                "52px",

              borderRadius:
                "50%",

              objectFit:
                "cover",

            }}

          />

          <div
            style={{
              marginLeft:
                "14px",
            }}
          >

            <div
              style={{
                fontWeight:
                  "700",

                fontSize:
                  "18px",
              }}
            >
              @
              {
                project.author
                  ?.username
              }
            </div>

            <div
              style={{
                color:
                  "#777",

                fontSize:
                  "14px",
              }}
            >
              {
                new Date(
                  project.createdAt
                )
                .toLocaleDateString()
              }
            </div>

          </div>

        </div>

        {/* CONTENT */}

        <div
          style={{
            padding:
              "0 22px",
          }}
        >

          <h2>
            {
              project.title
            }
          </h2>

          <p

            style={{

              color:
                "#444",

              lineHeight:
                "1.8",

            }}

          >
            {
              project.description
            }
          </p>

        </div>

        {/* MEDIA */}

        {
          project.mediaType ===
            "image"

          &&

          <img

            src={
              project.mediaUrl
            }

            alt="project"

            style={{

              width:
                "100%",

              maxHeight:
                "700px",

              objectFit:
                "cover",

            }}

          />

        }

        {
          project.mediaType ===
            "video"

          &&

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

        }

        {/* LINKS */}

        <div

          style={{

            display:
              "flex",

            gap:
              "16px",

            padding:
              "18px 22px",

          }}

          onClick={
            (
              e
            ) =>
              e.stopPropagation()
          }

        >

          {
            project.githubUrl && (

              <a

                href={
                  project.githubUrl
                }

                target="_blank"

                rel="noreferrer"

              >

                GitHub

              </a>

            )
          }

          {
            project.demoUrl && (

              <a

                href={
                  project.demoUrl
                }

                target="_blank"

                rel="noreferrer"

              >

                Live Demo

              </a>

            )
          }

        </div>

        {/* ACTIONS */}

        <div

          style={{

            display:
              "flex",

            gap:
              "20px",

            padding:
              "18px 22px",

            borderTop:
              "1px solid #eee",

          }}

          onClick={
            (
              e
            ) =>
              e.stopPropagation()
          }

        >

          <LikeButton

            projectId={
              project.id
            }

            initialLikes={
              project
                ._count
                ?.likes || 0
            }

            initialLiked={
              Boolean(
                project.liked ||
                project
                  .likes
                  ?.length > 0
              )
            }

          />

          <CommentSection

            projectId={
              project.id
            }

            count={
              project
                ._count
                ?.comments || 0
            }

          />

        </div>

      </div>

    </div>

  );

}

import { Link } from "react-router-dom";

import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

export default function ProjectCard({
  project,
}) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",

        padding: "24px",

        marginBottom: "24px",

        background: "#fff",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
        }}
      >
        {project.title}
      </h2>

      <p
        style={{
          marginBottom: "20px",
        }}
      >
        {project.description}
      </p>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        By{" "}

        <Link
          to={`/profile/${project.author.username}`}
        >
          @{project.author.username}
        </Link>
      </div>

      <div
        style={{
          display: "flex",

          gap: "20px",

          alignItems:
            "center",

          marginBottom:
            "20px",
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
              project.likes
                ?.length
            )
          }
        />

        <span>
          💬{" "}
          {
            project._count
              ?.comments || 0
          }
        </span>
      </div>

      {(project.githubUrl ||
        project.demoUrl) && (
        <div
          style={{
            marginBottom:
              "20px",
          }}
        >
          {project.githubUrl && (
            <a
              href={
                project.githubUrl
              }
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}

          {"  "}

          {project.demoUrl && (
            <a
              href={
                project.demoUrl
              }
              target="_blank"
              rel="noreferrer"
            >
              Live Demo
            </a>
          )}
        </div>
      )}

     <CommentSection
projectId={
project.id
}

count={
project._count
?.comments
}
/>
    </div>
  );
}

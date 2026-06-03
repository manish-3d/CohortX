import {
  Link,
} from "react-router-dom";

import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

export default function ProjectCard({
  project,
}) {
  const author =
    project.author || {};

  const initial =
    author.username?.[0] || "B";

  return (
    <article className="post-card">
      <Link
        className="avatar"
        to={`/profile/${author.username}`}
      >
        {initial}
      </Link>

      <div>
        <div className="post-head">
          <Link
            className="account-name"
            to={`/profile/${author.username}`}
          >
            {author.username || "Builder"}
          </Link>

          <span className="post-meta">
            @{author.username || "cohortx"}
          </span>

          <span className="post-meta">
            · now
          </span>
        </div>

        <h2 className="post-title">
          {project.title}
        </h2>

        <p className="post-body">
          {project.description}
        </p>

        {(project.githubUrl ||
          project.demoUrl) && (
          <div className="post-links">
            {project.githubUrl && (
              <a
                className="link-chip"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}

            {project.demoUrl && (
              <a
                className="link-chip"
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
            )}
          </div>
        )}

        <div className="post-actions">
          <LikeButton
            projectId={project.id}
            initialLikes={
              project._count?.likes || 0
            }
          />

          <span className="action-button">
            Comments{" "}
            {project._count?.comments || 0}
          </span>
        </div>

        <CommentSection
          projectId={project.id}
        />
      </div>
    </article>
  );
}

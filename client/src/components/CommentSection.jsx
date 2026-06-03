import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

export default function CommentSection({
  projectId,
}) {
  const [
    comments,
    setComments,
  ] = useState([]);

  const [
    content,
    setContent,
  ] = useState("");

  useEffect(() => {
    async function loadComments() {
      try {
        const res =
          await api.get(
            `/projects/${projectId}/comments`
          );

        setComments(
          res.data
        );
      } catch (err) {
        alert(
          err.response
            ?.data
            ?.message ||
          err.response
            ?.data
            ?.error ||
          "Failed to load comments"
        );
      }
    }

    loadComments();
  }, [
    projectId,
  ]);

  async function addComment() {
    const trimmed =
      content.trim();

    if (!trimmed) {
      return;
    }

    try {
      const res =
        await api.post(
          `/projects/${projectId}/comments`,
          {
            content: trimmed,
          }
        );

      setComments((prev) => [
        res.data,
        ...prev,
      ]);

      setContent("");
    } catch (err) {
      alert(
        err.response
          ?.data
          ?.message ||
        err.response
          ?.data
          ?.error ||
        "Comment failed"
      );
    }
  }

  return (
    <section className="comment-section">
      <h3 className="comment-title">
        Join the thread
      </h3>

      <div className="comment-form">
        <input
          placeholder="Post a thoughtful reply"
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
        />

        <button
          className="primary-button"
          onClick={addComment}
          type="button"
        >
          Reply
        </button>
      </div>

      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map((comment) => (
            <div
              className="comment-item"
              key={comment.id}
            >
              <strong>
                @{comment.user?.username || "builder"}
              </strong>

              <p>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

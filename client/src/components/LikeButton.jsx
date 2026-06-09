import { useEffect, useState } from "react";

import api from "../services/api";

export default function LikeButton({
  projectId,

  initialLikes = 0,

  initialLiked = false,
}) {
  const [likes, setLikes] = useState(initialLikes);

  const [liked, setLiked] = useState(initialLiked);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);

    setLiked(initialLiked);
  }, [projectId, initialLikes, initialLiked]);

  async function handleToggle() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(`/projects/${projectId}/like/toggle`);

      setLikes(res.data.likesCount);

      setLiked(res.data.liked);
    } catch (err) {
      console.log(err);

      alert("Failed to update like");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={liked}
      style={{
        border: "none",

        background: "transparent",

        display: "flex",

        alignItems: "center",

        gap: "8px",

        cursor: loading ? "not-allowed" : "pointer",

        padding: "6px 0",
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        style={{
          width: "24px",

          height: "24px",

          transition: ".25s",

          transform: liked ? "scale(1.1)" : "scale(1)",

          fill: liked ? "#2563eb" : "none",

          stroke: liked ? "#2563eb" : "#9ca3af",
        }}
      >
        <path
          d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span
        style={{
          fontSize: "15px",

          fontWeight: "600",

          color: liked ? "#264edc" : "#555",
        }}
      >
        {loading ? "..." : likes}
      </span>
    </button>
  );
}

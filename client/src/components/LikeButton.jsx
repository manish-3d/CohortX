import { useState } from "react";

import api from "../services/api";

export default function LikeButton({
  projectId,
  initialLikes = 0,
  initialLiked = false,
}) {
  const [likes, setLikes] =
    useState(initialLikes);

  const [liked, setLiked] =
    useState(initialLiked);

  const [loading, setLoading] =
    useState(false);

  async function handleToggle() {
    try {
      setLoading(true);

      const res =
        await api.post(
          `/projects/${projectId}/like/toggle`
        );

      setLikes(
        res.data.likesCount
      );

      setLiked(
        res.data.liked
      );

    } catch (err) {
      console.log(err);

      alert(
        "Failed to update like"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={
        handleToggle
      }

      disabled={
        loading
      }

      aria-pressed={
        liked
      }

      style={{
        cursor:
          loading
            ? "not-allowed"
            : "pointer",

        background:
          liked
            ? "#dc2626"
            : "black",
      }}
    >
      {loading
        ? "..."
        : `${liked ? "Liked" : "Like"} ${likes}`}
    </button>
  );
}

import {
  useState,
} from "react";

import api from "../services/api";

export default function LikeButton({
  projectId,
  initialLikes,
}) {
  const [
    likes,
    setLikes,
  ] = useState(initialLikes);

  async function handleLike() {
    try {
      await api.post(
        `/projects/${projectId}/like`
      );

      setLikes(
        (prev) =>
          prev + 1
      );
    } catch {
      alert(
        "Already liked"
      );
    }
  }

  return (
    <button
      className="action-button"
      onClick={handleLike}
      type="button"
    >
      Like {likes}
    </button>
  );
}

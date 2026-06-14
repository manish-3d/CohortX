import { useState } from "react";

import api from "../services/api";

export default function FollowButton({ userId }) {
  const [following, setFollowing] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    try {
      setLoading(true);

      if (following) {
        await api.delete(`/users/${userId}/follow`);

        setFollowing(false);
      } else {
        await api.post(`/users/${userId}/follow`);

        setFollowing(true);
      }
    } catch {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      style={{
        height: 48,

        padding: "0 22px",

        border: "none",

        borderRadius: 999,

        cursor: "pointer",

        background: following
          ? "rgba(255,255,255,.9)"
          : "linear-gradient(135deg,#1d9bf0,#57b3ff)",

        color: following ? "#111827" : "#fff",

        fontWeight: 700,

        fontSize: 15,

        backdropFilter: "blur(20px)",

        boxShadow: following
          ? "0 8px 22px rgba(0,0,0,.05)"
          : "0 14px 40px rgba(29,155,240,.25)",

        transition: ".25s",
      }}
    >
      {loading ? "Loading..." : following ? "Following" : "Follow"}
    </button>
  );
}

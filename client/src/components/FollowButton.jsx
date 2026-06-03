import {
  useState,
} from "react";

import api from "../services/api";

export default function FollowButton({
  userId,
}) {
  const [
    following,
    setFollowing,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleFollow() {
    try {
      setLoading(true);

      if (following) {
        await api.delete(
          `/users/${userId}/follow`
        );

        setFollowing(false);
      } else {
        await api.post(
          `/users/${userId}/follow`
        );

        setFollowing(true);
      }
    } catch {
      alert(
        "Action failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={
        following
          ? "secondary-button"
          : "primary-button"
      }
      onClick={handleFollow}
      disabled={loading}
      type="button"
    >
      {loading
        ? "Loading"
        : following
          ? "Following"
          : "Follow"}
    </button>
  );
}

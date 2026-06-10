import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import FollowButton from "../components/FollowButton";
import GithubStats from "../components/GithubStats";
import AvatarUpload from "../components/AvatarUpload";
import PageLoader from "../components/PageLoader";
import SocialLinks from "../components/SocialLinks";

export default function Profile() {
  const { username } = useParams();
  const [liveLoading, setLiveLoading] = useState(false);

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [followModal, setFollowModal] = useState(null);

  const [followUsers, setFollowUsers] = useState([]);

  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  async function loadProfile() {
    try {
      const res = await api.get(`/users/${username}`);

      setProfile(res.data);
    } catch {
      alert("Failed to load profile");
    }
  }

  async function openFollowList(type) {
    try {
      setFollowModal(type);

      setFollowLoading(true);

      const res = await api.get(`/users/${profile.id}/${type}`);

      setFollowUsers(res.data);
    } catch {
      alert("Failed to load users");
    } finally {
      setFollowLoading(false);
    }
  }

  function visitUser(user) {
    setFollowModal(null);

    navigate(`/profile/${user.username}`);
  }

  if (!profile) {
    return (
      <>
        <Navbar />

        <PageLoader text="Loading profile..." />
      </>
    );
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",

          margin: "40px auto",

          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: "30px",

            marginBottom: "30px",
          }}
        >
          <AvatarUpload avatar={profile.avatar} />

          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "20px",

                marginBottom: "10px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                }}
              >
                @{profile.username}
              </h1>

              <FollowButton userId={profile.id} />
              <Link
                to={`/chat/${profile.id}`}
                style={{
                  display: "inline-block",

                  marginLeft: "12px",

                  padding: "10px 18px",

                  background: "#111",

                  color: "white",

                  borderRadius: "10px",
                }}
              >
                Message
              </Link>
            </div>

            <p>{profile.bio}</p>

            <div
              style={{
                display: "flex",

                gap: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => openFollowList("followers")}
                style={{
                  border: "none",

                  background: "transparent",
                  color: "black",

                  padding: 0,

                  cursor: "pointer",

                  font: "inherit",
                }}
              >
                Followers: {profile._count?.followers || 0}
              </button>

              <button
                type="button"
                onClick={() => openFollowList("following")}
                style={{
                  border: "none",

                  background: "transparent",

                  padding: 0,

                  cursor: "pointer",
                  color: "black",
                  font: "inherit",
                }}
              >
                Following: {profile._count?.following || 0}
              </button>
            </div>
          </div>
        </div>

        <hr />

        <SocialLinks
          githubUsername={profile.githubUsername}
          linkedinUrl={profile.linkedinUrl}
          xUrl={profile.xUrl}
        />

        {profile.githubUsername && (
          <GithubStats username={profile.githubUsername} />
        )}

        <hr />

        <h2>Projects</h2>

        {profile.projects?.length ? (
          profile.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>No projects yet</p>
        )}
      </div>

      {followModal && (
        <div
          onClick={() => setFollowModal(null)}
          style={{
            position: "fixed",

            inset: 0,

            background: "rgba(0,0,0,.45)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "420px",

              maxWidth: "calc(100vw - 32px)",

              maxHeight: "70vh",

              overflow: "auto",

              background: "#fff",

              borderRadius: "14px",

              boxShadow: "0 18px 60px rgba(0,0,0,.22)",
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems: "center",

                justifyContent: "space-between",

                padding: "16px 18px",

                borderBottom: "1px solid #eee",
              }}
            >
              <strong
                style={{
                  textTransform: "capitalize",
                }}
              >
                {followModal}
              </strong>

              <button
                type="button"
                onClick={() => setFollowModal(null)}
                style={{
                  border: "none",

                  background: "transparent",

                  cursor: "pointer",

                  fontSize: "22px",
                }}
              >
                x
              </button>
            </div>

            {followLoading ? (
              <div
                style={{
                  padding: "22px",
                }}
              >
                Loading...
              </div>
            ) : followUsers.length ? (
              followUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => visitUser(user)}
                  style={{
                    width: "100%",

                    display: "flex",

                    alignItems: "center",

                    gap: "14px",

                    padding: "14px 18px",

                    border: "none",

                    borderBottom: "1px solid #f1f1f1",

                    background: "transparent",

                    cursor: "pointer",

                    textAlign: "left",
                  }}
                >
                  <img
                    src={user.avatar || "https://placehold.co/44"}
                    alt="avatar"
                    style={{
                      width: "44px",

                      height: "44px",

                      borderRadius: "50%",

                      objectFit: "cover",

                      background: "#eee",
                    }}
                  />

                  <div>
                    <strong>@{user.username}</strong>

                    {user.bio && (
                      <div
                        style={{
                          color: "#666",

                          fontSize: "14px",

                          marginTop: "3px",
                        }}
                      >
                        {user.bio}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div
                style={{
                  padding: "22px",

                  color: "#666",
                }}
              >
                No users yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

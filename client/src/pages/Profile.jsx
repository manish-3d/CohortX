import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { MessageCircle, Sparkles } from "lucide-react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import FollowButton from "../components/FollowButton";
import AvatarUpload from "../components/AvatarUpload";
import PageLoader from "../components/PageLoader";
import SocialLinks from "../components/SocialLinks";

export default function Profile() {
  const { username } = useParams();

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
    <div
      style={{
        minHeight: "100vh",

        background: `
          radial-gradient(
            circle at top,
            rgba(29,155,240,.24),
            transparent 36%
          ),

          linear-gradient(
            180deg,
            #ffffff,
            #f7fbff,
            #eef8ff
          )
        `,
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: 1100,

          margin: "0 auto",

          padding: "40px 24px 90px",
        }}
      >
        <div
          style={{
            overflow: "hidden",

            borderRadius: 40,

            background: "rgba(255,255,255,.72)",

            backdropFilter: "blur(40px)",

            boxShadow: "0 30px 90px rgba(29,155,240,.08)",
          }}
        >
          <div
            style={{
              height: 220,

              background: "linear-gradient(135deg,#1d9bf0,#7cc8ff)",
            }}
          />

          <div
            style={{
              padding: "0 50px 50px",

              marginTop: -80,
            }}
          >
            <div
              style={{
                display: "flex",

                gap: 36,

                flexWrap: "wrap",

                alignItems: "flex-start",
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

                    gap: 12,

                    flexWrap: "wrap",
                  }}
                >
                  <h1
                    style={{
                      margin: 0,

                      fontSize: 54,
                    }}
                  >
                    @{profile.username}
                  </h1>

                  <div
                    style={{
                      background: "#fff",

                      color: "#1d9bf0",

                      padding: "10px 16px",

                      borderRadius: 999,

                      display: "flex",

                      alignItems: "center",

                      gap: 8,
                    }}
                  >
                    <Sparkles size={16} />
                    Builder
                  </div>
                </div>

                <p
                  style={{
                    color: "#64748b",

                    margin: "14px 0 26px",
                  }}
                >
                  {profile.bio || "Building CohortX"}
                </p>

                <div
                  style={{
                    display: "flex",

                    flexDirection: "column",

                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <FollowButton background="none" userId={profile.id} />

                    <Link
                      to={`/chat/${profile.id}`}
                      style={{
                        height: 50,

                        padding: "0 22px",

                        display: "flex",

                        alignItems: "center",

                        gap: 10,

                        color: "#0a0a0a",

                        borderRadius: 999,

                        textDecoration: "none",
                      }}
                    >
                      <MessageCircle size={18} />
                    </Link>
                  </div>

                  <div
                    style={{
                      display: "flex",

                      gap: 12,

                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => openFollowList("followers")}
                      style={{
                        border: 0,

                        background: "#000000",

                        padding: "12px 18px",

                        borderRadius: 999,

                        cursor: "pointer",

                        fontWeight: 700,
                      }}
                    >
                      {profile._count?.followers}

                      <span
                        style={{
                          marginLeft: 8,
                        }}
                      >
                        Followers
                      </span>
                    </button>

                    <button
                      onClick={() => openFollowList("following")}
                      style={{
                        border: 0,

                        background: "#000000",

                        padding: "12px 18px",

                        borderRadius: 999,

                        cursor: "pointer",

                        fontWeight: 700,
                      }}
                    >
                      {profile._count?.following}

                      <span
                        style={{
                          marginLeft: 8,
                        }}
                      >
                        Following
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
          }}
        >
          <SocialLinks
            githubUsername={profile.githubUsername}
            linkedinUrl={profile.linkedinUrl}
            xUrl={profile.xUrl}
          />
        </div>

        <h2
          style={{
            margin: "50px 0 24px",
          }}
        >
          Projects
        </h2>

        {profile.projects?.length ? (
          profile.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div
            style={{
              background: "#fff",

              padding: 40,

              borderRadius: 30,

              textAlign: "center",
            }}
          >
            No projects yet
          </div>
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

            justifyContent: "center",

            alignItems: "center",

            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 430,

              maxHeight: "70vh",

              overflow: "auto",

              background: "#fff",

              borderRadius: 30,

              padding: 24,
            }}
          >
            <h2>{followModal}</h2>

            {followLoading ? (
              <div>Loading...</div>
            ) : (
              followUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => visitUser(user)}
                  style={{
                    width: "100%",

                    display: "flex",

                    gap: 14,

                    alignItems: "center",

                    border: 0,

                    padding: 14,

                    borderRadius: 20,

                    background: "#fff",

                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user.avatar}
                    alt=""
                    style={{
                      width: 46,

                      height: 46,

                      borderRadius: "50%",
                    }}
                  />

                  <strong>@{user.username}</strong>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

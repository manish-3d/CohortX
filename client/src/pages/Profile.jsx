import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MessageCircle, Sparkles, Search, Share2, Check } from "lucide-react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

  // Asteroid Rain Particle Simulation
  useEffect(() => {
    if (!profile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let lastTime = null;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const asteroids = [];
    const maxAsteroids = 40;

    for (let i = 0; i < maxAsteroids; i++) {
      asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 3 + 2.5,
        weight: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.15,
      });
    }

    const animate = (timestamp) => {
      const dt =
        lastTime === null ? 1 / 60 : Math.min((timestamp - lastTime) / 1000, 0.05);
      const frameScale = dt * 60;
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      asteroids.forEach((asteroid) => {
        const gradient = ctx.createLinearGradient(
          asteroid.x,
          asteroid.y,
          asteroid.x - asteroid.length * 0.5,
          asteroid.y - asteroid.length
        );
        gradient.addColorStop(0, `rgba(29, 155, 240, ${asteroid.opacity})`);
        gradient.addColorStop(
          0.3,
          `rgba(124, 200, 255, ${asteroid.opacity * 0.5})`
        );
        gradient.addColorStop(1, "transparent");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = asteroid.weight;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(asteroid.x, asteroid.y);
        ctx.lineTo(
          asteroid.x - asteroid.length * 0.3,
          asteroid.y - asteroid.length
        );
        ctx.stroke();

        asteroid.y += asteroid.speed * frameScale;
        asteroid.x += asteroid.speed * 0.12 * frameScale;

        if (asteroid.y > canvas.height) {
          asteroid.y = -asteroid.length;
          asteroid.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTime = null;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [profile]);

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

  const bannerStyle = {
  // Linear gradient from dark-blue to medium-blue
  background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
  
  // Necessary styling for a banner
  width: '100%',
  minHeight: '100vh', // Adjust height as needed
  borderRadius: '16px', // Matches your card's rounded corners
  position: 'relative',
  overflow: 'hidden'
};

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!profile) {
    return (
      <>
       <div style={bannerStyle}>
          <PageLoader  text="profile loading.."/>
       </div>
        
        
      </>
    );
  }

  const filteredProjects =
    profile.projects?.filter(
      (project) =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "#0b111e",
        boxSizing: "border-box",
      }}
    >
      {/* Global CSS Style Rules */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        @keyframes riverFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .river-stream {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 70px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C300,100 300,20 600,60 C900,100 900,20 1200,60 L1200,120 L0,120 Z' fill='%231d9bf0' fill-opacity='0.25'%3E%3C/path%3E%3C/svg%3E") repeat-x;
          animation: riverFlow 10s linear infinite;
          z-index: 2;
          pointer-events: none;
        }
        .river-stream-secondary {
          height: 85px;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,50 C300,20 300,90 600,50 C900,20 900,90 1200,50 L1200,120 L0,120 Z' fill='%237cc8ff' fill-opacity='0.15'%3E%3C/path%3E%3C/svg%3E") repeat-x;
          animation: riverFlow 6s linear infinite reverse;
          z-index: 1;
        }
        
        /* Forces interior image elements into a clean perfect circle geometry with no white leaking outer rims */
        .profile-avatar-container img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 50% !important;
          aspect-ratio: 1 / 1 !important;
          border: none !important;
          outline: none !important;
        }

        .interactive-card {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease !important;
        }
        .interactive-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(29, 155, 240, 0.12) !important;
          border-color: rgba(29, 155, 240, 0.3) !important;
        }
        .action-pill {
          transition: all 0.25s ease;
        }
        .action-pill:hover {
          transform: translateY(-2px);
          filter: brightness(1.15);
        }
        
        @media (max-width: 768px) {
          .profile-main-card {
            border-radius: 24px !important;
          }
          .profile-padding-box {
            padding: 0 20px 30px !important;
            margin-top: -75px !important;
          }
          .profile-flex-layout {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 20px !important;
          }
          .profile-meta-text {
            margin-top: 0 !important;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .profile-title-row {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .profile-username {
            font-size: 32px !important;
          }
          .profile-actions-grid {
            justify-content: center !important;
            width: 100%;
          }
          .profile-stats-grid {
            justify-content: center !important;
            width: 100%;
          }
          .project-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }
          .search-wrapper-input {
            max-width: 100% !important;
          }
          .modal-window-card {
            width: 92% !important;
            padding: 20px !important;
            border-radius: 24px !important;
          }
        }
      `}</style>

      {/* Particle Overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 10, width: "100%" }}>
        <Navbar />

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "24px 16px 80px",
            width: "100%",
          }}
        >
          <div
            className="profile-main-card interactive-card"
            style={{
              overflow: "hidden",
              borderRadius: 40,
              background: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.35)",
              width: "100%",
            }}
          >
            {/* Banner Segment with App Flowing River Motion Channels */}
            <div
              style={{
                height: 220,
                background:
                  "linear-gradient(135deg, #0f172a, #1e3a8a, #0b111e)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="river-stream" />
              <div className="river-stream river-stream-secondary" />

              <div
                style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
              >
                <button
                  onClick={handleShareProfile}
                  className="action-pill"
                  style={{
                    background: "rgba(15, 23, 42, 0.65)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 999,
                    padding: "8px 16px",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {copied ? (
                    <Check size={14} color="#4ade80" />
                  ) : (
                    <Share2 size={14} />
                  )}
                  {copied ? "Copied" : "Share"}
                </button>
              </div>
            </div>

            {/* Profile Content Block */}
            <div
              className="profile-padding-box"
              style={{
                padding: "0 40px 40px",
                marginTop: -75,
                position: "relative",
                zIndex: 5,
              }}
            >
              <div
                className="profile-flex-layout"
                style={{ display: "flex", gap: 32, alignItems: "flex-start" }}
              >
                {/* Borderless Avatar Layer Shell - Unclipped for Settings Icon Visibility */}
                <div
                  className="profile-avatar-container"
                  style={{
                    background: "transparent",
                    flexShrink: 0,
                    width: 140,
                    height: 140,
                    aspectRatio: "1 / 1",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AvatarUpload avatar={profile.avatar} />
                </div>

                <div
                  className="profile-meta-text"
                  style={{ flex: 1, marginTop: 85 }}
                >
                  <div
                    className="profile-title-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <h1
                      className="profile-username"
                      style={{
                        margin: 0,
                        fontSize: 38,
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      @{profile.username}
                    </h1>

                    <div
                      style={{
                        background: "rgba(29, 155, 240, 0.12)",
                        color: "#7cc8ff",
                        padding: "6px 14px",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        border: "1px solid rgba(29, 155, 240, 0.25)",
                      }}
                    >
                      <Sparkles size={13} />
                      Builder
                    </div>
                  </div>

                  <p
                    style={{
                      color: "#94a3b8",
                      margin: "14px 0 24px",
                      fontSize: 16,
                      lineHeight: "1.5",
                      maxWidth: 600,
                    }}
                  >
                    {profile.bio ||
                      "Building high-performance environments on CohortX"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20,
                      width: "100%",
                    }}
                  >
                    <div
                      className="profile-actions-grid"
                      style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <FollowButton background="#1d9bf0" userId={profile.id} />

                      <Link
                        to={`/chat/${profile.id}`}
                        className="action-pill"
                        style={{
                          height: 44,
                          padding: "0 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: 999,
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        <MessageCircle size={16} style={{ marginRight: 6 }} />
                        Message
                      </Link>
                    </div>

                    <div
                      className="profile-stats-grid"
                      style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                    >
                      <button
                        onClick={() => openFollowList("followers")}
                        className="action-pill"
                        style={{
                          border: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255, 255, 255, 0.02)",
                          color: "#f8fafc",
                          padding: "10px 18px",
                          borderRadius: 14,
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: "#1d9bf0" }}>
                          {profile._count?.followers || 0}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            color: "#64748b",
                            fontWeight: 500,
                          }}
                        >
                          Followers
                        </span>
                      </button>

                      <button
                        onClick={() => openFollowList("following")}
                        className="action-pill"
                        style={{
                          border: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(255, 255, 255, 0.02)",
                          color: "#f8fafc",
                          padding: "10px 18px",
                          borderRadius: 14,
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        <span style={{ color: "#1d9bf0" }}>
                          {profile._count?.following || 0}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            color: "#64748b",
                            fontWeight: 500,
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

          {/* Social Network Node Connections Mapping */}
          <div style={{ marginTop: 24, width: "100%" }}>
            <SocialLinks
              githubUsername={profile.githubUsername}
              linkedinUrl={profile.linkedinUrl}
              xUrl={profile.xUrl}
            />
          </div>

          {/* Showcase Filter Catalogs Strip */}
          <div
            className="project-header-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "48px 0 20px",
              width: "100%",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Showcase Catalog
            </h2>

            <div
              className="search-wrapper-input"
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 300,
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
              />
              <input
                type="text"
                placeholder="Filter workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 40px",
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 999,
                  color: "#ffffff",
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Render Active Deployed Repositories */}
          {filteredProjects.length ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "100%",
              }}
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="interactive-card"
                  style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "rgba(255,255,255,0.01)",
                border: "1px solid rgba(255,255,255,0.04)",
                padding: 40,
                borderRadius: 24,
                textAlign: "center",
                color: "#64748b",
                fontSize: 14,
                width: "100%",
              }}
            >
              {searchQuery
                ? "No workspace items match your query parameter"
                : "No project workflows deployed yet"}
            </div>
          )}
        </div>
      </div>

      {/* Network Modal Overlays */}
      {followModal && (
        <div
          onClick={() => setFollowModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            className="modal-window-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              maxHeight: "70vh",
              overflowY: "auto",
              background: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 28,
              padding: 24,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <h2
              style={{
                textTransform: "capitalize",
                margin: "0 0 16px",
                color: "#fff",
                fontSize: 20,
              }}
            >
              {followModal}
            </h2>

            {followLoading ? (
              <div
                style={{
                  color: "#64748b",
                  textAlign: "center",
                  padding: "16px 0",
                  fontSize: 14,
                }}
              >
                Syncing nodes...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {followUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => visitUser(user)}
                    className="action-pill"
                    style={{
                      width: "100%",
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      border: 0,
                      padding: 10,
                      borderRadius: 14,
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt=""
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        objectFit: "cover",
                        background: "#1e293b",
                      }}
                    />
                    <strong style={{ color: "#fff", fontSize: 14 }}>
                      @{user.username}
                    </strong>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

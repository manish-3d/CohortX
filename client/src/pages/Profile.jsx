import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../services/api";
import FollowButton from "../components/FollowButton";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

export default function Profile() {
  const {
    username,
  } = useParams();

  const [
    profile,
    setProfile,
  ] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res =
          await api.get(
            `/users/${username}`
          );

        setProfile(
          res.data
        );
      } catch {
        alert(
          "Failed to load profile"
        );
      }
    }

    loadProfile();
  }, [
    username,
  ]);

  if (!profile) {
    return (
      <div className="app-shell">
        <Navbar />

        <main className="main-column">
          <div className="loading-state">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  const initial =
    profile.username?.[0] || "B";

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-column">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              {profile.username}
            </h1>

            <p className="page-subtitle">
              {profile.projects?.length || 0} posts
            </p>
          </div>
        </header>

        <section className="profile-shell">
          <div className="profile-cover" />

          <div className="profile-body">
            <div className="profile-top">
              <div>
                <div className="avatar profile-avatar">
                  {initial}
                </div>

                <h2 className="profile-name">
                  {profile.username}
                </h2>

                <div className="account-handle">
                  @{profile.username}
                </div>
              </div>

              <FollowButton
                userId={profile.id}
              />
            </div>

            <p className="profile-bio">
              {profile.bio ||
                "Building, learning, and shipping in public."}
            </p>

            <div className="profile-links">
              {profile.githubUsername && (
                <span>
                  GitHub: {profile.githubUsername}
                </span>
              )}

              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              )}

              {profile.xUrl && (
                <a
                  href={profile.xUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  X profile
                </a>
              )}
            </div>

            <div className="profile-stats">
              <span>
                <strong>
                  {profile._count?.following || 0}
                </strong>{" "}
                Following
              </span>

              <span>
                <strong>
                  {profile._count?.followers || 0}
                </strong>{" "}
                Followers
              </span>
            </div>
          </div>
        </section>

        <div className="section-label">
          Projects
        </div>

        {profile.projects?.length ? (
          profile.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={{
                ...project,
                author: {
                  ...project.author,
                  username:
                    project.author?.username ||
                    profile.username,
                },
              }}
            />
          ))
        ) : (
          <div className="feed-empty">
            No projects yet.
          </div>
        )}
      </main>
    </div>
  );
}

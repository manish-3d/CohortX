import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import FollowButton from "../components/FollowButton";
import GithubStats from "../components/GithubStats";
import AvatarUpload from "../components/AvatarUpload";

export default function Profile() {
  const { username } =
    useParams();

  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

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

  if (!profile) {
    return (
      <>
        <Navbar />

        <div
          style={{
            padding:
              "40px",
          }}
        >
          <h2>
            Loading...
          </h2>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth:
            "900px",

          margin:
            "40px auto",

          padding:
            "20px",
        }}
      >
        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "30px",

            marginBottom:
              "30px",
          }}
        >
          <AvatarUpload
            avatar={
              profile.avatar
            }
          />

          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "20px",

                marginBottom:
                  "10px",
              }}
            >
              <h1
                style={{
                  margin: 0,
                }}
              >
                @{profile.username}
              </h1>

              <FollowButton
                userId={
                  profile.id
                }
              />
            </div>

            <p>
              {profile.bio}
            </p>

            <div
              style={{
                display:
                  "flex",

                gap:
                  "20px",
              }}
            >
              <span>
                Followers:
                {" "}
                {
                  profile._count
                    ?.followers || 0
                }
              </span>

              <span>
                Following:
                {" "}
                {
                  profile._count
                    ?.following || 0
                }
              </span>
            </div>
          </div>
        </div>

        <hr />

        {profile.githubUsername && (
          <>
            <p>
              GitHub:
              {" "}
              {
                profile.githubUsername
              }
            </p>

            <GithubStats
              username={
                profile.githubUsername
              }
            />
          </>
        )}

        {profile.linkedinUrl && (
          <p>
            LinkedIn:
            {" "}
            {
              profile.linkedinUrl
            }
          </p>
        )}

        {profile.xUrl && (
          <p>
            X:
            {" "}
            {
              profile.xUrl
            }
          </p>
        )}

        <hr />

        <h2>
          Projects
        </h2>

        {profile.projects?.length ? (
          profile.projects.map(
            (
              project
            ) => (
              <ProjectCard
                key={
                  project.id
                }

                project={
                  project
                }
              />
            )
          )
        ) : (
          <p>
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
}
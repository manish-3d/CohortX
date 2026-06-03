import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

export default function Feed() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const res =
        await api.get(
          "/feed"
        );

      setProjects(
        res.data
      );

    } catch (err) {
      console.log(err);

      alert(
        "Failed to load feed"
      );

    } finally {
      setLoading(
        false
      );
    }
  }

  if (loading) {
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
            Loading feed...
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
        <h1>
          Feed
        </h1>

        {projects.length === 0 ? (
          <div>
            <h3>
              No projects found
            </h3>

            <p>
              Follow builders or create a project.
            </p>
          </div>

        ) : (

          projects.map(
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

        )}
      </div>
    </div>
  );
}
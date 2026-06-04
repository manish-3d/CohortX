import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

export default function Explore() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const res =
        await api.get(
          "/projects/explore"
        );

      setProjects(
        res.data
      );

    } catch {
      alert(
        "Explore failed"
      );

    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <h2>
          Loading...
        </h2>
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
        <h1>
          Explore
        </h1>

        {projects.length ? (
          projects.map(
            (project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            )
          )
        ) : (
          <p>
            No projects found
          </p>
        )}
      </div>
    </div>
  );
}
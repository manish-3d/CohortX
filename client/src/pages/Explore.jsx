import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import api from "../services/api";

export default function Explore() {
  const [
    projects,
    setProjects,
  ] = useState([]);

  useEffect(() => {
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
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-column">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              Explore
            </h1>

            <p className="page-subtitle">
              Discover the best projects shipping across CohortX
            </p>
          </div>
        </header>

        {projects.length ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))
        ) : (
          <div className="feed-empty">
            No public launches yet. The first great post can be yours.
          </div>
        )}
      </main>
    </div>
  );
}

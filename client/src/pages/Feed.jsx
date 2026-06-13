import { useEffect, useState } from "react";

import api from "../services/api";

import ProjectCard from "../components/ProjectCard";

import PageLoader from "../components/PageLoader";

import StoryTray from "../components/StoryTray";

import AppLayout from "../layout/AppLayout";

export default function Feed() {
  const [projects, setProjects] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    function extractText(obj) {
      if (obj === null || obj === undefined) {
        return "";
      }

      if (typeof obj === "string") {
        return obj;
      }

      if (typeof obj === "number") {
        return String(obj);
      }

      if (Array.isArray(obj)) {
        return obj.map(extractText).join(" ");
      }

      if (typeof obj === "object") {
        return Object.values(obj).map(extractText).join(" ");
      }

      return "";
    }

    function handleSearch(event) {
      const query = (event.detail || "").toLowerCase().trim();

      if (!query) {
        setFilteredProjects(projects);

        return;
      }

      const filtered = projects.filter((project) => {
        const searchable = extractText(project).toLowerCase();

        return searchable.includes(query);
      });

      setFilteredProjects(filtered);
    }

    window.addEventListener("global-search", handleSearch);

    return () => window.removeEventListener("global-search", handleSearch);
  }, [projects]);

  async function loadFeed() {
    try {
      const res = await api.get("/feed");

      setProjects(res.data);

      setFilteredProjects(res.data);
    } catch (err) {
      console.log(err);

      alert("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <PageLoader text="Loading feed..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div
        style={{
          maxWidth: "760px",

          margin: "0 auto",

          padding: "30px",

          display: "flex",

          flexDirection: "column",

          gap: 18,
        }}
      >
        <StoryTray />

        {filteredProjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",

              padding: "60px 0",
            }}
          >
            <h2>No projects found</h2>

            <p>Try searching another keyword</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </AppLayout>
  );
}

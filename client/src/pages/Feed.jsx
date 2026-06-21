import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import PageLoader from "../components/PageLoader";
import StoryTray from "../components/StoryTray";
import AppLayout from "../layout/AppLayout";
import PageLoader2 from "./PageLoader2";

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
        <PageLoader2 />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div
        style={{
          width: "100%",
          /* Removed the fixed pixel cap so cards stretch out as wide as possible */
          maxWidth: "100%",
          margin: "0",
          /* Retained the compact normalized layout padding */
          padding: "21px 14px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          /* Retained the tighter, more proportional gap */
          gap: "13px",
        }}
      >
        <StoryTray />

        {filteredProjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "45px 0",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "5px",
                color: "var(--text)",
              }}
            >
              No projects found
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-dim)",
                margin: 0,
              }}
            >
              Try searching another keyword
            </p>
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

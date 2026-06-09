import { useEffect, useState } from "react";

import api from "../services/api";

import ProjectCard from "../components/ProjectCard";

import PageLoader from "../components/PageLoader";

import StoryTray from "../components/StoryTray";

import AppLayout from "../layout/AppLayout";

export default function Feed() {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    try {
      const res = await api.get("/feed");

      setProjects(res.data);
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
        }}
      >
        <StoryTray />

        {projects.length === 0 ? (
          <div>
            <h3>No projects found</h3>

            <p>Follow users or create projects</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </AppLayout>
  );
}

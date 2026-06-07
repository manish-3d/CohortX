import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api
from "../services/api";

import Navbar
from "../components/Navbar";

import PageLoader
from "../components/PageLoader";

import ProjectCard
from "../components/ProjectCard";

export default function ProjectDetail() {
  const { id } =
    useParams();

  const [
    project,
    setProject,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      setLoading(
        true
      );

      const res =
        await api.get(
          `/projects/${id}`
        );

      setProject(
        res.data
      );

    } catch (err) {
      console.log(
        err
      );

      alert(
        "Failed to load project"
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

        <PageLoader text="Loading project..." />
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
        {project ? (
          <ProjectCard
            project={project}
          />
        ) : (
          <p>
            Project not found
          </p>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

import "./CreateProject.css";

export default function CreateProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
  });

  const [media, setMedia] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  function handleMedia(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setMedia(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      if (media) {
        fd.append("media", media);
      }

      await api.post("/projects", fd);

      navigate("/feed");
    } catch {
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="create-page">
        <h1 className="create-title">Create Project</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="media">
            <div className="media-box">
              {!preview ? (
                <div className="upload-text">Upload Image / Video</div>
              ) : media?.type.startsWith("video") ? (
                <video controls src={preview} className="media-preview" />
              ) : (
                <img src={preview} alt="preview" className="media-preview" />
              )}
            </div>
          </label>

          <input
            id="media"
            hidden
            type="file"
            accept="
image/*,
video/*
"
            onChange={handleMedia}
          />

          <div className="form-group">
            <input
              name="title"
              placeholder="Project Title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Describe your project"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="githubUrl"
              placeholder="GitHub URL"
              value={form.githubUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              name="demoUrl"
              placeholder="Live Demo URL"
              value={form.demoUrl}
              onChange={handleChange}
            />
          </div>

          <button className="publish-btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Project"}
          </button>
        </form>
      </div>
    </>
  );
}

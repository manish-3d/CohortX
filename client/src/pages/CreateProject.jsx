import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

export default function CreateProject() {
  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    title: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post(
        "/projects",
        form
      );

      navigate(
        "/feed"
      );
    } catch (err) {
      alert(
        err.response
          ?.data
          ?.message ||
        err.response
          ?.data
          ?.error ||
        "Create failed"
      );
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-column">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              Create
            </h1>

            <p className="page-subtitle">
              Launch your project to the timeline
            </p>
          </div>
        </header>

        <section className="form-panel">
          <form
            className="form-card"
            onSubmit={handleSubmit}
          >
            <div className="field">
              <label htmlFor="title">
                Project title
              </label>

              <input
                id="title"
                name="title"
                placeholder="Name your launch"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="description">
                Story
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="What did you build, who is it for, and why does it matter?"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="githubUrl">
                GitHub URL
              </label>

              <input
                id="githubUrl"
                name="githubUrl"
                placeholder="https://github.com/..."
                value={form.githubUrl}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="demoUrl">
                Live demo URL
              </label>

              <input
                id="demoUrl"
                name="demoUrl"
                placeholder="https://..."
                value={form.demoUrl}
                onChange={handleChange}
              />
            </div>

            <button
              className="post-button"
              type="submit"
            >
              Publish
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

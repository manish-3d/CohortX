import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

export default function EditProfile() {
  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    bio: "",
    githubUsername: "",
    linkedinUrl: "",
    xUrl: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res =
          await api.get(
            "/auth/me"
          );

        setForm({
          bio:
            res.data.bio ||
            "",
          githubUsername:
            res.data.githubUsername ||
            "",
          linkedinUrl:
            res.data.linkedinUrl ||
            "",
          xUrl:
            res.data.xUrl ||
            "",
        });
      } catch {
        alert(
          "Failed to load"
        );
      }
    }

    loadProfile();
  }, []);

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
      await api.put(
        "/users/profile/edit",
        form
      );

      navigate(
        "/feed"
      );
    } catch {
      alert(
        "Update failed"
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
              Edit profile
            </h1>

            <p className="page-subtitle">
              Make your builder profile feel investable
            </p>
          </div>
        </header>

        <section className="form-panel">
          <form
            className="form-card"
            onSubmit={handleSubmit}
          >
            <div className="field">
              <label htmlFor="bio">
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                placeholder="What are you building?"
                value={form.bio}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="githubUsername">
                GitHub username
              </label>

              <input
                id="githubUsername"
                name="githubUsername"
                placeholder="your-handle"
                value={form.githubUsername}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="linkedinUrl">
                LinkedIn URL
              </label>

              <input
                id="linkedinUrl"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/..."
                value={form.linkedinUrl}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="xUrl">
                X URL
              </label>

              <input
                id="xUrl"
                name="xUrl"
                placeholder="https://x.com/..."
                value={form.xUrl}
                onChange={handleChange}
              />
            </div>

            <button
              className="post-button"
              type="submit"
            >
              Save profile
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

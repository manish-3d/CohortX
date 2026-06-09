import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import AppLayout from "../layout/AppLayout";

export default function EditProject() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",

    description: "",

    githubUrl: "",

    demoUrl: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProject();
  }, []);

  async function loadProject() {
    try {
      const res = await api.get(`/projects/${id}`);

      setForm({
        title: res.data.title,

        description: res.data.description,

        githubUrl: res.data.githubUrl || "",

        demoUrl: res.data.demoUrl || "",
      });
    } catch {
      alert("Cannot load");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(
        `/projects/${id}`,

        form
      );

      alert("Updated");

      navigate(`/projects/${id}`);
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "700px",

          margin: "0 auto",

          display: "flex",

          flexDirection: "column",

          gap: "18px",
        }}
      >
        <h1>Edit Project</h1>

        <input
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,

              title: e.target.value,
            })
          }
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,

              description: e.target.value,
            })
          }
        />

        <input
          placeholder="Github"
          value={form.githubUrl}
          onChange={(e) =>
            setForm({
              ...form,

              githubUrl: e.target.value,
            })
          }
        />

        <input
          placeholder="Demo"
          value={form.demoUrl}
          onChange={(e) =>
            setForm({
              ...form,

              demoUrl: e.target.value,
            })
          }
        />

        <button type="submit">{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </AppLayout>
  );
}

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";

export default function CreateProject() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
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

  async function handleSubmit(
    e
  ) {
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
        "Project creation failed"
      );
    }
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h1>
          Create Project
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            name="title"
            placeholder="Title"

            value={
              form.title
            }

            onChange={
              handleChange
            }

            required
          />

          <br />
          <br />

          <textarea
            name="description"

            placeholder="Description"

            value={
              form.description
            }

            onChange={
              handleChange
            }

            required
          />

          <br />
          <br />

          <input
            name="githubUrl"

            placeholder="GitHub URL"

            value={
              form.githubUrl
            }

            onChange={
              handleChange
            }
          />

          <br />
          <br />

          <input
            name="demoUrl"

            placeholder="Demo URL"

            value={
              form.demoUrl
            }

            onChange={
              handleChange
            }
          />

          <br />
          <br />

          <button
            type="submit"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
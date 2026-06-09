import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bio: "",
    githubUsername: "",
    linkedinUrl: "",
    xUrl: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await api.get("/auth/me");

      setForm({
        bio: res.data.bio || "",

        githubUsername: res.data.githubUsername || "",

        linkedinUrl: res.data.linkedinUrl || "",

        xUrl: res.data.xUrl || "",
      });
    } catch {
      alert("Failed to load profile");
    }
  }

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.put(
        "/users/profile/edit",

        form
      );

      navigate("/feed");
    } catch {
      alert("Update failed");
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
        <h1>Edit Profile</h1>

        <form onSubmit={handleSubmit}>
          <textarea
            name="bio"
            placeholder="Bio"
            value={form.bio}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="githubUsername"
            placeholder="GitHub"
            value={form.githubUsername}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="linkedinUrl"
            placeholder="LinkedIn"
            value={form.linkedinUrl}
            onChange={handleChange}
          />

          <br />
          <br />

          <input
            name="xUrl"
            placeholder="X"
            value={form.xUrl}
            onChange={handleChange}
          />

          <br />
          <br />

          <button>Save</button>
        </form>
      </div>
    </div>
  );
}

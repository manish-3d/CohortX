import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import api from "../services/api";

export default function CreateStory() {
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);

  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!media) {
      return alert("Select media");
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append("media", media);

      form.append("caption", caption);

      await api.post("/stories", form);

      alert("Story posted");

      navigate("/feed");
    } catch (err) {
      console.log(err);

      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "520px",

          margin: "40px auto",

          background: "rgba(255,255,255,.94)",

          backdropFilter: "blur(18px)",

          padding: "28px",

          borderRadius: "18px",

          border: "1px solid rgba(255,255,255,.75)",

          boxShadow: "0 24px 70px rgba(15,23,42,.18)",
        }}
      >
        <h1>New Story</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />

          <br />
          <br />

          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              width: "100%",

              minHeight: "120px",
            }}
          />

          <br />
          <br />

          <button type="submit">
            {loading ? "Uploading..." : "Post Story"}
          </button>
        </form>
      </div>
    </>
  );
}

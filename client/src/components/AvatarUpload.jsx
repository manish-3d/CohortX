import { useRef } from "react";

import api from "../services/api";

export default function AvatarUpload({ avatar }) {
  const inputRef = useRef();

  async function upload(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const form = new FormData();

    form.append("avatar", file);

    try {
      await api.post("/users/avatar", form);

      window.location.reload();
    } catch {
      alert("Upload failed");
    }
  }

  return (
    <div
      style={{
        position: "relative",

        width: "150px",

        marginBottom: "20px",
      }}
    >
      <img
        src={avatar || "https://placehold.co/150"}
        alt="avatar"
        style={{
          width: "150px",

          height: "150px",

          borderRadius: "50%",

          objectFit: "cover",

          border: "3px solid white",
        }}
      />

      <button
        onClick={() => inputRef.current.click()}
        style={{
          position: "absolute",

          right: "8px",

          bottom: "8px",

          width: "40px",

          height: "40px",

          borderRadius: "50%",

          fontSize: "18px",

          padding: 0,
        }}
      >
        ⚙️
      </button>

      <input
        type="file"
        ref={inputRef}
        hidden
        accept="image/*"
        onChange={upload}
      />
    </div>
  );
}

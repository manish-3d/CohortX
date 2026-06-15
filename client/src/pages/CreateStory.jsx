import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layout/AppLayout";
import api from "../services/api";

export default function CreateStory() {
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  function handleMedia(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setMedia(file);

    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!media) {
      alert("Select media");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();

      fd.append("media", media);

      fd.append("caption", caption);

      await api.post("/stories", fd);

      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div
        style={{
          minHeight: "100vh",

          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 1200,

            margin: "0 auto",

            display: "grid",

            gridTemplateColumns: "1fr 420px",

            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",

              justifyContent: "center",
            }}
          >
            <label
              style={{
                cursor: "pointer",
              }}
            >
              <input
                hidden
                type="file"
                accept="image/*,video/*"
                onChange={handleMedia}
              />

              <div
                style={{
                  width: 360,

                  aspectRatio: "9/16",

                  borderRadius: 38,

                  overflow: "hidden",

                  position: "relative",

                  background: "rgba(255,255,255,.06)",

                  border: "1px solid rgba(255,255,255,.12)",

                  backdropFilter: "blur(40px)",

                  boxShadow: "0 60px 140px rgba(29,155,240,.16)",

                  transition: ".35s",
                }}
              >
                {!preview ? (
                  <>
                    <div
                      style={{
                        position: "absolute",

                        inset: 0,

                        background: `
                        linear-gradient(
                        180deg,
                        rgba(29,155,240,.18),
                        transparent
                        )
                      `,
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",

                        inset: 0,

                        display: "grid",

                        placeItems: "center",

                        color: "#fff",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            color: "black",
                            fontSize: 84,
                          }}
                        >
                          ＋
                        </div>

                        <h2>Create Story</h2>

                        <p
                          style={{
                            color: "#9fb3c8",
                          }}
                        >
                          Tap to upload
                        </p>
                      </div>
                    </div>
                  </>
                ) : media?.type.startsWith("video") ? (
                  <video
                    src={preview}
                    controls
                    style={{
                      width: "100%",

                      height: "100%",

                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={preview}
                    alt=""
                    style={{
                      width: "100%",

                      height: "100%",

                      objectFit: "cover",
                    }}
                  />
                )}

                {preview && (
                  <div
                    style={{
                      position: "absolute",

                      left: 20,

                      right: 20,

                      bottom: 24,

                      padding: "18px 20px",

                      color: "#fff",

                      borderRadius: 22,

                      backdropFilter: "blur(30px)",

                      background: "rgba(0,0,0,.26)",
                    }}
                  >
                    {caption || "Write something..."}
                  </div>
                )}
              </div>
            </label>
          </div>

          <div
            style={{
              display: "flex",

              flexDirection: "column",

              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "black",

                fontSize: 58,

                fontWeight: 900,
              }}
            >
              Story Studio
            </div>

            <div
              style={{
                color: "#8ea4bb",

                marginTop: 14,

                lineHeight: 1.7,
              }}
            >
              Share moments with immersive story experiences.
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Tell your story..."
              style={{
                marginTop: 36,

                minHeight: 180,

                border: 0,

                color: "black",

                borderRadius: 28,

                padding: 26,

                resize: "none",

                background: "white",

                backdropFilter: "blur(30px)",
              }}
            />

            <button
              disabled={loading}
              style={{
                height: 72,

                marginTop: 26,

                border: 0,

                cursor: "pointer",

                borderRadius: 999,

                color: "#fff",

                fontWeight: 900,

                fontSize: 18,

                background: `
                linear-gradient(
                135deg,
                #1d9bf0,
                #53c5ff
                )
              `,

                boxShadow: "0 30px 90px rgba(29,155,240,.35)",
              }}
            >
              {loading ? "Publishing..." : "Post Story"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

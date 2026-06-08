import {
  useEffect,
  useState,
} from "react";

import api
from "../services/api";

export default function StoryTray() {
  const [stories, setStories] =
    useState([]);

  const [activeIndex, setActiveIndex] =
    useState(null);

  const activeStory =
    activeIndex === null
      ? null
      : stories[activeIndex];

  function closeStory() {
    setActiveIndex(
      null
    );
  }

  function showPrevious() {
    setActiveIndex(
      (index) =>
        index > 0
          ? index - 1
          : stories.length - 1
    );
  }

  function showNext() {
    setActiveIndex(
      (index) =>
        index < stories.length - 1
          ? index + 1
          : 0
    );
  }

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const res =
        await api.get(
          "/stories"
        );

      setStories(
        res.data
      );

    } catch (err) {
      console.log(
        err
      );
    }
  }

  if (!stories.length) {
    return null;
  }

  return (
    <>
      <div
        style={{
          display:
            "flex",

          gap:
            "18px",

          overflowX:
            "auto",

          padding:
            "10px 0 26px",

          marginBottom:
            "14px",
        }}
      >
        {stories.map(
          (story, index) => (
            <button
              key={
                story.id
              }

              type="button"

              onClick={() =>
                setActiveIndex(
                  index
                )
              }

              style={{
                border:
                  "none",

                background:
                  "transparent",

                cursor:
                  "pointer",

                padding:
                  0,

                width:
                  "92px",

                flex:
                  "0 0 auto",
              }}
            >
              <img
                src={
                  story.user
                    ?.avatar ||
                  "https://placehold.co/76"
                }

                alt="story"

                style={{
                  width:
                    "76px",

                  height:
                    "76px",

                  borderRadius:
                    "50%",

                  objectFit:
                    "cover",

                  padding:
                    "4px",

                  border:
                    "3px solid #111",

                  background:
                    "#fff",
                }}
              />

              <div
                style={{
                  marginTop:
                    "8px",

                  fontSize:
                    "13px",

                  fontWeight:
                    "600",

                  overflow:
                    "hidden",

                  textOverflow:
                    "ellipsis",

                  whiteSpace:
                    "nowrap",
                }}
              >
                @
                {
                  story.user
                    ?.username
                }
              </div>
            </button>
          )
        )}
      </div>

      {activeStory && (
        <div
          onClick={closeStory}

          style={{
            position:
              "fixed",

            inset:
              0,

            zIndex:
              100,

            background:
              "#000",

            display:
              "flex",

            alignItems:
              "stretch",

            justifyContent:
              "center",

            padding:
              0,
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }

            style={{
              width:
                "min(500px, 100vw)",

              height:
                "100vh",

              color:
                "#fff",

              position:
                "relative",

              display:
                "flex",

              flexDirection:
                "column",

              justifyContent:
                "center",
            }}
          >
            <div
              style={{
                position:
                  "absolute",

                top:
                  0,

                left:
                  0,

                right:
                  0,

                zIndex:
                  2,

                padding:
                  "14px 16px 18px",

                background:
                  "linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,0))",
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "4px",

                  marginBottom:
                    "14px",
                }}
              >
                {stories.map(
                  (story, index) => (
                    <div
                      key={
                        story.id
                      }

                      style={{
                        flex:
                          1,

                        height:
                          "3px",

                        borderRadius:
                          "999px",

                        background:
                          index <= activeIndex
                            ? "#fff"
                            : "rgba(255,255,255,.35)",
                      }}
                    />
                  )
                )}
              </div>

              <div
                style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",

                marginBottom:
                  0,
                }}
              >
                <img
                  src={
                    activeStory.user
                      ?.avatar ||
                    "https://placehold.co/42"
                  }

                  alt="avatar"

                  style={{
                    width:
                      "42px",

                    height:
                      "42px",

                    borderRadius:
                      "50%",

                    objectFit:
                      "cover",

                    border:
                      "2px solid #fff",
                  }}
                />

                <strong>
                  @
                  {
                    activeStory.user
                      ?.username
                  }
                </strong>

                <button
                  type="button"

                  onClick={closeStory}

                  aria-label="Close story"

                  style={{
                    marginLeft:
                      "auto",

                    width:
                      "36px",

                    height:
                      "36px",

                    border:
                      "none",

                    background:
                      "rgba(255,255,255,.14)",

                    borderRadius:
                      "50%",

                    color:
                      "#fff",

                    cursor:
                      "pointer",

                    fontSize:
                      "24px",
                  }}
                >
                  x
                </button>
              </div>
            </div>

            <button
              type="button"

              onClick={(e) => {
                e.stopPropagation();
                showPrevious();
              }}

              aria-label="Previous story"

              style={{
                position:
                  "absolute",

                left:
                  "12px",

                top:
                  "50%",

                zIndex:
                  2,

                transform:
                  "translateY(-50%)",

                width:
                  "40px",

                height:
                  "40px",

                border:
                  "none",

                borderRadius:
                  "50%",

                background:
                  "rgba(255,255,255,.16)",

                color:
                  "#fff",

                cursor:
                  "pointer",

                fontSize:
                  "26px",
              }}
            >
              ‹
            </button>

            <button
              type="button"

              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}

              aria-label="Next story"

              style={{
                position:
                  "absolute",

                right:
                  "12px",

                top:
                  "50%",

                zIndex:
                  2,

                transform:
                  "translateY(-50%)",

                width:
                  "40px",

                height:
                  "40px",

                border:
                  "none",

                borderRadius:
                  "50%",

                background:
                  "rgba(255,255,255,.16)",

                color:
                  "#fff",

                cursor:
                  "pointer",

                fontSize:
                  "26px",
              }}
            >
              ›
            </button>

            <div
              style={{
                width:
                  "100%",

                height:
                  "100%",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                background:
                  "#000",
              }}
            >
              {activeStory.mediaType ===
              "video" ? (
                <video
                  controls
                  autoPlay
                  src={
                    activeStory.mediaUrl
                  }

                  style={{
                    width:
                      "100%",

                    height:
                      "100%",

                    objectFit:
                      "contain",
                  }}
                />
              ) : (
                <img
                  src={
                    activeStory.mediaUrl
                  }

                  alt="story"

                  style={{
                    width:
                      "100%",

                    height:
                      "100%",

                    objectFit:
                      "contain",
                  }}
                />
              )}
            </div>

            {activeStory.caption && (
              <p
                style={{
                  position:
                    "absolute",

                  left:
                    "18px",

                  right:
                    "18px",

                  bottom:
                    "18px",

                  zIndex:
                    2,

                  margin:
                    0,

                  padding:
                    "12px 14px",

                  borderRadius:
                    "12px",

                  background:
                    "rgba(0,0,0,.52)",

                  color:
                    "#fff",
                }}
              >
                {
                  activeStory.caption
                }
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

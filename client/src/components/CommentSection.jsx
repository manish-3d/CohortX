import { useEffect, useState } from "react";

import api from "../services/api";

export default function CommentSection({
  projectId,
  count = 0,
}) {
  const [comments, setComments] =
    useState([]);

  const [content, setContent] =
    useState("");

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (open) {
      loadComments();
    }
  }, [open]);

  async function loadComments() {
    try {
      const res =
        await api.get(
          `/projects/${projectId}/comments`
        );

      setComments(
        res.data
      );

    } catch {
      alert(
        "Comments failed"
      );
    }
  }

  async function addComment() {
    if (
      !content.trim()
    ) {
      return;
    }

    try {
      const res =
        await api.post(
          `/projects/${projectId}/comments`,
          {
            content,
          }
        );

      setComments(
        [
          ...comments,
          res.data,
        ]
      );

      setContent("");

    } catch {
      alert(
        "Failed"
      );
    }
  }

  const preview =
    comments[0];

  return (
    <>
      {preview && (
        <div>
          <strong>
            {
              preview.user
                ?.username
            }
          </strong>

          {" "}

          {
            preview.content
          }
        </div>
      )}

      <button
        onClick={() =>
          setOpen(
            true
          )
        }

        style={{
          background:
            "transparent",

          color:
            "#666",

          padding:
            0,
        }}
      >
        View all {count} comments
      </button>

      {open && (
        <div
          style={{
            position:
              "fixed",

            inset:
              0,

            background:
              "rgba(0,0,0,.5)",

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background:
                "white",

              width:
                "600px",

              maxHeight:
                "80vh",

              overflow:
                "auto",

              padding:
                "30px",

              borderRadius:
                "20px",
            }}
          >
            <button
              onClick={() =>
                setOpen(
                  false
                )
              }
            >
              ✕

            </button>

            <h2>
              Comments
            </h2>

            {comments.map(
              (
                comment
              ) => (
                <div
                  key={
                    comment.id
                  }

                  style={{
                    marginBottom:
                      "20px",
                  }}
                >
                  <strong>
                    {
                      comment.user
                        ?.username
                    }
                  </strong>

                  <p>
                    {
                      comment.content
                    }
                  </p>
                </div>
              )
            )}

            <input
              value={
                content
              }

              onChange={
                (
                  e
                ) =>
                  setContent(
                    e.target
                      .value
                  )
              }

              placeholder="Add comment"
            />

            <br />

            <button
              onClick={
                addComment
              }
            >
              Post
            </button>
          </div>
        </div>
      )}
    </>
  );
}
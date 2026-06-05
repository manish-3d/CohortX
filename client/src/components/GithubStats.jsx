import { useEffect, useState } from "react";

import api from "../services/api";

import GithubHeatmap from "./GithubHeatmap";
import PageLoader from "./PageLoader";

export default function GithubStats({
  username,
}) {
  const [heatmap, setHeatmap] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (open) {
      loadHeatmap();
    }
  }, [open]);

  async function loadHeatmap() {
    try {
      setLoading(true);

      const res =
        await api.get(
          `/github/${username}`
        );

      setHeatmap(
        res.data.heatmap || []
      );

    } catch {

      alert(
        "Failed to load activity"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <>
      <button
        onClick={() =>
          setOpen(
            true
          )
        }
      >
        View Contributions
      </button>

      {open && (
        <div
          style={{
            position:
              "fixed",

            inset: 0,

            background:
              "rgba(0,0,0,.6)",

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            zIndex:
              1000,
          }}
        >
          <div
            style={{
              width:
                "850px",

              background:
                "#fff",

              borderRadius:
                "18px",

              padding:
                "30px",

              position:
                "relative",

              boxShadow:
                "0 20px 50px rgba(0,0,0,.2)",
            }}
          >
            <button
              onClick={() =>
                setOpen(
                  false
                )
              }

              style={{
                position:
                  "absolute",

                right:
                  "20px",

                top:
                  "20px",
              }}
            >
              ✕
            </button>

            <h2>
              Contribution Activity
            </h2>

            <p>
              @{username}
            </p>

            <br />

            {loading ? (
              <PageLoader
                text="Loading contributions..."
                minHeight="260px"
              />
            ) : (
              <GithubHeatmap
                data={
                  heatmap
                }
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

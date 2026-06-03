import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";

export default function Feed() {
  const [
    projects,

    setProjects,

  ] = useState([]);

  useEffect(() => {
    fetchFeed();
  }, []);

  async function fetchFeed() {
    try {
      const res =
        await api.get(
          "/feed"
        );

      setProjects(
        res.data
      );
    } catch {
      alert(
        "Feed failed"
      );
    }
  }

  return (
    <div>

      <Navbar />

      <div
        style={{
          padding:
            "30px",
        }}
      >
        <h1>
          Feed
        </h1>

        {projects.map(
          project => (
            <div
              key={
                project.id
              }
            >
              <h2>
                {
                  project.title
                }
              </h2>

              <p>
                {
                  project.description
                }
              </p>

              <small>

                By

                {" "}

                {
                  project.author
                    .username
                }

              </small>

              <hr />
            </div>
          )
        )}
      </div>

    </div>
  );
}
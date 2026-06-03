import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Search() {
  const [
    q,
    setQ,
  ] = useState("");

  const [
    users,
    setUsers,
  ] = useState([]);

  async function search(e) {
    e.preventDefault();

    const query =
      q.trim();

    if (!query) {
      setUsers([]);
      return;
    }

    try {
      const res =
        await api.get(
          `/users/search?q=${encodeURIComponent(query)}`
        );

      setUsers(
        res.data
      );
    } catch (err) {
      alert(
        err.response
          ?.data
          ?.message ||
        err.response
          ?.data
          ?.error ||
        "Search failed"
      );
    }
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-column">
        <header className="page-header">
          <div>
            <h1 className="page-title">
              Discover
            </h1>

            <p className="page-subtitle">
              Find builders, founders, and collaborators
            </p>
          </div>
        </header>

        <section className="form-panel">
          <form
            className="comment-form"
            onSubmit={search}
          >
            <input
              placeholder="Search by username"
              value={q}
              onChange={(e) =>
                setQ(
                  e.target.value
                )
              }
            />

            <button
              className="primary-button"
              type="submit"
            >
              Search
            </button>
          </form>
        </section>

        {users.length === 0 ? (
          <div className="feed-empty">
            Search for a username to discover builders.
          </div>
        ) : (
          users.map((user) => (
            <article
              className="post-card"
              key={user.id}
            >
              <Link
                className="avatar"
                to={`/profile/${user.username}`}
              >
                {user.username?.[0] || "B"}
              </Link>

              <div>
                <div className="post-head">
                  <Link
                    className="account-name"
                    to={`/profile/${user.username}`}
                  >
                    {user.username}
                  </Link>

                  <span className="post-meta">
                    @{user.username}
                  </span>
                </div>

                <p className="post-body">
                  {user.bio ||
                    "Building in public on CohortX."}
                </p>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

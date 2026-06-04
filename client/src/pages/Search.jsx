import { useState } from "react";

import { Link } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";

export default function Search() {
  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  async function handleSearch() {
    if (!query.trim()) {
      return;
    }

    try {
      const res =
        await api.get(
          `/users/search?q=${query}`
        );

      setUsers(
        res.data
      );

    } catch {
      alert(
        "Search failed"
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
          Discover Builders
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            placeholder="Search users"

            value={query}

            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
          />

          <button
            onClick={
              handleSearch
            }
          >
            Search
          </button>
        </div>

        <br />

        {users.map(
          (user) => (
            <div
              key={user.id}
            >
              <Link
                to={`/profile/${user.username}`}
              >
                @{user.username}
              </Link>

              <p>
                {user.bio}
              </p>

              <hr />
            </div>
          )
        )}
      </div>
    </div>
  );
}
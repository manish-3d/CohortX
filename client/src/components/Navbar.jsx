import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function Navbar() {
  const navigate =
    useNavigate();

  const auth =
    useAuth();

  if (!auth) {
    return null;
  }

  const {
    user,
    setUser,
  } = auth;

  async function handleLogout() {
    try {
      await api.post(
        "/auth/logout"
      );

      setUser(
        null
      );

      navigate(
        "/login"
      );

    } catch {
      alert(
        "Logout failed"
      );
    }
  }

  return (
    <nav
      style={{
        display:
          "flex",

        justifyContent:
          "space-between",

        alignItems:
          "center",

        padding:
          "20px 40px",

        background:
          "#fff",

        borderBottom:
          "1px solid #eee",
      }}
    >
      <Link
        to="/feed"

        style={{
          fontSize:
            "28px",

          fontWeight:
            "700",
        }}
      >
        CohortX
      </Link>

      <div
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            "30px",
        }}
      >
        <Link to="/create">
          Create
        </Link>

        <Link to="/explore">
          Explore
        </Link>

        <Link to="/search">
          Discover
        </Link>

        <Link
          to="/profile/edit"
        >
          Edit Profile
        </Link>

        <Link
          to={`/profile/${user?.username}`}
        >
          <img
            src={
              user?.avatar ||

              "https://placehold.co/40"
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
                "2px solid #ddd",
            }}
          />
        </Link>

        <button
          onClick={
            handleLogout
          }
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
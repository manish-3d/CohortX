
import {
  useState,
} from "react";

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

  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );

  if (!auth) {
    return null;
  }

  const {
    user,
    setUser,
  } =
    auth;

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

    }

    catch {

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
          "rgba(255,255,255,.82)",

        backdropFilter:
          "blur(18px)",

        borderBottom:
          "1px solid rgba(17,24,39,.07)",

        boxShadow:
          "0 18px 50px rgba(17,24,39,.05)",

      }}

    >

      <Link

        to="/feed"

        style={{

          fontSize:
            "28px",

          fontWeight:
            "700",

          textDecoration:
            "none",

          color:
            "black",

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
            "26px",

        }}

      >

        {/* CREATE */}

        <div

          style={{
            position:
              "relative",
          }}

        >

          <button

            onClick={() =>
              setOpen(
                !open
              )
            }

            style={{

              padding:
                "10px 18px",

              border:
                "none",

              borderRadius:
                "10px",

              background:
                "#080809",

              color:
                "white",

              cursor:
                "pointer",

            }}

          >

            + Create

          </button>

          {

            open && (

              <div

                style={{

                  position:
                    "absolute",

                  top:
                    "120%",

                  right:
                    0,

                  width:
                    "180px",

                  background:
                    "white",

                  border:
                    "1px solid #eee",

                  borderRadius:
                    "14px",

                  overflow:
                    "hidden",

                  boxShadow:
                    "0 10px 25px rgba(0,0,0,.1)",

                }}

              >

                <Link

                  to="/create"

                  onClick={() =>
                    setOpen(
                      false
                    )
                  }

                  style={{

                    display:
                      "block",

                    padding:
                      "14px",

                    textDecoration:
                      "none",

                    color:
                      "black",

                  }}

                >

                  + New Project

                </Link>

                <Link

                  to="/story/create"

                  onClick={() =>
                    setOpen(
                      false
                    )
                  }

                  style={{

                    display:
                      "block",

                    padding:
                      "14px",

                    textDecoration:
                      "none",

                    color:
                      "black",

                  }}

                >

                  + New Story

                </Link>

              </div>

            )

          }

        </div>

        <Link
          to="/explore"
        >
          Explore
        </Link>

        <Link
          to="/search"
        >
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

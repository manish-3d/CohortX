import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",

    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      login(res.data.user, res.data.token);

      navigate("/feed");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const input = {
    width: "100%",

    height: 60,

    border: 0,

    borderRadius: 18,

    padding: "0 20px",

    background: "rgba(255,255,255,.6)",

    backdropFilter: "blur(20px)",

    outline: "none",

    fontSize: 16,
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        position: "relative",

        overflow: "hidden",

        display: "grid",

        placeItems: "center",

        background: `
          linear-gradient(
            180deg,
            #eef8ff,
            #ffffff
          )
        `,
      }}
    >
      <div
        style={{
          position: "absolute",

          inset: -300,

          background: `
            radial-gradient(
              circle,
              rgba(29,155,240,.35),
              transparent 60%
            )
          `,

          animation: "river 14s ease infinite",
        }}
      />

      <style>
        {`
        @keyframes river{
          0%{
            transform:
            translateX(-15%)
            rotate(0deg);
          }

          50%{
            transform:
            translateX(15%)
            rotate(6deg);
          }

          100%{
            transform:
            translateX(-15%)
            rotate(0deg);
          }
        }

        @keyframes float{
          from{
            transform:
            translateY(0);
          }

          to{
            transform:
            translateY(-10px);
          }
        }
      `}
      </style>

      <div
        style={{
          width: "100%",

          maxWidth: 520,

          margin: 24,

          padding: 42,

          borderRadius: 36,

          background: "rgba(255,255,255,.62)",

          backdropFilter: "blur(30px)",

          boxShadow: "0 40px 120px rgba(29,155,240,.16)",

          position: "relative",

          zIndex: 10,

          animation: "float 4s ease-in-out infinite alternate",
        }}
      >
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              margin: 0,

              fontSize: 52,
            }}
          >
            Welcome
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Enter the flow
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 18,
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={input}
          />

          <button
            disabled={loading}
            style={{
              height: 62,

              border: 0,

              borderRadius: 999,

              cursor: "pointer",

              background: `
                linear-gradient(
                  135deg,
                  #1d9bf0,
                  #4fb6ff
                )
              `,

              color: "#fff",

              fontWeight: 800,

              fontSize: 16,

              transition: ".2s",
            }}
          >
            {loading ? "Entering..." : "Login"}
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = `${
                import.meta.env.VITE_API_URL || "http://localhost:5000"
              }/auth/github`;
            }}
            style={{
              width: "100%",

              marginTop: 14,

              height: 58,

              border: 0,

              borderRadius: 16,

              background: "#111827",

              color: "#fff",

              cursor: "pointer",

              fontWeight: 700,
            }}
          >
            Continue with GitHub
          </button>
        </form>

        <p
          style={{
            marginTop: 28,

            color: "#64748b",
          }}
        >
          No account?{" "}
          <Link
            to="/register"
            style={{
              color: "#1d9bf0",

              fontWeight: 700,
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

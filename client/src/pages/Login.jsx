import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function Login() {
  const navigate =
    useNavigate();

  const {
    setUser,
  } = useAuth();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  async function handleSubmit(
    e
  ) {
    e.preventDefault();

    try {
      const res =
        await api.post(
          "/auth/login",
          form
        );

      setUser(
        res.data.user
      );

      navigate("/");
    } catch (err) {
      alert(
        "Login failed"
      );
    }
  }

  function handleChange(
    e
  ) {
    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  }

  return (
    <div>
      <h1>
        Login
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={
            form.email
          }
          onChange={
            handleChange
          }
        />

        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={
            form.password
          }
          onChange={
            handleChange
          }
        />

        <br />

        <button
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}
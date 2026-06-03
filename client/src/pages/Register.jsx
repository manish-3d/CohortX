
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function submit(e) {
    e.preventDefault();

    try {
      await api.post(
        "/auth/register",
        form
      );

      navigate("/login");
    } catch (err) {
      alert(
        err.response.data.message
      );
    }
  }

  return (
    <div>
      <h1>
        Register
      </h1>

      <form
        onSubmit={submit}
      >
        <input
          placeholder="Username"
          value={
            form.username
          }
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value,
            })
          }
        />

        <br />

        <input
          placeholder="Email"
          value={
            form.email
          }
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={
            form.password
          }
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <br />

        <button>
          Register
        </button>
      </form>
    </div>
  );
}

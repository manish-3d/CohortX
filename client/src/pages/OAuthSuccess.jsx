import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function finishLogin() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        localStorage.setItem("token", token);

        const res = await api.get("/auth/me");

        login(res.data, token);
        navigate("/feed", { replace: true });
      } catch {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    }

    finishLogin();
  }, [login, navigate]);

  return <div>Logging in...</div>;
}

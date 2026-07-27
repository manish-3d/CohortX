import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./RedirectLogin.css";

import { Lock, Infinity, Shield, ArrowLeft, Info } from "lucide-react";

/* ── ICONS ────────────────────────────────────────────────── */
function GithubIcon() {
  return (
    <svg className="oauth-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="oauth-icon" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/* ── OCEAN CANVAS ─────────────────────────────────────────── */
function OceanCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const tRef = useRef(0);
  const lastTimeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -0.05 - Math.random() * 0.15,
      alpha: 0.1 + Math.random() * 0.4,
    }));

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function drawWave(t, opts) {
      const { W, H, amplitude, frequency, speed, yBase, color, blur } = opts;
      ctx.save();
      if (blur) {
        ctx.filter = `blur(${blur}px)`;
      }
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 2) {
        const y =
          yBase +
          Math.sin(x * frequency + t * speed) * amplitude +
          Math.sin(x * frequency * 1.7 + t * speed * 0.8) * (amplitude * 0.4) +
          Math.sin(x * frequency * 0.4 + t * speed * 1.3) * (amplitude * 0.6);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function draw(timestamp) {
      const dt =
        lastTimeRef.current === null
          ? 1 / 60
          : Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      const frameScale = dt * 60;
      lastTimeRef.current = timestamp;
      tRef.current = timestamp * 0.001;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#050505");
      bg.addColorStop(0.5, "#0b0b0b");
      bg.addColorStop(1, "#020202");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(
        W * 0.5,
        H * 0.85,
        0,
        W * 0.5,
        H * 0.85,
        W * 0.65
      );
      glow.addColorStop(0, "rgba(255,255,255,0.06)");
      glow.addColorStop(0.5, "rgba(255,255,255,0.02)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const glow2 = ctx.createRadialGradient(
        W * 0.1,
        H * 0.2,
        0,
        W * 0.1,
        H * 0.2,
        W * 0.4
      );
      glow2.addColorStop(0, "rgba(255,255,255,0.04)");
      glow2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, W, H);

      const waves = [
        {
          amplitude: H * 0.055,
          frequency: 0.0018,
          speed: 0.22,
          yBase: H * 0.68,
          color: "rgba(15,15,15,0.85)",
          blur: 4,
        },
        {
          amplitude: H * 0.05,
          frequency: 0.0022,
          speed: 0.3,
          yBase: H * 0.72,
          color: "rgba(20,20,20,0.88)",
          blur: 3,
        },
        {
          amplitude: H * 0.045,
          frequency: 0.0028,
          speed: 0.38,
          yBase: H * 0.76,
          color: "rgba(25,25,25,0.90)",
          blur: 2,
        },
        {
          amplitude: H * 0.042,
          frequency: 0.0034,
          speed: 0.46,
          yBase: H * 0.8,
          color: "rgba(30,30,30,0.92)",
          blur: 2,
        },
        {
          amplitude: H * 0.038,
          frequency: 0.004,
          speed: 0.55,
          yBase: H * 0.83,
          color: "rgba(35,35,35,0.94)",
          blur: 1,
        },
        {
          amplitude: H * 0.032,
          frequency: 0.005,
          speed: 0.64,
          yBase: H * 0.86,
          color: "rgba(40,40,40,0.95)",
          blur: 0,
        },
        {
          amplitude: H * 0.028,
          frequency: 0.006,
          speed: 0.75,
          yBase: H * 0.89,
          color: "rgba(45,45,45,0.96)",
          blur: 0,
        },
        {
          amplitude: H * 0.024,
          frequency: 0.007,
          speed: 0.85,
          yBase: H * 0.91,
          color: "rgba(50,50,50,0.97)",
          blur: 0,
        },
        {
          amplitude: H * 0.02,
          frequency: 0.0085,
          speed: 1.0,
          yBase: H * 0.93,
          color: "rgba(60,60,60,0.98)",
          blur: 0,
        },
        {
          amplitude: H * 0.015,
          frequency: 0.01,
          speed: 1.2,
          yBase: H * 0.955,
          color: "rgba(80,80,80,0.60)",
          blur: 0,
        },
      ];

      waves.forEach((w) => drawWave(t, { W, H, ...w }));

      ctx.save();
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < 5; i++) {
        const yOff = H * (0.9 + i * 0.018);
        const freq = 0.008 + i * 0.001;
        const spd = 1.1 + i * 0.15;
        ctx.beginPath();
        for (let x = 0; x < W; x += 3) {
          const y = yOff + Math.sin(x * freq + t * spd) * H * 0.008;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(200,200,200,${0.25 - i * 0.03})`;
        ctx.lineWidth = 1.5 - i * 0.2;
        ctx.stroke();
      }
      ctx.restore();

      particles.forEach((p) => {
        p.x += (p.vx + Math.sin(t * 0.3 + p.y * 0.01) * 0.08) * frameScale;
        p.y += p.vy * frameScale;
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * (0.6 + 0.4 * Math.sin(t + p.x))})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="ocean-canvas" />;
}

/* ── CARD TILT ────────────────────────────────────────────── */
function useTilt(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateZ(8px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

/* ── MAIN ─────────────────────────────────────────────────── */
export default function RedirectLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const cardRef = useRef(null);
  useTilt(cardRef);

  // Where to send the user after a successful login — e.g. ?redirect=/projects/42
  const redirectTo = searchParams.get("redirect") || "/feed";
  const reason = searchParams.get("reason"); // e.g. "session_expired", "auth_required"

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, form);

      login(res.data.user, res.data.token);
      navigate(redirectTo);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          `${tab === "login" ? "Login" : "Registration"} failed`
      );
    } finally {
      setLoading(false);
    }
  }

  function githubLogin() {
    const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const params = new URLSearchParams({ redirect: redirectTo });
    window.location.href = `${base}/auth/github?${params.toString()}`;
  }

  const noticeCopy =
    reason === "session_expired"
      ? "Your session expired. Sign back in to continue."
      : "You'll need to sign in before continuing.";

  return (
    <div className="rl-root">
      <OceanCanvas />

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="rl-nav">
        <Link to="/" className="rl-logo">
          Cohort<span className="rl-logo-x">X</span>
        </Link>
        <div className="rl-nav-note">
          New here? <Link to="/">Learn more</Link>
        </div>
      </nav>

      {/* ── CENTER STAGE ────────────────────────────────── */}
      <div className="rl-stage">
        <div className="rl-stage-inner">
          {reason && (
            <div className="rl-notice">
              <Info size={16} strokeWidth={2} />
              <span>{noticeCopy}</span>
            </div>
          )}

          <div className="login-card" id="login-card" ref={cardRef}>
            <div className="card-head">
              <h2>{tab === "login" ? "Welcome back" : "Join CohortX"}</h2>
              <p>
                {tab === "login"
                  ? "Sign in to your developer network"
                  : "Create your free account today"}
              </p>
            </div>

            {/* TABS */}
            <div className="tab-toggle">
              {["login", "register"].map((t) => (
                <button
                  key={t}
                  className={`tab-btn${tab === t ? " active" : ""}`}
                  onClick={() => setTab(t)}
                  type="button"
                >
                  {t === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            {/* OAUTH */}
            <div className="oauth-row">
              <button className="oauth-btn" onClick={githubLogin} type="button">
                <GithubIcon /> GitHub
              </button>
              <button className="oauth-btn" type="button">
                <GoogleIcon /> Google
              </button>
            </div>

            <div className="divider">
              <span>or continue with email</span>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="login-form">
              {tab === "register" && (
                <div className="form-field">
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    id="f-user"
                  />
                  <label htmlFor="f-user">Username</label>
                </div>
              )}
              <div className="form-field">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  id="f-email"
                />
                <label htmlFor="f-email">Email address</label>
              </div>
              <div className="form-field">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  id="f-pass"
                />
                <label htmlFor="f-pass">Password</label>
              </div>

              {tab === "login" && (
                <div className="form-row-meta">
                  <label className="remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <a href="#">Forgot password?</a>
                </div>
              )}

              <button className="btn-login" disabled={loading}>
                {loading
                  ? "Please wait…"
                  : tab === "login"
                    ? "Sign In to CohortX"
                    : "Create Account"}
              </button>
            </form>

            <p className="register-link">
              {tab === "login" ? (
                <>
                  No account?{" "}
                  <a onClick={() => setTab("register")}>Register free</a>
                </>
              ) : (
                <>
                  Have an account?{" "}
                  <a onClick={() => setTab("login")}>Sign in</a>
                </>
              )}
            </p>

            <div className="trust-badges">
              {[
                { icon: Lock, label: "Secure" },
                { icon: Infinity, label: "Free Forever" },
                { icon: Shield, label: "Private" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="trust-badge">
                  <Icon size={12} strokeWidth={2.5} /> {label}
                </div>
              ))}
            </div>
          </div>

          <Link to="/" className="rl-back">
            <ArrowLeft size={14} strokeWidth={2} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

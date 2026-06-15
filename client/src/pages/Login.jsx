import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

import {
  Rocket,
  User,
  Zap,
  Video,
  MessageCircle,
  Briefcase,
  Star,
  Flame,
  CheckCircle,
  Lock,
  Globe,
  Shield,
  Infinity,
  BadgeCheck,
} from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Rocket,
    title: "Share Projects",
    desc: "Publish your builds with rich project pages — demos, repos, tech stacks. Get discovered by devs and recruiters worldwide.",
  },
  {
    icon: User,
    title: "Dev Profiles",
    desc: "Your developer identity — skills, contributions, followers, portfolio. Think LinkedIn meets GitHub, but social-first.",
  },
  {
    icon: Zap,
    title: "Stories & Highlights",
    desc: "Share code snippets, milestones, and quick updates like stories. Keep your network in the loop without a full post.",
  },
  {
    icon: Video,
    title: "Go Live",
    desc: "Stream your coding sessions, debug live, do pair programming. Real-time collaboration baked right in.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    desc: "DMs, group threads, code-sharing. Fast async or live — your workflow, your choice.",
  },
  {
    icon: Briefcase,
    title: "Hire & Get Hired",
    desc: "Post jobs, apply with your CohortX profile, schedule interviews — the whole hiring loop in one place.",
  },
];

const TESTIMONIALS = [
  {
    text: "CohortX replaced my LinkedIn, GitHub README updates and Slack for team chats. It's the dev social network I always wanted.",
    name: "Arjun Mehta",
    role: "Senior SWE @ Stripe",
    initials: "AM",
  },
  {
    text: "I landed my current job through CohortX. Posted a project, a recruiter saw it, three interviews later — hired.",
    name: "Priya Sharma",
    role: "Frontend Lead @ Razorpay",
    initials: "PS",
  },
  {
    text: "The live coding feature is insane. I went live once to debug a gnarly Prisma query and got 40 people helping me in real-time.",
    name: "Dev Patel",
    role: "Full-stack Engineer",
    initials: "DP",
  },
];

const TAGS = [
  "React",
  "Node.js",
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "Prisma",
  "GraphQL",
  "Docker",
  "AWS",
  "Go",
  "Rust",
  "Python",
  "FastAPI",
  "Kubernetes",
  "Redis",
  "MongoDB",
  "WebSockets",
  "Open Source",
];

const FLOAT_CARDS = [
  { icon: Zap, label: "12k+ Projects", sub: "Shared this month" },
  { icon: Flame, label: "4.2k Live Now", sub: "Active developers" },
  { icon: CheckCircle, label: "890 Jobs Posted", sub: "This week" },
];

/* ── GITHUB SVG ───────────────────────────────────────────── */
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

/* ── COMPONENT ────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });

  const tagsDouble = useMemo(() => [...TAGS, ...TAGS], []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  function githubLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/github`;
  }

  return (
    <div className="cx-root">
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="cx-nav">
        <div className="cx-logo">
          Cohort<span>X</span>
        </div>
        <ul className="cx-nav-links">
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#community">Community</a>
          </li>
          <li>
            <a href="#jobs">Jobs</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
        </ul>
        <div className="cx-nav-cta">
          <button
            className="btn-ghost"
            onClick={() =>
              document
                .getElementById("login-card")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Sign in
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setTab("register");
              document
                .getElementById("login-card")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Join Free
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="cx-hero">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-eyebrow">The Developer Social Network</div>

          <h1 className="hero-h1">
            Build.
            <br />
            Share.
            <br />
            <span className="accent">Connect.</span>
          </h1>

          <p className="hero-sub">
            CohortX is where developers grow — share projects, collaborate live,
            find jobs, and build real connections inside one premium ecosystem.
            Think Instagram + LinkedIn, made for engineers.
          </p>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => {
                setTab("register");
                document
                  .getElementById("login-card")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started Free →
            </button>
            <button className="btn-hero-secondary" onClick={githubLogin}>
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">42k+</div>
              <div className="stat-label">Developers</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">12k+</div>
              <div className="stat-label">Projects Shared</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">890+</div>
              <div className="stat-label">Jobs Posted</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">4.2k</div>
              <div className="stat-label">Live Right Now</div>
            </div>
          </div>

          {/* Floating mini-cards */}
          <div className="float-cards">
            {FLOAT_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="float-card">
                  <div className="float-card-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="float-card-text">
                    <div className="label">{c.label}</div>
                    <div className="sub">{c.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Login/Register Card */}
        <div className="login-card" id="login-card">
          <div className="card-head">
            <h2>{tab === "login" ? "Welcome back" : "Join CohortX"}</h2>
            <p>
              {tab === "login"
                ? "Sign in to your developer network"
                : "Create your free account today"}
            </p>
          </div>

          {/* Tab toggle */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 24,
              background: "rgba(29,155,240,.08)",
              borderRadius: 14,
              padding: 4,
            }}
          >
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 38,
                  borderRadius: 10,
                  border: "none",
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? "#071326" : "#4a7fa5",
                  fontWeight: tab === t ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  boxShadow:
                    tab === t ? "0 2px 8px rgba(29,155,240,.12)" : "none",
                  transition: "all .2s",
                  fontFamily: "inherit",
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* OAuth */}
          <div className="oauth-row">
            <button className="oauth-btn" onClick={githubLogin}>
              <GithubIcon /> GitHub
            </button>
            <button className="oauth-btn">
              <GoogleIcon /> Google
            </button>
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {tab === "register" && (
              <div className="form-field">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                />
              </div>
            )}
            <div className="form-field">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
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
                ? "Please wait..."
                : tab === "login"
                  ? "Sign In to CohortX"
                  : "Create Account"}
            </button>
          </form>

          <p className="register-link">
            {tab === "login" ? (
              <>
                No account?{" "}
                <a onClick={() => setTab("register")} href="#">
                  Register free
                </a>
              </>
            ) : (
              <>
                Have an account?{" "}
                <a onClick={() => setTab("login")} href="#">
                  Sign in
                </a>
              </>
            )}
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(29,155,240,.1)",
            }}
          >
            {[
              { icon: Lock, label: "Secure" },
              { icon: Infinity, label: "Free Forever" },
              { icon: Zap, label: "Instant Access" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "#4a7fa5",
                  fontWeight: 600,
                }}
              >
                <Icon size={12} strokeWidth={2.5} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLLING TAGS ──────────────────────────────── */}
      <div className="cx-tags">
        <div className="tags-track">
          {tagsDouble.map((t, i) => (
            <div key={i} className="tag-pill">
              <span>#</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── SOCIAL PROOF STRIP ──────────────────────────── */}
      <div className="cx-proof">
        {[
          { icon: Star, text: "Rated 4.9/5 by developers" },
          { icon: Rocket, text: "42,000+ active members" },
          { icon: Briefcase, text: "890+ companies hiring" },
          { icon: Shield, text: "Enterprise-grade security" },
          { icon: Globe, text: "60+ countries" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="proof-item">
            <span className="proof-icon">
              <Icon size={15} strokeWidth={2} />
            </span>
            {text}
          </div>
        ))}
      </div>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section className="cx-features" id="features">
        <div className="section-label">Everything you need</div>
        <h2 className="section-title">
          Built for how developers actually work
        </h2>
        <div className="feat-grid">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="feat-card">
                <div className="feat-icon">
                  <Icon size={26} strokeWidth={1.8} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="cx-testimonials" id="community">
        <div className="section-label">Developer stories</div>
        <h2 className="section-title">Loved by engineers</h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testi-card">
              <div className="testi-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#1d9bf0" color="#1d9bf0" />
                ))}
              </div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────── */}
      <div className="cx-cta">
        <h2>Your developer network awaits</h2>
        <p>
          Join 42,000+ engineers building, sharing, and growing together on
          CohortX
        </p>
        <button
          className="btn-cta"
          onClick={() => {
            setTab("register");
            document
              .getElementById("login-card")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          Create Free Account →
        </button>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="cx-footer">
        <div className="cx-footer-logo">
          Cohort<span>X</span>
        </div>
        <div>Build. Share. Connect. — The Developer Social Network</div>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="#" style={{ color: "#4a7fa5", textDecoration: "none" }}>
            Privacy
          </a>
          <a href="#" style={{ color: "#4a7fa5", textDecoration: "none" }}>
            Terms
          </a>
          <a href="#" style={{ color: "#4a7fa5", textDecoration: "none" }}>
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}

import { useMemo, useState, useEffect, useRef } from "react";
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
  Lock,
  Globe,
  Shield,
  Infinity,
  ArrowRight,
} from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Rocket,
    title: "Ship Projects",
    desc: "Publish your builds with rich project pages — demos, repos, tech stacks. Get discovered by developers and hiring teams worldwide.",
  },
  {
    icon: User,
    title: "Dev Profiles",
    desc: "Your developer identity — skills, contributions, followers, portfolio. LinkedIn meets GitHub, but actually social.",
  },
  {
    icon: Zap,
    title: "Stories & Drops",
    desc: "Share code snippets, milestones, and quick updates. Keep your network in the loop without a full post.",
  },
  {
    icon: Video,
    title: "Live Coding",
    desc: "Stream sessions, debug live, do pair programming. Real-time collaboration baked in — no third-party tools needed.",
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    desc: "DMs, group threads, code-sharing. Fast async or live — your workflow, your choice.",
  },
  {
    icon: Briefcase,
    title: "Hire & Get Hired",
    desc: "Post roles, apply with your CohortX profile, schedule interviews — the entire hiring loop, one place.",
  },
];

const TESTIMONIALS = [
  {
    text: "CohortX replaced LinkedIn, GitHub README updates, and Slack for team chats. It's the developer social network I always wanted.",
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
    text: "The live coding feature is incredible. I went live to debug a gnarly query and got 40 people helping me in real-time.",
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
  { icon: Zap, label: "Projects Live", sub: "Shared this month" },
  { icon: Star, label: "Active Devs", sub: "Online right now" },
  { icon: Briefcase, label: "Roles Posted", sub: "This week" },
];

const PROOF = [
  { icon: Star, text: "Rated 4.9 / 5 by developers" },
  { icon: Rocket, text: "Growing developer community" },
  { icon: Briefcase, text: "Companies actively hiring" },
  { icon: Shield, text: "Enterprise-grade security" },
  { icon: Globe, text: "60+ countries" },
];

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 80;
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
      tRef.current = timestamp * 0.001;
      const t = tRef.current;
      const W = canvas.width;
      const H = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#020b16");
      bg.addColorStop(0.4, "#030f1f");
      bg.addColorStop(1, "#010810");
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
      glow.addColorStop(0, "rgba(13,68,140,0.25)");
      glow.addColorStop(0.5, "rgba(8,40,88,0.10)");
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
      glow2.addColorStop(0, "rgba(15,90,160,0.12)");
      glow2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, W, H);

      const waves = [
        {
          amplitude: H * 0.055,
          frequency: 0.0018,
          speed: 0.22,
          yBase: H * 0.68,
          color: "rgba(5,28,58,0.80)",
          blur: 4,
        },
        {
          amplitude: H * 0.05,
          frequency: 0.0022,
          speed: 0.3,
          yBase: H * 0.72,
          color: "rgba(7,38,75,0.85)",
          blur: 3,
        },
        {
          amplitude: H * 0.045,
          frequency: 0.0028,
          speed: 0.38,
          yBase: H * 0.76,
          color: "rgba(9,50,96,0.88)",
          blur: 2,
        },
        {
          amplitude: H * 0.042,
          frequency: 0.0034,
          speed: 0.46,
          yBase: H * 0.8,
          color: "rgba(11,60,112,0.90)",
          blur: 2,
        },
        {
          amplitude: H * 0.038,
          frequency: 0.004,
          speed: 0.55,
          yBase: H * 0.83,
          color: "rgba(13,72,128,0.92)",
          blur: 1,
        },
        {
          amplitude: H * 0.032,
          frequency: 0.005,
          speed: 0.64,
          yBase: H * 0.86,
          color: "rgba(16,85,148,0.93)",
          blur: 0,
        },
        {
          amplitude: H * 0.028,
          frequency: 0.006,
          speed: 0.75,
          yBase: H * 0.89,
          color: "rgba(18,100,168,0.94)",
          blur: 0,
        },
        {
          amplitude: H * 0.024,
          frequency: 0.007,
          speed: 0.85,
          yBase: H * 0.91,
          color: "rgba(20,112,186,0.95)",
          blur: 0,
        },
        {
          amplitude: H * 0.02,
          frequency: 0.0085,
          speed: 1.0,
          yBase: H * 0.93,
          color: "rgba(22,124,205,0.96)",
          blur: 0,
        },
        {
          amplitude: H * 0.015,
          frequency: 0.01,
          speed: 1.2,
          yBase: H * 0.955,
          color: "rgba(29,155,240,0.55)",
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
        ctx.strokeStyle = `rgba(150,210,255,${0.35 - i * 0.04})`;
        ctx.lineWidth = 1.5 - i * 0.2;
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < 3; i++) {
        const yOff = H * (0.7 + i * 0.07);
        ctx.beginPath();
        for (let x = 0; x < W; x += 2) {
          const y = yOff + Math.sin(x * 0.003 + t * 0.4 + i * 1.5) * H * 0.025;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.3, "rgba(66,176,245,0.8)");
        grad.addColorStop(0.7, "rgba(29,155,240,0.6)");
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t * 0.3 + p.y * 0.01) * 0.08;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = H + 10;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,190,255,${p.alpha * (0.6 + 0.4 * Math.sin(t + p.x))})`;
        ctx.fill();
      });

      ctx.save();
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 6; i++) {
        const cx2 = W * (0.15 + 0.14 * i + Math.sin(t * 0.18 + i) * 0.04);
        const cy2 = H * (0.6 + Math.cos(t * 0.22 + i * 0.8) * 0.06);
        const rg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, W * 0.08);
        rg.addColorStop(0, "rgba(120,200,255,0.6)");
        rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="ocean-canvas" />;
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── NAV SCROLL ───────────────────────────────────────────── */
function useNavScroll() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return scrolled;
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
      el.style.transform = `perspective(1100px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateZ(10px)`;
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
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login");

  /* FIXED: Initialized username in state object */
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const cardRef = useRef(null);
  const tagsDouble = useMemo(() => [...TAGS, ...TAGS], []);
  const navScrolled = useNavScroll();

  useReveal();
  useTilt(cardRef);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);

      /* FIXED: Dynamically shift route based on current tab layout selection */
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, form);

      login(res.data.user, res.data.token);
      navigate("/feed");
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
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/github`;
  }

  function scrollToCard() {
    document
      .getElementById("login-card")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="cx-root">
      <OceanCanvas />

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className={`cx-nav${navScrolled ? " scrolled" : ""}`}>
        <div className="cx-logo">
          Cohort<span className="cx-logo-x">X</span>
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
          <button className="btn-ghost" onClick={scrollToCard}>
            Sign in
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setTab("register");
              scrollToCard();
            }}
          >
            Join Free
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="cx-hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            The Developer Social Network
          </div>

          <h1 className="hero-h1">
            <span className="word word-1">Build.</span>
            <span className="word word-2">Ship.</span>
            <span className="word word-3">Connect.</span>
          </h1>

          <p className="hero-sub">
            CohortX is where developers grow — share projects, collaborate live,
            find roles, and build real connections inside one premium ecosystem.
          </p>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => {
                setTab("register");
                scrollToCard();
              }}
            >
              Join CohortX <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <button className="btn-hero-secondary" onClick={githubLogin}>
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          <div className="float-cards">
            {FLOAT_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="float-card">
                  <div className="float-card-icon">
                    <Icon size={17} strokeWidth={2} />
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

        {/* RIGHT — LOGIN CARD */}
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

      {/* ── PROOF STRIP ─────────────────────────────────── */}
      <div className="cx-proof">
        {PROOF.map(({ icon: Icon, text }) => (
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
        <div className="reveal section-eyebrow">Everything you need</div>
        <h2 className="reveal section-title reveal-delay-1">
          Built for how developers actually work
        </h2>
        <p className="reveal section-sub reveal-delay-2">
          One network that replaces five tools. Less context-switching, more
          building.
        </p>
        <div className="feat-grid">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`feat-card reveal reveal-delay-${(i % 3) + 1}`}
              >
                <div className="feat-icon">
                  <Icon size={24} strokeWidth={1.8} />
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
        <div className="reveal section-eyebrow">Developer stories</div>
        <h2 className="reveal section-title reveal-delay-1">
          Trusted by engineers
        </h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`testi-card reveal reveal-delay-${i + 1}`}
            >
              <div className="testi-stars">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="#42b0f5" color="#42b0f5" />
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

      {/* ── CTA ─────────────────────────────────────────── */}
      <div className="cx-cta reveal" id="jobs">
        <h2>Your developer network awaits</h2>
        <p>
          Join engineers building, shipping, and growing together on CohortX.
        </p>
        <button
          className="btn-cta"
          onClick={() => {
            setTab("register");
            scrollToCard();
          }}
        >
          Create Free Account →
        </button>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="cx-footer" id="about">
        <div className="cx-footer-logo">
          Cohort<span>X</span>
        </div>
        <div>Build. Ship. Connect. — The Developer Social Network</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: "var(--text-dim)", textDecoration: "none" }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

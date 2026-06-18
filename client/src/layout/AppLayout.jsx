import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";
import { useEffect, useRef } from "react";

function OceanAsteroidCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    /* ── Particles (stars/foam) ── */
    const particles = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      a: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.18 + 0.04,
    }));

    /* ── Asteroids ── */
    function spawnAsteroid() {
      const side = Math.random();
      let x, y, vx, vy;
      if (side < 0.5) {
        x = Math.random() * canvas.width;
        y = -20;
        vx = (Math.random() - 0.5) * 1.4;
        vy = Math.random() * 2.2 + 1.2;
      } else {
        x = -20;
        y = Math.random() * canvas.height * 0.6;
        vx = Math.random() * 2.2 + 1.2;
        vy = Math.random() * 1.4 + 0.4;
      }
      return {
        x,
        y,
        vx,
        vy,
        size: Math.random() * 3.5 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        trail: [],
        opacity: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.5 ? "#1d9bf0" : "#42b0f5",
        glow: Math.random() > 0.6,
      };
    }

    const asteroids = Array.from({ length: 18 }, spawnAsteroid);

    /* ── Ocean waves ── */
    let tick = 0;

    function drawWave(yBase, amp, freq, speed, color, alpha) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 4) {
        const y =
          yBase +
          Math.sin(x * freq + tick * speed) * amp +
          Math.sin(x * freq * 1.7 + tick * speed * 0.6) * (amp * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawAsteroid(a) {
      /* trail */
      for (let i = 0; i < a.trail.length; i++) {
        const t = a.trail[i];
        const prog = i / a.trail.length;
        ctx.beginPath();
        ctx.arc(t.x, t.y, a.size * prog * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = a.color;
        ctx.globalAlpha = prog * a.opacity * 0.35;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* glow */
      if (a.glow) {
        const grd = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.size * 5);
        grd.addColorStop(0, a.color + "88");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* body */
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      const s = a.size;
      ctx.moveTo(0, -s * 1.4);
      ctx.lineTo(s * 0.6, -s * 0.3);
      ctx.lineTo(s * 1.2, s * 0.4);
      ctx.lineTo(s * 0.2, s * 1.1);
      ctx.lineTo(-s * 0.7, s * 0.9);
      ctx.lineTo(-s * 1.1, s * 0.1);
      ctx.lineTo(-s * 0.5, -s * 0.8);
      ctx.closePath();
      ctx.fillStyle = a.color;
      ctx.globalAlpha = a.opacity;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = a.opacity * 0.5;
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function loop() {
      tick += 0.012;

      /* Background gradient */
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, "#030d1a");
      bg.addColorStop(0.45, "#061929");
      bg.addColorStop(0.75, "#0a2540");
      bg.addColorStop(1, "#0d3460");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* Stars */
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      });

      /* Asteroids */
      asteroids.forEach((a, idx) => {
        a.trail.push({ x: a.x, y: a.y });
        if (a.trail.length > 22) a.trail.shift();
        a.x += a.vx;
        a.y += a.vy;
        a.rotation += a.rotSpeed;
        drawAsteroid(a);
        if (a.x > canvas.width + 40 || a.y > canvas.height + 40) {
          asteroids[idx] = spawnAsteroid();
        }
      });

      /* Ocean waves */
      const waveBase = canvas.height * 0.82;
      drawWave(waveBase + 30, 18, 0.006, 0.7, "#0e4080", 0.55);
      drawWave(waveBase + 14, 22, 0.0045, 0.55, "#1565c0", 0.45);
      drawWave(waveBase, 28, 0.0035, 0.42, "#1d9bf0", 0.25);
      drawWave(waveBase - 10, 12, 0.008, 0.85, "rgba(29,155,240,0.15)", 0.6);

      animId = requestAnimationFrame(loop);
    }

    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ocean-deep:   #030d1a;
    --ocean-mid:    #061929;
    --ocean-surf:   #0a2540;
    --ocean-light:  #0d3460;
    --blue:         #1d9bf0;
    --blue-bright:  #42b0f5;
    --blue-dim:     rgba(29, 155, 240, 0.14);
    --blue-glow:    rgba(29, 155, 240, 0.35);
    --white:        #ffffff;
    --white-85:     rgba(255,255,255,0.85);
    --white-60:     rgba(255,255,255,0.60);
    --white-30:     rgba(255,255,255,0.30);
    --white-12:     rgba(255,255,255,0.12);
    --white-07:     rgba(255,255,255,0.07);
    --text:         #e8f4fd;
    --text-muted:   rgba(190,220,245,0.75);
    --text-dim:     rgba(130,180,220,0.55);
    --black:        #e8f4fd;
    --muted:        rgba(130,180,220,0.6);
    --surface:      rgba(6,25,41,0.60);
    --border:       rgba(29,155,240,0.18);
    --glass-bg:     rgba(6,25,41,0.55);
    --glass-border: rgba(29,155,240,0.22);
    --radius-xl:    24px;
    --radius-lg:    18px;
    --radius-md:    14px;
    --radius-full:  999px;
    --shadow-sm:    0 2px 14px rgba(0,0,0,0.35);
    --shadow-md:    0 8px 32px rgba(0,0,0,0.45);
    --shadow-lg:    0 20px 60px rgba(0,0,0,0.55);
    --ease:         cubic-bezier(0.22, 1, 0.36, 1);
    --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
    --dur:          0.3s;
  }

  html { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { background: var(--ocean-deep); color: var(--text); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(29,155,240,0.25); border-radius: 99px; }

  /* ── SMOKE BUTTON BASE ──────────────────────────────── */
  .smoke-btn-wrap {
    position: relative;
    display: inline-flex;
  }
  .smoke-canvas {
    position: absolute;
    inset: -25px -34px;
    pointer-events: none;
    z-index: 10;
    border-radius: inherit;
  }

  /* ── Glass utility ─────────────────────────────────── */
  .glass {
    background: rgba(6,25,41,0.55);
    backdrop-filter: blur(17px) saturate(160%);
    -webkit-backdrop-filter: blur(17px) saturate(160%);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* ── Glass button ──────────────────────────────────── */
  .glass-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 17px;
    height: 33px;
    border-radius: var(--radius-full);
    border: 1px solid var(--glass-border);
    background: rgba(6,25,41,0.55);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--blue-bright);
    font-weight: 700;
    font-size: 10.5px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), background var(--dur);
    box-shadow: 0 0 0 0 rgba(29,155,240,0);
  }
  .glass-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(from 0deg at 50% 120%, rgba(29,155,240,0.22) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.35s;
    border-radius: inherit;
  }
  .glass-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(29,155,240,0.3), 0 0 0 1.2px rgba(29,155,240,0.4); background: rgba(29,155,240,0.14); }
  .glass-btn:hover::before { opacity: 1; }
  .glass-btn:active { transform: translateY(0) scale(0.97); }

  /* ── Solid primary button ──────────────────────────── */
  .solid-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 20px;
    height: 36px;
    border-radius: var(--radius-full);
    border: none;
    background: var(--blue);
    color: #fff;
    font-weight: 800;
    font-size: 11px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease);
    box-shadow: 0 5px 20px rgba(29,155,240,0.45);
  }
  .solid-btn::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 26px;
    background: radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, rgba(29,155,240,0.3) 35%, transparent 70%);
    filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s, bottom 0.3s var(--ease);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .solid-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%);
    pointer-events: none;
    border-radius: inherit;
  }
  .solid-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 34px rgba(29,155,240,0.58); background: var(--blue-bright); }
  .solid-btn:hover::before { opacity: 1; bottom: -3px; }
  .solid-btn:active { transform: translateY(0) scale(0.97); }
  .solid-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── Dark button (ocean themed) ────────────────────── */
  .dark-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 20px;
    height: 36px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(29,155,240,0.28);
    background: rgba(4,18,34,0.85);
    color: var(--white-85);
    font-weight: 800;
    font-size: 11px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease), background var(--dur);
    box-shadow: 0 3px 17px rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
  }
  .dark-btn::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 75%;
    height: 23px;
    background: radial-gradient(ellipse, rgba(29,155,240,0.6) 0%, rgba(29,155,240,0.2) 40%, transparent 70%);
    filter: blur(6px);
    opacity: 0;
    transition: opacity 0.3s, bottom 0.3s var(--ease);
    border-radius: 50%;
    pointer-events: none;
  }
  .dark-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(29,155,240,0.12) 0%, transparent 55%);
    pointer-events: none;
    border-radius: inherit;
  }
  .dark-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(29,155,240,0.35); background: rgba(10,37,64,0.9); border-color: rgba(29,155,240,0.55); color: #fff; }
  .dark-btn:hover::before { opacity: 1; bottom: -2px; }
  .dark-btn:active { transform: translateY(0) scale(0.97); }

  /* ── Nav link ──────────────────────────────────────── */
  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: var(--radius-lg);
    color: var(--text-muted);
    font-weight: 600;
    font-size: 11px;
    text-decoration: none;
    transition: background var(--dur) var(--ease), color var(--dur) var(--ease), transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
    position: relative;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  .nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(29,155,240,0.1);
    border-radius: inherit;
    opacity: 0;
    transition: opacity var(--dur) var(--ease);
  }
  .nav-link:hover { transform: translateX(3px); color: var(--blue-bright); }
  .nav-link:hover::before { opacity: 1; }
  .nav-link.active {
    background: var(--blue);
    color: #fff;
    font-weight: 800;
    box-shadow: 0 3px 17px rgba(29,155,240,0.45);
  }
  .nav-link.active::before { display: none; }
  .nav-link.active:hover { transform: translateX(2px); }

  /* ── Card ──────────────────────────────────────────── */
  .card {
    background: rgba(6,25,41,0.72);
    backdrop-filter: blur(17px) saturate(160%);
    -webkit-backdrop-filter: blur(17px) saturate(160%);
    border: 1px solid rgba(29,155,240,0.18);
    border-radius: var(--radius-xl);
    transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  .card:hover { box-shadow: 0 10px 34px rgba(0,0,0,0.5), 0 0 0 1px rgba(29,155,240,0.28); }

  /* ── Section panels in right sidebar ─────────────── */
  .panel-section {
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: rgba(4,18,34,0.72);
    backdrop-filter: blur(17px) saturate(160%);
    -webkit-backdrop-filter: blur(17px) saturate(160%);
    border: 1px solid rgba(29,155,240,0.18);
    box-shadow: 0 2px 17px rgba(0,0,0,0.4);
    transition: box-shadow 0.3s;
  }
  .panel-header {
    width: 100%;
    padding: 12px 14px;
    border: none;
    background: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    font-size: 10px;
    cursor: pointer;
    color: var(--text-muted);
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.01em;
    transition: background 0.2s;
  }
  .panel-header:hover { background: rgba(29,155,240,0.06); }

  /* ── Notification items ────────────────────────────── */
  .notif-item {
    display: flex;
    gap: 8px;
    padding: 8px 9px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .notif-item:hover { transform: translateX(2px); }
  .notif-item.unread {
    background: rgba(29,155,240,0.1);
    border: 1px solid rgba(29,155,240,0.22);
  }
  .notif-item.read {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(29,155,240,0.07);
  }

  /* ── Live card ─────────────────────────────────────── */
  .live-card {
    background: rgba(6,25,41,0.65);
    border: 1px solid rgba(29,155,240,0.18);
    border-radius: var(--radius-lg);
    padding: 8px;
    transition: box-shadow 0.25s, border-color 0.25s;
  }
  .live-card:hover { box-shadow: 0 5px 24px rgba(0,0,0,0.5); border-color: rgba(29,155,240,0.35); }

  /* ── Search bar ────────────────────────────────────── */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 13px;
    border-radius: var(--radius-full);
    background: rgba(6,25,41,0.72);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1.5px solid rgba(29,155,240,0.2);
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  }
  .search-bar.focused {
    border-color: rgba(29,155,240,0.6);
    box-shadow: 0 0 0 2.5px rgba(29,155,240,0.12), 0 3px 17px rgba(0,0,0,0.4);
    background: rgba(10,37,64,0.85);
  }
  .search-bar input {
    flex: 1;
    border: 0;
    outline: none;
    font-size: 10.5px;
    font-weight: 500;
    background: transparent;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    caret-color: var(--blue-bright);
  }
  .search-bar input::placeholder { color: var(--text-dim); }

  /* ── Search dropdown ───────────────────────────────── */
  .search-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0; right: 0;
    z-index: 100;
    overflow: hidden;
    background: rgba(4,18,34,0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(29,155,240,0.22);
    border-radius: var(--radius-xl);
    box-shadow: 0 17px 51px rgba(0,0,0,0.65);
    animation: fadeUp 0.25s var(--ease) both;
  }
  .search-result-item {
    display: flex;
    gap: 8px;
    padding: 8px 13px;
    cursor: pointer;
    align-items: center;
    transition: background 0.2s;
  }
  .search-result-item:hover { background: rgba(29,155,240,0.1); }
  .search-result-item + .search-result-item { border-top: 1px solid rgba(29,155,240,0.08); }

  /* ── Animations ────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.45s var(--ease) both; }

  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-15px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-right { animation: slideRight 0.45s var(--ease) both; }

  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(15px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-left { animation: slideLeft 0.45s var(--ease) both; }

  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(29,155,240,0.55); }
    50%       { box-shadow: 0 0 0 5px transparent; }
  }
  .pulse-glow { animation: pulseGlow 2.2s ease infinite; }

  @keyframes floatA {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-24px) scale(1.04); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(18px) scale(0.96); }
  }
  .orb-a { animation: floatA 9s ease-in-out infinite; }
  .orb-b { animation: floatB 12s ease-in-out infinite; }

  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.10s; }
  .d3 { animation-delay: 0.15s; }
  .d4 { animation-delay: 0.20s; }
  .d5 { animation-delay: 0.25s; }
  .d6 { animation-delay: 0.30s; }

  /* ── Responsive ────────────────────────────────────── */
  @media (max-width: 1100px) {
    .cx-layout { grid-template-columns: 188px minmax(0,1fr) 200px !important; }
  }
  @media (max-width: 900px) {
    .cx-layout { grid-template-columns: 52px minmax(0,1fr) !important; }
    .cx-right-sidebar { display: none !important; }
    .sidebar-label { display: none !important; }
    .sidebar-logo-full { display: none !important; }
    .nav-link { padding: 10px !important; justify-content: center; gap: 0 !important; }
    .sidebar-create-btn span { display: none !important; }
    .sidebar-create-btn { width: 31px !important; padding: 0 !important; justify-content: center; }
    .sidebar-user-info { display: none !important; }
    .sidebar-user-wrap { justify-content: center !important; }
  }
  @media (max-width: 600px) {
    .cx-layout { grid-template-columns: minmax(0,1fr) !important; }
    .cx-left-sidebar { display: none !important; }
    .topbar-create-btn span { display: none !important; }
    .topbar-create-btn { padding: 0 12px !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

export default function AppLayout({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Animated ocean + asteroid canvas */}
      <OceanAsteroidCanvas />

      <div
        className="cx-layout"
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "216px minmax(0,1fr) 240px",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT SIDEBAR */}
        <aside
          className="slide-right cx-left-sidebar"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",

            /* REMOVE WHITE LOOK */
            background:
              "linear-gradient(180deg, rgba(2,8,18,0.96) 0%, rgba(3,13,26,0.92) 55%, rgba(5,18,34,0.95) 100%)",

            backdropFilter: "blur(36px) saturate(180%)",
            WebkitBackdropFilter: "blur(36px) saturate(180%)",

            borderRight: "1px solid rgba(29,155,240,0.12)",

            boxShadow:
              "20px 0 80px rgba(0,0,0,0.65), inset -1px 0 rgba(255,255,255,0.02)",

            overflowY: "auto",
            zIndex: 10,

            /* IMPORTANT */
            overflowX: "hidden",
          }}
        >
          <LeftSidebar />
        </aside>

        {/* CENTER */}
        <main style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              padding: "10px 14px 8px",
              background: "rgba(3,13,26,0.7)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              borderBottom: "1px solid rgba(29,155,240,0.12)",
            }}
          >
            <TopBar />
          </div>

          <div
            className="fade-up"
            style={{ width: "100%", padding: "0 0 43px" }}
          >
            {children}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside
          className="slide-left cx-right-sidebar"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            background: "rgba(3,13,26,0.72)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            borderLeft: "1px solid rgba(29,155,240,0.15)",
            boxShadow: "-2px 0 32px rgba(0,0,0,0.4)",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <RightSidebar />
        </aside>
      </div>
    </>
  );
}

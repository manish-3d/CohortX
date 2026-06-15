import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:       #1d9bf0;
    --blue-dim:   rgba(29, 155, 240, 0.12);
    --blue-glow:  rgba(29, 155, 240, 0.35);
    --black:      #0f1419;
    --white:      #ffffff;
    --surface:    rgba(255, 255, 255, 0.72);
    --border:     rgba(29, 155, 240, 0.14);
    --muted:      #536471;
    --radius-xl:  28px;
    --radius-lg:  22px;
    --radius-md:  16px;
    --radius-full: 999px;
    --shadow-sm:  0 2px 12px rgba(29,155,240,0.08);
    --shadow-md:  0 8px 32px rgba(29,155,240,0.14);
    --shadow-lg:  0 20px 60px rgba(29,155,240,0.20);
    --ease:       cubic-bezier(0.22, 1, 0.36, 1);
    --dur:        0.3s;
  }

  html { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  body { background: #e8f4fd; }

  /* ── Scrollbar ─────────────────────────────────────── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--blue-dim); border-radius: 99px; }

  /* ── Glass utility ─────────────────────────────────── */
  .glass {
    background: var(--surface);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  /* ── Glass button ──────────────────────────────────── */
  .glass-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 24px;
    height: 46px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    background: var(--surface);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    color: var(--blue);
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: transform var(--dur) var(--ease),
                box-shadow var(--dur) var(--ease),
                background var(--dur) var(--ease);
  }
  .glass-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md), 0 0 0 2px var(--blue-dim);
    background: rgba(29,155,240,0.08);
  }
  .glass-btn:active { transform: translateY(0); }

  /* ── Solid primary button ──────────────────────────── */
  .solid-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 28px;
    height: 50px;
    border-radius: var(--radius-full);
    border: none;
    background: var(--blue);
    color: #fff;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease),
                box-shadow var(--dur) var(--ease);
    box-shadow: 0 4px 18px var(--blue-glow);
  }
  .solid-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
    pointer-events: none;
  }
  .solid-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px var(--blue-glow);
  }
  .solid-btn:active { transform: translateY(0); }
  .solid-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* ── Dark button ───────────────────────────────────── */
  .dark-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 28px;
    height: 50px;
    border-radius: var(--radius-full);
    border: none;
    background: var(--black);
    color: #fff;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease),
                box-shadow var(--dur) var(--ease);
    box-shadow: 0 4px 20px rgba(15,20,25,0.25);
  }
  .dark-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
  .dark-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(15,20,25,0.35);
  }
  .dark-btn:active { transform: translateY(0); }

  /* ── Nav link ──────────────────────────────────────── */
  .nav-link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 15px 20px;
    border-radius: var(--radius-lg);
    color: var(--black);
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    transition: background var(--dur) var(--ease),
                color var(--dur) var(--ease),
                transform var(--dur) var(--ease),
                box-shadow var(--dur) var(--ease);
    position: relative;
    overflow: hidden;
  }
  .nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--blue-dim);
    border-radius: inherit;
    opacity: 0;
    transition: opacity var(--dur) var(--ease);
  }
  .nav-link:hover { transform: translateX(4px); color: var(--blue); }
  .nav-link:hover::before { opacity: 1; }
  .nav-link.active {
    background: var(--blue);
    color: #fff;
    font-weight: 800;
    box-shadow: 0 4px 18px var(--blue-glow);
  }
  .nav-link.active::before { display: none; }
  .nav-link.active:hover { transform: translateX(2px); }

  /* ── Card ──────────────────────────────────────────── */
  .card {
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  .card:hover { box-shadow: var(--shadow-md); }

  /* ── Ripple on click ───────────────────────────────── */
  @keyframes ripple {
    to { transform: scale(4); opacity: 0; }
  }

  /* ── Fade-in-up ────────────────────────────────────── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  .fade-up { animation: fadeUp 0.45s var(--ease) both; }

  /* ── Slide-in from left ────────────────────────────── */
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-right { animation: slideRight 0.45s var(--ease) both; }

  /* ── Slide-in from right ───────────────────────────── */
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .slide-left { animation: slideLeft 0.45s var(--ease) both; }

  /* ── Pulse glow on badge ───────────────────────────── */
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 0 0 var(--blue-glow); }
    50%       { box-shadow: 0 0 0 6px transparent; }
  }
  .pulse-glow { animation: pulseGlow 2.2s ease infinite; }

  /* ── Shimmer on active nav ─────────────────────────── */
  @keyframes shimmer {
    from { background-position: -200% center; }
    to   { background-position:  200% center; }
  }

  /* ── Floating ambient orbs (layout BG) ────────────── */
  @keyframes floatA {
    0%, 100% { transform: translateY(0)   scale(1);    }
    50%       { transform: translateY(-28px) scale(1.04); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0)   scale(1);    }
    50%       { transform: translateY(22px)  scale(0.96); }
  }
  .orb-a { animation: floatA 9s ease-in-out infinite; }
  .orb-b { animation: floatB 12s ease-in-out infinite; }

  /* ── Stagger delays ────────────────────────────────── */
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.10s; }
  .d3 { animation-delay: 0.15s; }
  .d4 { animation-delay: 0.20s; }
  .d5 { animation-delay: 0.25s; }
  .d6 { animation-delay: 0.30s; }

  /* ── Reduced motion ────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

export default function AppLayout({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #dceffe 0%, #f0f8ff 40%, #e4f4fd 70%, #d6ecfb 100%)",
          display: "grid",
          gridTemplateColumns: "320px minmax(0,1fr) 420px",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Ambient background orbs */}
        <div
          className="orb-a"
          style={{
            position: "fixed",
            top: "8%",
            left: "18%",
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,155,240,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="orb-b"
          style={{
            position: "fixed",
            bottom: "12%",
            right: "22%",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,155,240,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* LEFT SIDEBAR */}
        <aside
          className="slide-right"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRight: "1px solid rgba(29,155,240,0.12)",
            boxShadow: "2px 0 24px rgba(29,155,240,0.07)",
            overflowY: "auto",
            zIndex: 10,
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
              padding: "16px 20px 12px",
              background: "rgba(232,244,253,0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(29,155,240,0.10)",
            }}
          >
            <TopBar />
          </div>

          <div
            className="fade-up"
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              padding: "0 0 48px",
            }}
          >
            {children}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside
          className="slide-left"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderLeft: "1px solid rgba(29,155,240,0.12)",
            boxShadow: "-2px 0 24px rgba(29,155,240,0.07)",
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

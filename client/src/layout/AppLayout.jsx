import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";

function AppBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "var(--app-bg)",
      }}
    />
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ocean-deep:   #0a0a0a;
    --ocean-mid:    #111111;
    --ocean-surf:   #181818;
    --ocean-light:  #222222;
    --blue:         #ffffff;
    --blue-bright:  #cccccc;
    --blue-dim:     rgba(255, 255, 255, 0.08);
    --blue-glow:    rgba(255, 255, 255, 0.15);
    --white:        #ffffff;
    --white-85:     rgba(255,255,255,0.85);
    --white-60:     rgba(255,255,255,0.60);
    --white-30:     rgba(255,255,255,0.30);
    --white-12:     rgba(255,255,255,0.12);
    --white-07:     rgba(255,255,255,0.07);
    --text:         #f0f0f0;
    --text-muted:   rgba(255,255,255,0.6);
    --text-dim:     rgba(255,255,255,0.4);
    --black:        #000000;
    --muted:        rgba(255,255,255,0.45);
    --surface:      rgba(20,20,20,0.72);
    --border:       rgba(255,255,255,0.12);
    --glass-bg:     rgba(20,20,20,0.55);
    --glass-border: rgba(255,255,255,0.15);
    --radius-xl:    24px;
    --radius-lg:    18px;
    --radius-md:    14px;
    --radius-full:  999px;
    --shadow-sm:    0 2px 14px rgba(0,0,0,0.5);
    --shadow-md:    0 8px 32px rgba(0,0,0,0.6);
    --shadow-lg:    0 20px 60px rgba(0,0,0,0.7);
    --ease:         cubic-bezier(0.22, 1, 0.36, 1);
    --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
    --dur:          0.3s;
    --app-bg:       linear-gradient(180deg, #0a0a0a 0%, #111111 38%, #181818 72%, #1e1e1e 100%);
  }

  [data-theme="light"] {
    --ocean-deep:   #f5f5f5;
    --ocean-mid:    #eeeeee;
    --ocean-surf:   #e8e8e8;
    --ocean-light:  #e0e0e0;
    --blue:         #111111;
    --blue-bright:  #333333;
    --blue-dim:     rgba(0, 0, 0, 0.05);
    --blue-glow:    rgba(0, 0, 0, 0.08);
    --white:        #111111;
    --white-85:     rgba(0,0,0,0.85);
    --white-60:     rgba(0,0,0,0.60);
    --white-30:     rgba(0,0,0,0.18);
    --white-12:     rgba(0,0,0,0.08);
    --white-07:     rgba(0,0,0,0.04);
    --text:         #111111;
    --text-muted:   rgba(0,0,0,0.6);
    --text-dim:     rgba(0,0,0,0.4);
    --black:        #ffffff;
    --muted:        rgba(0,0,0,0.45);
    --surface:      rgba(255,255,255,0.85);
    --border:       rgba(0,0,0,0.12);
    --glass-bg:     rgba(255,255,255,0.65);
    --glass-border: rgba(0,0,0,0.1);
    --shadow-sm:    0 2px 14px rgba(0,0,0,0.05);
    --shadow-md:    0 8px 32px rgba(0,0,0,0.08);
    --shadow-lg:    0 20px 60px rgba(0,0,0,0.1);
    --app-bg:       linear-gradient(180deg, #f5f5f5 0%, #eeeeee 38%, #e8e8e8 72%, #e0e0e0 100%);
  }

  html { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; scroll-behavior: smooth; }
  body { background: var(--ocean-deep); color: var(--text); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }
  [data-theme="light"] ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); }

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
    background: var(--glass-bg);
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
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: var(--text);
    font-weight: 700;
    font-size: 10.5px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease), background var(--dur);
    box-shadow: 0 0 0 0 rgba(255,255,255,0);
  }
  .glass-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(from 0deg at 50% 120%, rgba(255,255,255,0.08) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.35s;
    border-radius: inherit;
  }
  .glass-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255,255,255,0.1), 0 0 0 1.2px var(--glass-border); background: var(--blue-dim); }
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
    color: var(--black);
    font-weight: 800;
    font-size: 11px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease);
    box-shadow: 0 5px 20px var(--blue-glow);
  }
  .solid-btn::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 26px;
    background: radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 35%, transparent 70%);
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
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
    pointer-events: none;
    border-radius: inherit;
  }
  .solid-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 34px rgba(255,255,255,0.2); background: var(--blue-bright); }
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
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--white-85);
    font-weight: 800;
    font-size: 11px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease), background var(--dur);
    box-shadow: 0 3px 17px rgba(0,0,0,0.3);
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
    background: radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%);
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
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 55%);
    pointer-events: none;
    border-radius: inherit;
  }
  .dark-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); background: rgba(30,30,30,0.9); border-color: var(--blue-bright); color: #fff; }
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
    background: rgba(255, 255, 255, 0.05);
    border-radius: inherit;
    opacity: 0;
    transition: opacity var(--dur) var(--ease);
  }
  .nav-link:hover { transform: translateX(3px); color: var(--blue-bright); }
  .nav-link:hover::before { opacity: 1; }
  .nav-link.active {
    background: var(--blue);
    color: var(--black);
    font-weight: 800;
    box-shadow: 0 3px 17px var(--blue-glow);
  }
  .nav-link.active::before { display: none; }
  .nav-link.active:hover { transform: translateX(2px); }

  /* ── Card ──────────────────────────────────────────── */
  .card {
    background: var(--surface);
    backdrop-filter: blur(17px) saturate(160%);
    -webkit-backdrop-filter: blur(17px) saturate(160%);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
  }
  .card:hover { box-shadow: 0 10px 34px rgba(0,0,0,0.4), 0 0 0 1px rgba(255, 255, 255, 0.15); }

  /* ── Section panels in right sidebar ─────────────── */
  .panel-section {
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: var(--surface);
    backdrop-filter: blur(17px) saturate(160%);
    -webkit-backdrop-filter: blur(17px) saturate(160%);
    border: 1px solid var(--border);
    box-shadow: 0 2px 17px rgba(0,0,0,0.3);
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
  .panel-header:hover { background: rgba(255, 255, 255, 0.04); }

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
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  .notif-item.read {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
  }

  /* ── Live card ─────────────────────────────────────── */
  .live-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 8px;
    transition: box-shadow 0.25s, border-color 0.25s;
  }
  .live-card:hover { box-shadow: 0 5px 24px rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2); }

  /* ── Search bar ────────────────────────────────────── */
  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 13px;
    border-radius: var(--radius-full);
    background: var(--surface);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1.5px solid var(--border);
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  }
  .search-bar.focused {
    border-color: rgba(255, 255, 255, 0.35);
    box-shadow: 0 0 0 2.5px rgba(255, 255, 255, 0.06), 0 3px 17px rgba(0,0,0,0.25);
    background: var(--surface);
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
    caret-color: var(--text);
  }
  .search-bar input::placeholder { color: var(--text-dim); }

  /* ── Search dropdown ───────────────────────────────── */
  .search-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0; right: 0;
    z-index: 100;
    overflow: hidden;
    background: var(--surface);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: 0 17px 51px rgba(0,0,0,0.45);
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
  .search-result-item:hover { background: rgba(255, 255, 255, 0.05); }
  .search-result-item + .search-result-item { border-top: 1px solid var(--border); }

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
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
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

      <AppBackground />

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
            background: "var(--surface)",
            backdropFilter: "blur(36px) saturate(180%)",
            WebkitBackdropFilter: "blur(36px) saturate(180%)",
            borderRight: "1px solid var(--border)",
            boxShadow: "20px 0 80px rgba(0,0,0,0.3), inset -1px 0 rgba(255,255,255,0.02)",
            overflowY: "auto",
            zIndex: 10,
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
              background: "var(--surface)",
              backdropFilter: "blur(24px) saturate(160%)",
              WebkitBackdropFilter: "blur(24px) saturate(160%)",
              borderBottom: "1px solid var(--border)",
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
            background: "var(--surface)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            borderLeft: "1px solid var(--border)",
            boxShadow: "-2px 0 32px rgba(0,0,0,0.2)",
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

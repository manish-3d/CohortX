import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import TopBar from "./components/TopBar";

export default function AppLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",

        background: "#f7f9fa",

        display: "grid",

        gridTemplateColumns: "340px minmax(0,1fr) 420px",

        width: "100%",
      }}
    >
      {/* LEFT SIDEBAR */}

      <aside
        style={{
          position: "sticky",

          top: 0,

          height: "100vh",

          background: "#ffffff",

          borderRight: "1px solid #eff3f4",

          overflow: "hidden",
        }}
      >
        <LeftSidebar />
      </aside>

      {/* CENTER */}

      <main
        style={{
          minHeight: "100vh",

          background: `
      radial-gradient(
        circle at top,
        rgba(27, 161, 244, 0.16),
        transparent 65%
      ),

      linear-gradient(
        180deg,
        #ffffff 0%,
        #f5fbff 30%,
        #edf8ff 70%,
        #ffffff 100%
      )
    `,

          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "sticky",

            top: 0,
            borderRadius: 22,
            zIndex: 50,

            paddingTop: 20,

            paddingBottom: 20,
          }}
        >
          <TopBar />
        </div>

        <div
          style={{
            width: "100%",

            maxWidth: "780px",

            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}

      <aside
        style={{
          position: "sticky",

          top: 0,

          height: "100vh",

          background: "#f7f9fa",

          borderLeft: "1px solid #eff3f4",

          overflow: "hidden",
        }}
      >
        <RightSidebar />
      </aside>
    </div>
  );
}

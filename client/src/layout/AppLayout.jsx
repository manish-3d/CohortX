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
          minWidth: 0,

          display: "flex",

          flexDirection: "column",

          padding: "0 28px 40px",

          overflowX: "hidden",
        }}
      >
        <div
          style={{
            position: "sticky",

            top: 0,

            zIndex: 50,

            background: "#f7f9fa",

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

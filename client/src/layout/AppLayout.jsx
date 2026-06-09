import LeftSidebar from "./LeftSidebar";

import RightSidebar from "./RightSidebar";

export default function AppLayout({ children }) {
  return (
    <div
      style={{
        display: "grid",

        gridTemplateColumns: "260px 1fr 360px",

        minHeight: "100vh",
      }}
    >
      <LeftSidebar />

      <main>{children}</main>

      <RightSidebar />
    </div>
  );
}

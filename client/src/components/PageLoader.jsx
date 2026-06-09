export default function PageLoader({
  text = "Loading...",
  minHeight = "60vh",
}) {
  return (
    <div
      className="page-loader"
      style={{
        minHeight,
      }}
      role="status"
      aria-live="polite"
    >
      <span className="loader-spinner" />

      <p>{text}</p>
    </div>
  );
}

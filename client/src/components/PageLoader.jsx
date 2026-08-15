export default function PageLoader({
  text = "Loading...",
  minHeight = "60vh",
}) {
  return (
    <>
      <style>{`
        .simple-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
        }

        .simple-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid rgba(255, 255, 255, 0.12);
          border-top-color: var(--text, #ffffff);
          border-radius: 50%;
          animation: simple-spin 0.8s linear infinite;
        }

        [data-theme="light"] .simple-spinner {
          border-color: rgba(0, 0, 0, 0.08);
          border-top-color: var(--text, #111111);
        }

        .simple-loader-text {
          font-family: inherit;
          font-size: 14px;
          color: var(--muted, rgba(255, 255, 255, 0.6));
          margin: 0;
          text-align: center;
        }

        [data-theme="light"] .simple-loader-text {
          color: var(--muted, #666666);
        }

        @keyframes simple-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div
        className="simple-loader-container"
        style={{ minHeight }}
        role="status"
        aria-live="polite"
      >
        <div className="simple-spinner" />
        {text && <p className="simple-loader-text">{text}</p>}
      </div>
    </>
  );
}

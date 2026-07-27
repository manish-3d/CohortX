import { useEffect, useState } from "react";

export default function PageLoader({ loading = true }) {
  const [show, setShow] = useState(loading);

  useEffect(() => {
    setShow(loading);
  }, [loading]);

  if (!show) return null;

  return (
    <>
      <style>{`
        .page-loader {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(12px);
          z-index: 99999;
          animation: fadeIn 0.25s ease;
        }

        .loader-card {
          background: #ffffff;
          padding: 32px;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .loader-spinner {
          width: 44px;
          height: 44px;
          border: 3.5px solid rgba(0, 0, 0, 0.1);
          border-top: 3.5px solid #000000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="page-loader">
        <div className="loader-card">
          <div className="loader-spinner" />
        </div>
      </div>
    </>
  );
}

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
        .page-loader{
          position:fixed;
          inset:0;

          display:flex;
          align-items:center;
          justify-content:center;

          background:rgba(0,0,0,.08);

          backdrop-filter:blur(10px);

          z-index:99999;

          animation:fadeIn .25s ease;
        }

        .loader-wrap{
          position:relative;

          width:120px;
          height:120px;

          display:flex;
          align-items:center;
          justify-content:center;
        }

        .loader-ring{
          position:absolute;

          width:100px;
          height:100px;

          border-radius:50%;

          border:
            2px solid
            rgba(255,255,255,.08);

          border-top:
            2px solid
            #1d9bf0;

          animation:
            spin 1s linear infinite;
        }

        .loader-ring::before{
          content:"";

          position:absolute;

          inset:-14px;

          border-radius:50%;

          border:
            2px solid
            transparent;

          border-top:
            2px solid
            rgba(66,176,245,.6);

          animation:
            spinReverse 1.5s linear infinite;
        }

        .loader-core{
          width:12px;
          height:12px;

          border-radius:50%;

          background:#42b0f5;

          box-shadow:
            0 0 25px #42b0f5,
            0 0 80px #1d9bf0;

          animation:
            pulse 1.4s ease infinite;
        }

        @keyframes spin{
          from{
            transform:rotate(0);
          }

          to{
            transform:rotate(360deg);
          }
        }

        @keyframes spinReverse{
          from{
            transform:rotate(360deg);
          }

          to{
            transform:rotate(0);
          }
        }

        @keyframes pulse{
          0%{
            transform:scale(.9);
            opacity:.6;
          }

          50%{
            transform:scale(1.4);
            opacity:1;
          }

          100%{
            transform:scale(.9);
            opacity:.6;
          }
        }

        @keyframes fadeIn{
          from{
            opacity:0;
          }

          to{
            opacity:1;
          }
        }
      `}</style>

      <div className="page-loader">
        <div className="loader-wrap">
          <div className="loader-ring" />

          <div className="loader-core" />
        </div>
      </div>
    </>
  );
}

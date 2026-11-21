import { useState } from "react";
import { ChevronRight, Zap, Image, QrCode, Smartphone } from "lucide-react";
import "./ScanQR.css";

const CLASSROOM_IMG =
  "https://images.unsplash.com/photo-1736066330610-c102cab4e942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWN0dXJlJTIwaGFsbCUyMGNsYXNzcm9vbSUyMHVuaXZlcnNpdHklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzkwNDA4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080";

function QrSvg({ size = 100 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <rect x="0" y="0" width="100" height="100" fill="white" />
      {/* Top-left finder */}
      <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="#1C1C1E" strokeWidth="5" />
      <rect x="13" y="13" width="12" height="12" rx="1" fill="#1C1C1E" />
      {/* Top-right finder */}
      <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="#1C1C1E" strokeWidth="5" />
      <rect x="75" y="13" width="12" height="12" rx="1" fill="#1C1C1E" />
      {/* Bottom-left finder */}
      <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="#1C1C1E" strokeWidth="5" />
      <rect x="13" y="75" width="12" height="12" rx="1" fill="#1C1C1E" />
      {/* Data modules */}
      {[
        [40,5],[46,5],[52,5],[58,5],
        [40,11],[52,11],[58,11],
        [40,17],[46,17],[58,17],
        [40,23],[52,23],[58,23],
        [40,29],[46,29],[52,29],
        [5,40],[11,40],[17,40],[23,40],[29,40],
        [5,46],[17,46],[23,46],[29,46],
        [5,52],[11,52],[23,52],
        [5,58],[11,58],[17,58],[23,58],[29,58],
        [5,64],[17,64],[23,64],[29,64],
        [40,40],[46,40],[52,40],[58,40],[64,40],[70,40],[76,40],[82,40],[88,40],[94,40],
        [40,46],[52,46],[58,46],[70,46],[76,46],[88,46],
        [40,52],[46,52],[64,52],[70,52],[76,52],[82,52],
        [40,58],[46,58],[52,58],[58,58],[64,58],[82,58],[88,58],[94,58],
        [40,64],[52,64],[58,64],[64,64],[70,64],[76,64],
        [40,70],[46,70],[52,70],[64,70],[82,70],[88,70],[94,70],
        [40,76],[52,76],[58,76],[64,76],[70,76],[76,76],[82,76],
        [40,82],[46,82],[64,82],[70,82],[88,82],[94,82],
        [40,88],[46,88],[52,88],[58,88],[64,88],[82,88],
        [40,94],[52,94],[64,94],[70,94],[76,94],[88,94],[94,94],
        [67,67],[73,67],[79,67],[85,67],[91,67],
        [67,73],[79,73],[85,73],[91,73],
        [67,79],[73,79],[85,79],
        [67,85],[73,85],[79,85],[85,85],[91,85],
        [67,91],[73,91],[79,91],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="#1C1C1E" />
      ))}
    </svg>
  );
}

function CameraQrSvg() {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="scan-qr-svg"
    >
      {/* Top-left finder */}
      <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="white" strokeWidth="5" />
      <rect x="13" y="13" width="12" height="12" rx="1" fill="white" />
      {/* Top-right finder */}
      <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="white" strokeWidth="5" />
      <rect x="75" y="13" width="12" height="12" rx="1" fill="white" />
      {/* Bottom-left finder */}
      <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="white" strokeWidth="5" />
      <rect x="13" y="75" width="12" height="12" rx="1" fill="white" />
      {[
        [40,5],[46,5],[52,5],[58,5],[40,11],[52,11],[58,11],[40,17],[46,17],[58,17],
        [40,23],[52,23],[58,23],[40,29],[46,29],[52,29],
        [5,40],[11,40],[17,40],[23,40],[29,40],[5,46],[17,46],[23,46],[29,46],
        [5,52],[11,52],[23,52],[5,58],[11,58],[17,58],[23,58],[29,58],[5,64],[17,64],[23,64],[29,64],
        [40,40],[46,40],[52,40],[58,40],[64,40],[70,40],[76,40],[82,40],[88,40],[94,40],
        [40,46],[52,46],[58,46],[70,46],[76,46],[88,46],
        [40,52],[46,52],[64,52],[70,52],[76,52],[82,52],
        [40,58],[46,58],[52,58],[58,58],[64,58],[82,58],[88,58],[94,58],
        [40,64],[52,64],[58,64],[64,64],[70,64],[76,64],
        [40,70],[46,70],[52,70],[64,70],[82,70],[88,70],[94,70],
        [40,76],[52,76],[58,76],[64,76],[70,76],[76,76],[82,76],
        [40,82],[46,82],[64,82],[70,82],[88,82],[94,82],[40,88],[46,88],[52,88],[58,88],[64,88],[82,88],
        [40,94],[52,94],[64,94],[70,94],[76,94],[88,94],[94,94],
        [67,67],[73,67],[79,67],[85,67],[91,67],[67,73],[79,73],[85,73],[91,73],
        [67,79],[73,79],[85,79],[67,85],[73,85],[79,85],[85,85],[91,85],[67,91],[73,91],[79,91],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill="white" />
      ))}
    </svg>
  );
}

export function ScanQR() {
  const [flashOn, setFlashOn] = useState(false);

  return (
    <div className="scan-qr-stack">
      {/* Header */}
      <div className="scan-qr-box">
        <div className="scan-qr-row">
          <span className="scan-qr-text">Vijueshmëria</span>
          <ChevronRight size={12} />
          <span className="scan-qr-text-2">Scan QR Code</span>
        </div>
        <h1 className="scan-qr-title">
          Scan QR Code
        </h1>
        <p className="scan-qr-text-3">
          Drejtojeni kamerën drejt kodit QR të profesorit
        </p>
      </div>

      <div className="scan-qr-box-2">

        {/* Desktop info screen */}
        <div className="scan-qr-box-3">
          <div className="scan-qr-icon-box">
            <Smartphone size={48} className="scan-qr-icon" />
          </div>
          <h2 className="scan-qr-title-2">
            Skanimi i QR Code-it është i disponueshëm vetëm në mobile
          </h2>
          <p className="scan-qr-text-4">
            Hapni SEMS 2.0 në telefonin tuaj për të skanuar kodin QR të profesorit dhe regjistruar prezencën.
          </p>

          {/* Static QR to open SEMS on mobile */}
          <div className="scan-qr-card">
            <div className="scan-qr-box-4">
              <QrSvg size={160} />
            </div>
            <p className="scan-qr-text-5">
              Skano këtë kod për të hapur SEMS në telefon
            </p>
          </div>

          <div className="scan-qr-card-2">
            <div className="scan-qr-icon-box-2">
              <QrCode size={14} className="scan-qr-icon" />
            </div>
            <div className="scan-qr-text-6">
              <p className="scan-qr-text-7">
                Si funksionon?
              </p>
              <p className="scan-qr-text-8">
                Profesori e shfaq kodin QR në fillim dhe në fund të ligjëratës. Skanojeni me SEMS Mobile për të regjistruar prezencën automatikisht.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile camera viewfinder — only on mobile */}
        <div className="scan-qr-stack-2">
          <div className="scan-qr-box-5">
            {/* Viewfinder container */}
            <div className="scan-qr-box-6">
              {/* Classroom background */}
              <img
                src={CLASSROOM_IMG}
                alt="Salla e ligjëratave"
                className="scan-qr-img"
                style={{ filter: "blur(3px) brightness(0.55)" }}
              />
              {/* Dark overlay gradient */}
              <div className="scan-qr-layer" />
              {/* Flash overlay */}
              {flashOn && (
                <div className="scan-qr-layer-2" />
              )}
              {/* Viewfinder square */}
              <div className="scan-qr-row-2">
                <div className="scan-qr-box-7">
                  <div className="scan-qr-layer-3" style={{ inset: "-9999px", boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }} />
                  <div className="scan-qr-layer-4" style={{ boxShadow: "0 0 0 2px rgba(0,122,255,0.5), 0 0 20px rgba(0,122,255,0.25)", border: "1.5px solid rgba(0,122,255,0.7)" }} />
                  {["scan-qr-scan-qr","scan-qr-scan-qr-2","scan-qr-scan-qr-3","scan-qr-scan-qr-4"].map((cls, i) => (
                    <div key={i} className={`scan-qr-layer-5 ${cls}`} style={{ filter: "drop-shadow(0 0 4px #007AFF)" }} />
                  ))}
                  <div className="scan-qr-layer-6" style={{ background: "linear-gradient(90deg, transparent, #0A84FF, #38BDF8, #0A84FF, transparent)", boxShadow: "0 0 8px 2px rgba(10,132,255,0.6)", animation: "scanLine 2s ease-in-out infinite" }} />
                  <div className="scan-qr-row-2" style={{ padding: "18%" }}>
                    <div className="scan-qr-box-8" style={{ background: "rgba(0,0,0,0.75)", padding: "8%", backdropFilter: "blur(1px)" }}>
                      <CameraQrSvg />
                    </div>
                  </div>
                </div>
              </div>
              <div className="scan-qr-row-3">
                <span className="scan-qr-text-9">
                  Përputheni kodin QR me kornizën
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="scan-qr-row-4">
              <div className="scan-qr-stack-3">
                <button
                  onClick={() => setFlashOn((v) => !v)}
                  className={`scan-qr-btn ${flashOn ? "scan-qr-btn-2" : "scan-qr-btn-3"}`}
                  style={flashOn ? { boxShadow: "0 0 16px rgba(255,214,10,0.5)" } : undefined}
                >
                  <Zap size={22} fill={flashOn ? "currentColor" : "none"} />
                </button>
                <span className="scan-qr-text-10">Drita</span>
              </div>
              <div className="scan-qr-stack-3">
                <button className="scan-qr-btn-4">
                  <Image size={22} />
                </button>
                <span className="scan-qr-text-10">Nga Galeria</span>
              </div>
            </div>

            <div className="scan-qr-card-3">
              <div className="scan-qr-icon-box-2">
                <Zap size={14} className="scan-qr-icon" />
              </div>
              <div>
                <p className="scan-qr-text-7">
                  Ku ta gjeni QR Code-in?
                </p>
                <p className="scan-qr-text-8">
                  Profesori e shfaq kodin QR në fillim dhe në fund të ligjëratës. Sigurohuni që jeni fizikisht brenda sallës.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

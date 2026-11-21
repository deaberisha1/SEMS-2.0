import { useState } from "react";
import { X, Info } from "lucide-react";
import "./QeqLendet.css";

export function QeqLendet() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="qeq-lendet-box">
      <div className="qeq-lendet-stack">
        <h1 className="qeq-lendet-title">
          QEQ Lëndët
        </h1>
      </div>

      <div className="qeq-lendet-box-2">
        {/* Toolbar */}
        <div className="qeq-lendet-row">
          <div className="qeq-lendet-text">
            <svg className="qeq-lendet-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="qeq-lendet-row-2">
            <button className="qeq-lendet-btn">
              <svg className="qeq-lendet-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="qeq-lendet-btn">
              <svg className="qeq-lendet-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button className="qeq-lendet-btn">
              <svg className="qeq-lendet-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="qeq-lendet-box-3">
          {!dismissed && (
            <div className="qeq-lendet-card">
              <div className="qeq-lendet-row-3">
                <Info size={16} className="qeq-lendet-icon" />
                <p className="qeq-lendet-text-2">
                  Ju nuk jeni i regjistruar për ndonjë program në QEQ!
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="qeq-lendet-btn-2"
                aria-label="Mbyll"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

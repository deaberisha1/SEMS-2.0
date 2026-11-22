import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./TjeraDiploma.css";

const vitiAkademikOptions = [
  "2023/2024",
  "2024/2025",
  "2025/2026",
];

const niveliOptions = [
  "Bachelor",
  "Master",
  "Doktoratë",
];

const fakultetiOptions = [
  "Fakulteti i Shkencave Kompjuterike",
  "Fakulteti i Biznesit",
  "Fakulteti i Drejtësisë",
  "Fakulteti i Inxhinierisë",
];

function Select({
  id,
  label,
  options,
  value,
  onChange,
}) {
  return (
    <div className="tjera-diploma-stack">
      <label htmlFor={id} className="tjera-diploma-label">{label}</label>
      <div className="tjera-diploma-box">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="tjera-diploma-select"
        >
          <option value="">Zgjedh</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="tjera-diploma-icon"
        />
      </div>
    </div>
  );
}

export function TjeraDiploma() {
  const [viti, setViti] = useState("");
  const [niveli, setNiveli] = useState("");
  const [fakulteti, setFakulteti] = useState("");

  function handleKerko() {
    // search handler — no results state needed per requirements
  }

  return (
    <div className="tjera-diploma-box-2">
      <div className="tjera-diploma-stack-2">
        <h1 className="tjera-diploma-title">
          Kërkesë për titull të diplomës
        </h1>
      </div>

      <div className="tjera-diploma-box-3">
        {/* Toolbar */}
        <div className="tjera-diploma-row">
          <div className="tjera-diploma-text">
            <svg className="tjera-diploma-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="tjera-diploma-row-2">
            <button className="tjera-diploma-btn">
              <svg className="tjera-diploma-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="tjera-diploma-btn">
              <svg className="tjera-diploma-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button className="tjera-diploma-btn">
              <svg className="tjera-diploma-svg-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter form */}
        <div className="tjera-diploma-box-4">
          <div className="tjera-diploma-row-3">
            <div className="tjera-diploma-box-5">
              <Select id="tjera-diploma-viti" label="Viti akademik" options={vitiAkademikOptions} value={viti} onChange={setViti} />
            </div>
            <div className="tjera-diploma-box-6">
              <Select id="tjera-diploma-niveli" label="Niveli" options={niveliOptions} value={niveli} onChange={setNiveli} />
            </div>
            <div className="tjera-diploma-box-7">
              <Select id="tjera-diploma-fakulteti" label="Fakulteti" options={fakultetiOptions} value={fakulteti} onChange={setFakulteti} />
            </div>
            <button
              onClick={handleKerko}
              className="tjera-diploma-btn-2"
            >
              Kërko
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

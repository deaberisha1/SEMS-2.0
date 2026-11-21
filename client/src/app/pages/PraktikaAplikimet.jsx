import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import "./PraktikaAplikimet.css";

const columns = [
  { key: "kompania", label: "Kompania/Institucioni" },
  { key: "pozita", label: "Pozita" },
  { key: "dataAplikimit", label: "Data e aplikimit" },
  { key: "statusi", label: "Statusi" },
  { key: "dataShqyrtimit", label: "Data shqyrtimit" },
  { key: "verejtje", label: "Vërejtje" },
  { key: "cv", label: "CV" },
  { key: "leterMotivuese", label: "Letër motivuese" },
  { key: "transkripta", label: "Transkripta notave" },
];

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

const SAMPLE_DATA = [];

export function PraktikaAplikimet() {
  const [kerkimi, setKerkimi] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [faqja, setFaqja] = useState(1);

  const filtered = SAMPLE_DATA.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(kerkimi.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = filtered.length === 0 ? 0 : (faqja - 1) * perPage + 1;
  const end = Math.min(faqja * perPage, filtered.length);
  const visible = filtered.slice((faqja - 1) * perPage, faqja * perPage);

  const handlePerPage = (val) => {
    setPerPage(val);
    setFaqja(1);
  };

  return (
    <div className="praktika-aplikimet-box">
      <div className="praktika-aplikimet-stack">
        <h1 className="praktika-aplikimet-title">
          Aplikimet për praktik
        </h1>
        <p className="praktika-aplikimet-text">
          Lista e aplikimeve tuaja për praktikë profesionale.
        </p>
      </div>

      <div className="praktika-aplikimet-box-2">
        {/* Toolbar */}
        <div className="praktika-aplikimet-stack-2">
          <div className="praktika-aplikimet-row">
            <span className="praktika-aplikimet-text-2">Shiko</span>
            <div className="praktika-aplikimet-box-3">
              <select
                value={perPage}
                onChange={(e) => handlePerPage(Number(e.target.value))}
                className="praktika-aplikimet-select"
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronsUpDown className="praktika-aplikimet-icon" />
            </div>
            <span className="praktika-aplikimet-text-2">rreshta</span>
          </div>

          <div className="praktika-aplikimet-row">
            <span className="praktika-aplikimet-text-3">Kërkoni:</span>
            <input
              type="text"
              value={kerkimi}
              onChange={(e) => { setKerkimi(e.target.value); setFaqja(1); }}
              className="praktika-aplikimet-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="praktika-aplikimet-scroll">
          <table className="praktika-aplikimet-table">
            <thead>
              <tr className="praktika-aplikimet-row-2">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="praktika-aplikimet-th"
                  >
                    <div className="praktika-aplikimet-row-3">
                      {col.label}
                      <ChevronsUpDown className="praktika-aplikimet-icon-2" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="praktika-aplikimet-cell"
                  >
                    Nuk ka të dhëna
                  </td>
                </tr>
              ) : (
                visible.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`praktika-aplikimet-row-4 ${
                      i % 2 === 0 ? "" : "praktika-aplikimet-row-5"
                    }`}
                  >
                    <td className="praktika-aplikimet-cell-2">{row.kompania}</td>
                    <td className="praktika-aplikimet-cell-2">{row.pozita}</td>
                    <td className="praktika-aplikimet-cell-3">{row.dataAplikimit}</td>
                    <td className="praktika-aplikimet-cell-4">{row.statusi}</td>
                    <td className="praktika-aplikimet-cell-3">{row.dataShqyrtimit}</td>
                    <td className="praktika-aplikimet-cell-3">{row.verejtje}</td>
                    <td className="praktika-aplikimet-cell-3">{row.cv}</td>
                    <td className="praktika-aplikimet-cell-3">{row.leterMotivuese}</td>
                    <td className="praktika-aplikimet-cell-3">{row.transkripta}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="praktika-aplikimet-stack-3">
          <span className="praktika-aplikimet-text-4">
            Duke treguar {start} deri {end} prej {filtered.length} rreshtave.
          </span>
          <div className="praktika-aplikimet-row">
            <button
              type="button"
              onClick={() => setFaqja((p) => Math.max(1, p - 1))}
              disabled={faqja === 1}
              className="praktika-aplikimet-btn"
            >
              E Kaluara
            </button>
            <button
              type="button"
              onClick={() => setFaqja((p) => Math.min(totalPages, p + 1))}
              disabled={faqja === totalPages || filtered.length === 0}
              className="praktika-aplikimet-btn"
            >
              Tjetra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

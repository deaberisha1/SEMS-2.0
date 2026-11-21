import { useState } from "react";
import { Plus, CheckCircle2, Clock, XCircle, X } from "lucide-react";
import "./QeqAplikimi.css";

const sampleData = [
  {
    id: 1,
    pershkrimi: "Aplikim për njohje të kualifikimit – Cikli i parë",
    dataKerkeses: "12.01.2026",
    aprovuar: "Aprovuar",
    dataVerifikimit: "20.01.2026",
    verejtje: "Dokumentet janë verifikuar me sukses.",
  },
  {
    id: 2,
    pershkrimi: "Aplikim për QEQ – Niveli 6",
    dataKerkeses: "03.03.2026",
    aprovuar: "Në pritje",
    dataVerifikimit: "—",
    verejtje: "Në proces shqyrtimi nga komisioni.",
  },
  {
    id: 3,
    pershkrimi: "Rikërkesë për vlerësim të diplomës",
    dataKerkeses: "15.02.2026",
    aprovuar: "Refuzuar",
    dataVerifikimit: "28.02.2026",
    verejtje: "Mungesa e dokumentit të noterizuar.",
  },
];

const statusConfig = {
  Aprovuar:  { icon: CheckCircle2, color: "qeq-aplikimi-color", bg: "qeq-aplikimi-bg", border: "qeq-aplikimi-border" },
  "Në pritje":{ icon: Clock,        color: "qeq-aplikimi-color-2", bg: "qeq-aplikimi-bg-2", border: "qeq-aplikimi-border-2" },
  Refuzuar:  { icon: XCircle,       color: "qeq-aplikimi-color-3", bg: "qeq-aplikimi-bg-3", border: "qeq-aplikimi-border-3" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`qeq-aplikimi-badge ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

export function QeqAplikimi() {
  const [rows, setRows] = useState(sampleData);
  const [showModal, setShowModal] = useState(false);
  const [pershkrimi, setPershkrimi] = useState("");
  const [verejtje, setVerejtje] = useState("");

  const handleApliko = () => {
    if (!pershkrimi.trim()) return;
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        pershkrimi: pershkrimi.trim(),
        dataKerkeses: formatted,
        aprovuar: "Në pritje",
        dataVerifikimit: "—",
        verejtje: verejtje.trim() || "—",
      },
    ]);
    setPershkrimi("");
    setVerejtje("");
    setShowModal(false);
  };

  return (
    <div className="qeq-aplikimi-box">
      <div className="qeq-aplikimi-box-2">

        {/* Header */}
        <div className="qeq-aplikimi-text">
          <h1 className="qeq-aplikimi-title">
            QEQ Aplikimi
          </h1>
          <p className="qeq-aplikimi-text-2">
            Menaxhoni aplikimet tuaja për Kuadrin Evropian të Kualifikimeve
          </p>
        </div>

        {/* Card */}
        <div className="qeq-aplikimi-box-3">

          {/* Toolbar */}
          <div className="qeq-aplikimi-box-4">
            <button
              onClick={() => setShowModal(true)}
              className="qeq-aplikimi-btn"
            >
              <Plus size={15} />
              Apliko
            </button>
          </div>

          {/* Desktop table */}
          <div className="qeq-aplikimi-scroll">
            <table className="qeq-aplikimi-table">
              <thead>
                <tr className="qeq-aplikimi-row">
                  {["Përshkrimi", "Data e kërkesës", "Aprovuar", "Data verifikimit", "Vërejtje"].map((h) => (
                    <th
                      key={h}
                      className="qeq-aplikimi-th"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="qeq-aplikimi-cell">
                      Nuk ka aplikime të regjistruara.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`qeq-aplikimi-row-2 ${
                        i < rows.length - 1 ? "qeq-aplikimi-row-3" : ""
                      }`}
                    >
                      <td className="qeq-aplikimi-cell-2">
                        <span className="qeq-aplikimi-text-3">
                          {r.pershkrimi}
                        </span>
                      </td>
                      <td className="qeq-aplikimi-cell-3">
                        {r.dataKerkeses}
                      </td>
                      <td className="qeq-aplikimi-cell-4">
                        <StatusBadge status={r.aprovuar} />
                      </td>
                      <td className="qeq-aplikimi-cell-3">
                        {r.dataVerifikimit}
                      </td>
                      <td className="qeq-aplikimi-cell-5">
                        <span className="qeq-aplikimi-text-4">{r.verejtje}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="qeq-aplikimi-box-5">
            {rows.length === 0 ? (
              <div className="qeq-aplikimi-cell">
                Nuk ka aplikime të regjistruara.
              </div>
            ) : (
              rows.map((r) => (
                <div key={r.id} className="qeq-aplikimi-box-6">
                  <div className="qeq-aplikimi-row-4">
                    <p className="qeq-aplikimi-text-5">
                      {r.pershkrimi}
                    </p>
                    <StatusBadge status={r.aprovuar} />
                  </div>
                  <div className="qeq-aplikimi-box-7">
                    <div className="qeq-aplikimi-row-5">
                      <span className="qeq-aplikimi-text-6">Data e kërkesës:</span>
                      <span>{r.dataKerkeses}</span>
                    </div>
                    <div className="qeq-aplikimi-row-5">
                      <span className="qeq-aplikimi-text-6">Data verifikimit:</span>
                      <span>{r.dataVerifikimit}</span>
                    </div>
                    {r.verejtje !== "—" && (
                      <p className="qeq-aplikimi-text-7">{r.verejtje}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="qeq-aplikimi-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="qeq-aplikimi-box-8">
            {/* Modal header */}
            <div className="qeq-aplikimi-row-6">
              <h2 className="qeq-aplikimi-title-2">
                Aplikim i ri
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="qeq-aplikimi-btn-2"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal body */}
            <div className="qeq-aplikimi-box-9">
              <div>
                <label className="qeq-aplikimi-label">
                  Përshkrimi <span className="qeq-aplikimi-text-8">*</span>
                </label>
                <textarea
                  value={pershkrimi}
                  onChange={(e) => setPershkrimi(e.target.value)}
                  placeholder="Shkruani përshkrimin e aplikimit..."
                  rows={3}
                  className="qeq-aplikimi-textarea"
                />
              </div>
              <div>
                <label className="qeq-aplikimi-label">
                  Vërejtje
                </label>
                <input
                  value={verejtje}
                  onChange={(e) => setVerejtje(e.target.value)}
                  placeholder="Opsionale..."
                  className="qeq-aplikimi-input"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="qeq-aplikimi-row-7">
              <button
                onClick={() => setShowModal(false)}
                className="qeq-aplikimi-btn-3"
              >
                Anulo
              </button>
              <button
                onClick={handleApliko}
                disabled={!pershkrimi.trim()}
                className="qeq-aplikimi-btn-4"
              >
                Dërgo aplikimin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

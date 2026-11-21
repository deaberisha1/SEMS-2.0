import { useState } from "react";
import { FilePlus2, CheckCircle2, XCircle, Clock } from "lucide-react";
import "./Cregjistrim.css";

const mockData = [
  {
    id: "REG-2024-001",
    level: "Bachelor",
    faculty: "Fakulteti i Shkencave Kompjuterike",
    department: "Inxhinieri Softuerike",
    requestDate: "2024-11-03",
    reason: "Transferim në universitet tjetër",
    approved: "Approved",
  },
  {
    id: "REG-2024-002",
    level: "Master",
    faculty: "Fakulteti Ekonomik",
    department: "Menaxhim Biznesi",
    requestDate: "2024-11-10",
    reason: "Rrethana personale",
    approved: "Pending",
  },
  {
    id: "REG-2024-003",
    level: "Bachelor",
    faculty: "Fakulteti Juridik",
    department: "E Drejtë Civile",
    requestDate: "2024-11-14",
    reason: "Vështirësi financiare",
    approved: "Rejected",
  },
  {
    id: "REG-2024-004",
    level: "Bachelor",
    faculty: "Fakulteti i Shkencave Kompjuterike",
    department: "Rrjeta Kompjuterike",
    requestDate: "2024-11-18",
    reason: "Arsye shëndetësore",
    approved: "Pending",
  },
  {
    id: "REG-2024-005",
    level: "PhD",
    faculty: "Fakulteti i Shkencave Natyrore",
    department: "Matematikë",
    requestDate: "2024-11-20",
    reason: "Punësim jashtë vendit",
    approved: "Approved",
  },
];

const statusConfig = {
  Approved: {
    label: "Aprovuar",
    icon: <CheckCircle2 size={13} />,
    className:
      "cregjistrim-variant",
  },
  Pending: {
    label: "Në pritje",
    icon: <Clock size={13} />,
    className:
      "cregjistrim-variant-2",
  },
  Rejected: {
    label: "Refuzuar",
    icon: <XCircle size={13} />,
    className:
      "cregjistrim-variant-3",
  },
};

export function Cregjistrim() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="cregjistrim-box">
      {/* Page header */}
      <div>
        <h1 className="cregjistrim-title">
          Kërkesat për çregjistrim
        </h1>
        <p className="cregjistrim-text">
          Menaxho kërkesat për çregjistrim nga universiteti
        </p>
      </div>

      {/* Card container */}
      <div className="cregjistrim-box-2">

        {/* Toolbar */}
        <div className="cregjistrim-row">
          <button
            onClick={() => setShowModal(true)}
            className="cregjistrim-btn"
          >
            <FilePlus2 size={15} />
            Dërgo Kërkesën për Çregjistrim
          </button>
        </div>

        {/* Table — desktop */}
        <div className="cregjistrim-scroll">
          <table className="cregjistrim-table">
            <thead>
              <tr className="cregjistrim-row-2">
                {["ID e Regjistrimit", "Niveli", "Fakulteti", "Departamenti", "Data e Kërkesës", "Arsyeja e Çregjistrimit", "Aprovuar"].map(
                  (col) => (
                    <th
                      key={col}
                      className="cregjistrim-th"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr
                  key={row.id}
                  className={`cregjistrim-row-3 ${
                    i < mockData.length - 1
                      ? "cregjistrim-row-2"
                      : ""
                  }`}
                >
                  <td className="cregjistrim-cell">
                    {row.id}
                  </td>
                  <td className="cregjistrim-cell-2">
                    {row.level}
                  </td>
                  <td className="cregjistrim-cell-3">
                    {row.faculty}
                  </td>
                  <td className="cregjistrim-cell-4">
                    {row.department}
                  </td>
                  <td className="cregjistrim-cell-5">
                    {row.requestDate}
                  </td>
                  <td className="cregjistrim-cell-6">
                    {row.reason}
                  </td>
                  <td className="cregjistrim-cell-7">
                    <span
                      className={`cregjistrim-badge ${statusConfig[row.approved].className}`}
                    >
                      {statusConfig[row.approved].icon}
                      {statusConfig[row.approved].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="cregjistrim-box-3">
          {mockData.map((row) => (
            <div key={row.id} className="cregjistrim-box-4">
              <div className="cregjistrim-row-4">
                <span className="cregjistrim-text-2">
                  {row.id}
                </span>
                <span
                  className={`cregjistrim-badge ${statusConfig[row.approved].className}`}
                >
                  {statusConfig[row.approved].icon}
                  {statusConfig[row.approved].label}
                </span>
              </div>
              <div className="cregjistrim-grid">
                <div>
                  <span className="cregjistrim-text-3">Niveli: </span>
                  <span className="cregjistrim-text-4">{row.level}</span>
                </div>
                <div>
                  <span className="cregjistrim-text-3">Data: </span>
                  <span className="cregjistrim-text-4">{row.requestDate}</span>
                </div>
                <div className="cregjistrim-box-5">
                  <span className="cregjistrim-text-3">Fakulteti: </span>
                  <span className="cregjistrim-text-4">{row.faculty}</span>
                </div>
                <div className="cregjistrim-box-5">
                  <span className="cregjistrim-text-3">Arsyeja: </span>
                  <span className="cregjistrim-text-4">{row.reason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register modal */}
      {showModal && (
        <div
          className="cregjistrim-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="cregjistrim-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="cregjistrim-title-2">
              Kërkesë e Re për Çregjistrim
            </h2>
            <p className="cregjistrim-text-5">
              Paraqit një kërkesë për çregjistrim nga universiteti.
            </p>

            <div className="cregjistrim-box-6">
              {[
                { label: "Niveli", placeholder: "p.sh. Bachelor, Master, PhD" },
                { label: "Fakulteti", placeholder: "Shkruaj emrin e fakultetit" },
                { label: "Departamenti", placeholder: "Shkruaj emrin e departamentit" },
                { label: "Arsyeja e Çregjistrimit", placeholder: "Përshkruaj shkurtimisht arsyen" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="cregjistrim-label">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="cregjistrim-input"
                  />
                </div>
              ))}
            </div>

            <div className="cregjistrim-row-5">
              <button
                onClick={() => setShowModal(false)}
                className="cregjistrim-btn-2"
              >
                Anulo
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cregjistrim-btn-3"
              >
                Dërgo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

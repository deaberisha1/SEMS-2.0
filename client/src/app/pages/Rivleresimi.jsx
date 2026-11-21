import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  FileSearch,
  CheckCircle,
  Clock,
  Plus,
  X,
  Upload,
  File,
  Lock,
} from "lucide-react";

import { api } from "../../api";
import "./Rivleresimi.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSES = [
  { emri: "Teoria e Gjasës",         profesor: "Prof. Bujar Fejzullahu" },
  { emri: "UX/UI Design",             profesor: "Prof. Korab Rrmoku" },
  { emri: "Siguria e të Dhënave",    profesor: "Prof. Artan Berisha" },
  { emri: "OOP / GUI",                profesor: "Prof. Faton Berisha" },
  { emri: "Inteligjenca Artificiale", profesor: "Prof. Eliot Bytyçi" },
];

const lendetStr = ["Zgjidhni lëndën...", ...COURSES.map((c) => c.emri)];

const semestret = [
  "Zgjidhni semestrin...",
  "Semestri 4",
  "Semestri 3",
  "Semestri 2",
  "Semestri 1",
];

const activeRequests = [
  {
    id: "RV-2024-001",
    lenda: "Siguria e të Dhënave",
    lloji: "Rivlerësim i provimit final",
    data: "18 Mars 2026",
    status: "Në shqyrtim",
    statusColor: "rivleresimi-status-color",
    statusBg: "rivleresimi-status-bg",
  },
  {
    id: "RV-2024-002",
    lenda: "OOP / GUI",
    lloji: "Rivlerësim i detyrës",
    data: "10 Mars 2026",
    status: "Aprovuar",
    statusColor: "rivleresimi-status-color-2",
    statusBg: "rivleresimi-status-bg-2",
  },
];

// ─── Custom Lënda Dropdown ────────────────────────────────────────────────────

function LendaDropdown({
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="rivleresimi-box" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`rivleresimi-btn ${
          open
            ? "rivleresimi-btn-2"
            : "rivleresimi-btn-3"
        }`}
      >
        {value ? (
          <div className="rivleresimi-row">
            <span className="rivleresimi-text">{value.emri}</span>
            <span className="rivleresimi-text-2">{value.profesor}</span>
          </div>
        ) : (
          <span className="rivleresimi-text-3">Zgjidhni lëndën për rivlerësim...</span>
        )}
        <ChevronDown
          size={16}
          className={`rivleresimi-icon ${open ? "rivleresimi-icon-2" : ""}`}
        />
      </button>

      {open && (
        <div className="rivleresimi-popup">
          {COURSES.map((course) => (
            <button
              key={course.emri}
              type="button"
              onClick={() => { onChange(course); setOpen(false); }}
              className={`rivleresimi-btn-4 ${
                value?.emri === course.emri ? "rivleresimi-btn-5" : ""
              }`}
            >
              <span className="rivleresimi-text-4">{course.emri}</span>
              <span className="rivleresimi-text-5">{course.profesor}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Simple select wrapper (used in search section) ───────────────────────────

function AppleSelect({ value, onChange, options, label, disabled }) {
  return (
    <div>
      <label className="rivleresimi-label">
        {label}
      </label>
      <div className="rivleresimi-box">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`rivleresimi-select ${
            value.includes("Zgjidhni")
              ? "rivleresimi-select-2"
              : "rivleresimi-select-3"
          } ${disabled ? "rivleresimi-select-4" : ""}`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} disabled={opt.includes("Zgjidhni")}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="rivleresimi-icon-3"
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Rivleresimi() {
  // Search section state
  const [lenda, setLenda] = useState(lendetStr[0]);
  const [semestri, setSemestri] = useState(semestret[0]);
  const [searched, setSearched] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFormLenda, setSelectedFormLenda] = useState(null);
  const [formSemestri, setFormSemestri] = useState("Semestri 4");
  const [formArsyeja, setFormArsyeja] = useState("");
  const [formDetaje, setFormDetaje] = useState("");
  const [formFile, setFormFile] = useState(null);
  const fileRef = useRef(null);

  const showDetailCard = selectedFormLenda !== null;
  const canSubmit = selectedFormLenda !== null && formArsyeja.trim().length > 0;
  const canSearch = !lenda.includes("Zgjidhni") && !semestri.includes("Zgjidhni");

  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  function handleSearch() {
    setSearched(true);
  }

  async function handleSubmit() {
    if (!canSubmit || sending) return;
    setSending(true);
    setMsg(null);
    try {
      await api.post("/student/requests", {
        type: "Rivlerësim",
        details: {
          lenda: selectedFormLenda,
          semestri: formSemestri,
          arsyeja: formArsyeja,
          detaje: formDetaje,
        },
      });
      setSubmitted(true);
      setShowForm(false);
      setMsg({ type: "ok", text: "Kërkesa u dërgua me sukses." });
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setSelectedFormLenda(null);
    setFormArsyeja("");
    setFormDetaje("");
    setFormFile(null);
    setFormSemestri("Semestri 4");
  }

  return (
    <div className="rivleresimi-box-2">
      <div className="">

        {/* Header */}
        <div className="rivleresimi-row-2">
          <div>
            <h1 className="rivleresimi-title">
              Vlerësimi i Vazhdueshëm
            </h1>
            <p className="rivleresimi-text-6">
              Kërko rivlerësim ose shiko kërkesat aktive
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setSubmitted(false); resetForm(); }}
            className="rivleresimi-btn-6"
          >
            <Plus size={16} />
            Kërkesë e re
          </button>
        </div>

        {/* Success notification */}
        {submitted && (
          <div className="rivleresimi-card">
            <CheckCircle size={18} className="rivleresimi-status-color-2" />
            <span className="rivleresimi-text-7">
              Kërkesa u dërgua me sukses! Do të marrësh përgjigje brenda 5 ditëve pune.
            </span>
          </div>
        )}

        {/* ── Modal ─────────────────────────────────────────────────────────── */}
        {showForm && (
          <div className="rivleresimi-overlay">
            <div className="rivleresimi-scroll">

              {/* Modal header */}
              <div className="rivleresimi-row-3">
                <h2 className="rivleresimi-title-2">
                  Kërkesë e re — Vlerësimi i Vazhdueshëm
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="rivleresimi-btn-7"
                >
                  <X size={18} className="rivleresimi-icon-4" />
                </button>
              </div>

              <div className="rivleresimi-box-3">

                {/* Lënda — custom dropdown with course + professor */}
                <div>
                  <label className="rivleresimi-label">
                    Lënda
                  </label>
                  <LendaDropdown value={selectedFormLenda} onChange={setSelectedFormLenda} />
                </div>

                {/* Semestri — 1-6, only 4 active, pre-selected */}
                <div>
                  <label className="rivleresimi-label">
                    Semestri
                  </label>
                  <div className="rivleresimi-box">
                    <select
                      value={formSemestri}
                      onChange={(e) => setFormSemestri(e.target.value)}
                      className="rivleresimi-select-5"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={`Semestri ${n}`} disabled={n !== 4}>
                          {`Semestri ${n}`}{n !== 4 ? " 🔒" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="rivleresimi-icon-3" />
                  </div>
                  {/* Locked semester note */}
                  <p className="rivleresimi-text-8">
                    <Lock size={11} />
                    Vetëm Semestri 4 është i hapur për rivlerësim aktualisht.
                  </p>
                </div>

                {/* Dynamic detail card — shown when lënda is selected */}
                {showDetailCard && (
                  <div className="rivleresimi-card-2">
                    <h3 className="rivleresimi-heading">
                      Detajet e Kërkesës
                    </h3>

                    {/* Arsyeja */}
                    <div>
                      <label className="rivleresimi-label">
                        Arsyeja <span className="rivleresimi-text-9">*</span>
                      </label>
                      <input
                        type="text"
                        value={formArsyeja}
                        onChange={(e) => setFormArsyeja(e.target.value)}
                        placeholder="Arsyeja e rivlerësimit (p.sh. mospajtim me notën, gabim teknik...)"
                        className="rivleresimi-input"
                      />
                    </div>

                    {/* Detaje */}
                    <div>
                      <label className="rivleresimi-label">
                        Detaje
                      </label>
                      <textarea
                        value={formDetaje}
                        onChange={(e) => setFormDetaje(e.target.value)}
                        placeholder="Përshkruani me detaje pse kërkoni rivlerësim për këtë lëndë..."
                        rows={4}
                        className="rivleresimi-textarea"
                      />
                    </div>

                    {/* Optional file upload */}
                    <div>
                      <label className="rivleresimi-label">
                        Ngarko dëshmi (opsional)
                      </label>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        className="rivleresimi-input-2"
                        onChange={(e) => setFormFile(e.target.files?.[0] ?? null)}
                      />
                      {formFile ? (
                        <div className="rivleresimi-card-3">
                          <File size={16} className="rivleresimi-icon-5" />
                          <span className="rivleresimi-text-10">{formFile.name}</span>
                          <button type="button" onClick={() => setFormFile(null)} className="rivleresimi-btn-8">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="rivleresimi-btn-9"
                        >
                          <Upload size={16} />
                          <span className="rivleresimi-text-11">Ngarko foto ose dokument (PDF, JPG, PNG)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {msg && <p style={{ color: msg.type === "ok" ? "#34C759" : "#FF3B30", fontSize: "0.85rem", margin: "0.5rem 1rem" }}>{msg.text}</p>}

              <div className="rivleresimi-row-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="rivleresimi-btn-10"
                >
                  Anulo
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || sending}
                  className="rivleresimi-btn-11"
                >
                  {sending ? "Duke dërguar…" : "Dërgo Kërkesën"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Active requests ────────────────────────────────────────────────── */}
        <div className="rivleresimi-text-12">
          <h2 className="rivleresimi-title-3">
            Kërkesat Aktive
          </h2>
          {activeRequests.length === 0 ? (
            <div className="rivleresimi-card-4">
              <div className="rivleresimi-icon-box">
                <FileSearch size={24} className="rivleresimi-icon-4" />
              </div>
              <p className="rivleresimi-text-13">
                Asnjë kërkesë aktive
              </p>
              <p className="rivleresimi-text-14">
                Klikoni "Kërkesë e re" për të filluar
              </p>
            </div>
          ) : (
            <div className="rivleresimi-box-4">
              {activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="rivleresimi-card-5"
                >
                  <div className={`rivleresimi-icon-box-2 ${req.statusBg}`}>
                    {req.status === "Aprovuar" ? (
                      <CheckCircle size={18} className={req.statusColor} />
                    ) : (
                      <Clock size={18} className={req.statusColor} />
                    )}
                  </div>
                  <div className="rivleresimi-box-5">
                    <div className="rivleresimi-text-15">
                      {req.lenda}
                    </div>
                    <div className="rivleresimi-row-5">
                      <span className="rivleresimi-text-16">{req.lloji}</span>
                      <span className="rivleresimi-text-16">•</span>
                      <span className="rivleresimi-text-16">{req.data}</span>
                    </div>
                  </div>
                  <div className="rivleresimi-stack">
                    <span className={`rivleresimi-badge ${req.statusBg} ${req.statusColor}`}>
                      {req.status}
                    </span>
                    <span className="rivleresimi-text-17">{req.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Search section ─────────────────────────────────────────────────── */}
        <div className="rivleresimi-box-6">
          <div className="rivleresimi-box-7">
            <h3 className="rivleresimi-text-13">
              Kërko Notë / Rezultat
            </h3>
            <p className="rivleresimi-text-18">
              Kërko notën e një lënde specifike
            </p>
          </div>

          <div className="rivleresimi-box-8">
            <div className="rivleresimi-grid">
              <AppleSelect label="Lënda" value={lenda} onChange={setLenda} options={lendetStr} />
              <div>
                <label className="rivleresimi-label">Semestri</label>
                <div className="rivleresimi-box">
                  <select
                    value={semestri}
                    onChange={(e) => setSemestri(e.target.value)}
                    className={`rivleresimi-select-6 ${semestri.includes("Zgjidhni") ? "rivleresimi-icon-4" : "rivleresimi-select-7"}`}
                  >
                    {semestret.map((s) => (
                      <option key={s} value={s} disabled={s.includes("Zgjidhni") || (!s.includes("4") && !s.includes("Zgjidhni"))}>
                        {s}{!s.includes("Zgjidhni") && !s.includes("4") ? " 🔒" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="rivleresimi-icon-3" />
                </div>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!canSearch}
              className="rivleresimi-btn-12"
            >
              <Search size={16} />
              Kërko
            </button>
          </div>

          {searched && canSearch && (() => {
            const components = [
              { name: "Kuiz",                max: 10, earned: 8 },
              { name: "Projekti",            max: 20, earned: 17 },
              { name: "Provimi Periodik 1",  max: 25, earned: 21 },
              { name: "Provimi Periodik 2",  max: 25, earned: 19 },
              { name: "Provimi Final",       max: 20, earned: 14 },
            ];
            const totalEarned = components.reduce((s, c) => s + c.earned, 0);
            const totalMax = components.reduce((s, c) => s + c.max, 0);
            const profesor = COURSES.find((c) => c.emri === lenda)?.profesor ?? "Prof. Artan Berisha";
            return (
              <div className="rivleresimi-box-9">
                <div className="rivleresimi-box-10">
                  <div className="rivleresimi-row-6">
                    <CheckCircle size={16} className="rivleresimi-status-color-2" />
                    <span className="rivleresimi-heading">Rezultati i gjetur</span>
                  </div>
                  <div className="rivleresimi-text-19">
                    Lënda: {lenda} <span className="rivleresimi-icon-4">·</span> Semestri 4 <span className="rivleresimi-icon-4">·</span> 6 ECTS
                  </div>

                  <div className="rivleresimi-box-11">
                    {components.map((c) => (
                      <div
                        key={c.name}
                        className="rivleresimi-grid-2"
                      >
                        <div className="rivleresimi-row-7">
                          <span className="rivleresimi-text-20">{c.name}</span>
                          <span className="rivleresimi-text-21">/ {c.max}</span>
                        </div>
                        <div className="rivleresimi-box-12">
                          {c.earned}
                        </div>
                        <span className="rivleresimi-badge-2">
                          Kaluar
                        </span>
                      </div>
                    ))}

                    {/* Total row */}
                    <div className="rivleresimi-grid-3">
                      <span className="rivleresimi-text-22">Pikët Totale</span>
                      <div className="rivleresimi-box-13">
                        {totalEarned} / {totalMax}
                      </div>
                      <div className="rivleresimi-avatar">
                        8
                      </div>
                    </div>
                  </div>

                  <p className="rivleresimi-text-23">
                    Nota përfundimtare llogaritet nga shuma e të gjitha komponentëve <span>·</span> Publikuar nga {profesor}
                  </p>
                </div>
              </div>
            );
          })()}

          {!searched && (
            <div className="rivleresimi-stack-2">
              <div className="rivleresimi-icon-box">
                <FileSearch size={24} className="rivleresimi-icon-6" />
              </div>
              <p className="rivleresimi-text-24">
                Zgjidhni lëndën dhe semestrin për të kërkuar
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

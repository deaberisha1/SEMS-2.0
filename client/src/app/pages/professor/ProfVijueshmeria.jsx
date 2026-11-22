import { useEffect, useMemo, useState } from "react";
import {
  QrCode,
  X,
  RefreshCw,
  CheckCircle2,
  Edit3,
  Download,
  MoreHorizontal,
  Clock,
} from "lucide-react";
import { PROF_COURSES, STUDENTS_BY_COURSE } from "../../data/professor";
import "./ProfVijueshmeria.css";

function buildStudentRows(courseId, seed) {
  const list = STUDENTS_BY_COURSE[courseId] || [];
  return list.map((s, i) => {
    const r = (seed * 31 + i * 17) % 10;
    let statusi = "Prezent";
    let checkIn = `10:${String(2 + (i % 5)).padStart(2, "0")}`;
    let checkOut = `11:${String(25 + (i % 6)).padStart(2, "0")}`;
    if (r === 0) { statusi = "Mungesë"; checkIn = "—"; checkOut = "—"; }
    else if (r === 1) { statusi = "Pjesërisht"; checkOut = "Nuk ka dalje"; }
    return {
      nr: i + 1,
      name: s.name,
      studentId: s.studentId,
      checkIn,
      checkOut,
      statusi,
    };
  });
}

function durationLabel(checkIn, checkOut, statusi) {
  if (statusi === "Mungesë" || checkIn === "—") return { mins: 0, label: "—" };
  if (checkOut === "Nuk ka dalje" || checkOut === "—") return { mins: 30, label: "Pa dalje" };
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const mins = h2 * 60 + m2 - (h1 * 60 + m1);
  return { mins, label: `${Math.floor(mins / 60)}h ${mins % 60}min` };
}

function durationColor(mins) {
  if (mins >= 75) return "prof-vijueshmeria-duration-color";
  if (mins >= 45) return "prof-vijueshmeria-duration-color-2";
  return "prof-vijueshmeria-duration-color-3";
}

function StatusBadge({ statusi }) {
  const cfg = {
    Prezent:    { label: "Prezent ✓",  cls: "prof-vijueshmeria-variant" },
    "Pjesërisht": { label: "Pjesërisht", cls: "prof-vijueshmeria-variant-2" },
    Mungesë:    { label: "Mungesë ✗",  cls: "prof-vijueshmeria-variant-3" },
  }[statusi];
  return (
    <span className={`prof-vijueshmeria-badge ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function rowBg(statusi, i) {
  if (statusi === "Mungesë") return "prof-vijueshmeria-row-bg";
  return i % 2 === 1 ? "prof-vijueshmeria-row-bg-2" : "";
}

function borderColor(statusi) {
  if (statusi === "Prezent") return "prof-vijueshmeria-border-color";
  if (statusi === "Pjesërisht") return "prof-vijueshmeria-border-color-2";
  return "prof-vijueshmeria-border-color-3";
}

export function ProfVijueshmeria() {
  const [courseId, setCourseId] = useState(PROF_COURSES[0].id);
  const [qrOpen, setQrOpen] = useState(false);
  const [countdown, setCountdown] = useState(272);

  const [sessionDate, setSessionDate] = useState("2026-04-14");
  const [sessionType, setSessionType] = useState("L");
  const [sessionRoom] = useState("Salla 201");

  const [editStudent, setEditStudent] = useState(null);
  const [reason, setReason] = useState("");
  const [overrides, setOverrides] = useState({});

  const students = STUDENTS_BY_COURSE[courseId] || [];
  const scannedCount = Math.floor(students.length * 0.7);

  const seed = useMemo(() => sessionDate.split("-").reduce((a, b) => a + parseInt(b, 10), 0), [sessionDate]);
  const baseRows = useMemo(() => buildStudentRows(courseId, seed), [courseId, seed]);
  const rows = baseRows.map((r) => overrides[r.studentId] ? { ...r, statusi: overrides[r.studentId] } : r);

  const counts = useMemo(() => {
    const c = { total: rows.length, p: 0, pj: 0, m: 0 };
    rows.forEach((r) => {
      if (r.statusi === "Prezent") c.p++;
      else if (r.statusi === "Pjesërisht") c.pj++;
      else c.m++;
    });
    return c;
  }, [rows]);

  useEffect(() => {
    if (!qrOpen) return;
    const t = setInterval(() => setCountdown((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [qrOpen]);

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  const sessionMeta = {
    id: `${courseId}-${sessionDate}-${sessionType}`,
    date: sessionDate,
    type: sessionType,
    course: PROF_COURSES.find((c) => c.id === courseId)?.name || "",
    room: sessionRoom,
  };

  return (
    <div className="prof-vijueshmeria-box">
      <div>
        <h1 className="prof-vijueshmeria-title">Vijueshmëria</h1>
        <p className="prof-vijueshmeria-text">Gjeneroni QR Code dhe shikoni detajet e secilit student për sesionin e zgjedhur</p>
      </div>

      {/* Course chips */}
      <div className="prof-vijueshmeria-row">
        {PROF_COURSES.map((c) => (
          <button key={c.id} onClick={() => setCourseId(c.id)} className={`prof-vijueshmeria-btn ${
            courseId === c.id ? "prof-vijueshmeria-btn-2" : "prof-vijueshmeria-btn-3"
          }`} style={courseId === c.id ? { backgroundColor: c.color } : undefined}>
            {c.name}
          </button>
        ))}
      </div>

      {/* QR card */}
      <div className="prof-vijueshmeria-card">
        <div className="prof-vijueshmeria-icon-box">
          <QrCode size={28} className="prof-vijueshmeria-icon" />
        </div>
        <h3 className="prof-vijueshmeria-heading">Filloni Skanimin</h3>
        <p className="prof-vijueshmeria-text-2">
          Gjeneroni një QR Code unik që studentët mund ta skanojnë për të regjistruar vijueshmërinë.
        </p>
        <button onClick={() => { setCountdown(272); setQrOpen(true); }} className="prof-vijueshmeria-btn-4">
          <QrCode size={16} /> Gjenero QR Code
        </button>
      </div>

      {/* Session selector + detail */}
      <div className="prof-vijueshmeria-box-2">
        <div className="prof-vijueshmeria-row-2">
          <div>
            <h3 className="prof-vijueshmeria-heading-2">
              Detajet e Sesionit
            </h3>
            <p className="prof-vijueshmeria-text-3">
              {sessionMeta.course} · {sessionMeta.room}
            </p>
          </div>
          <button className="prof-vijueshmeria-btn-5">
            <Download size={14} /> Eksporto Listën
          </button>
        </div>

        {/* Session selector controls */}
        <div className="prof-vijueshmeria-row-3">
          <div className="prof-vijueshmeria-stack">
            <label htmlFor="prof-vijueshmeria-data" className="prof-vijueshmeria-label">Data</label>
            <input
              id="prof-vijueshmeria-data"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="prof-vijueshmeria-input"
            />
          </div>
          <div className="prof-vijueshmeria-stack">
            <span className="prof-vijueshmeria-label" id="prof-vijueshmeria-tipi">Tipi</span>
            <div
              className="prof-vijueshmeria-row-4"
              role="group"
              aria-labelledby="prof-vijueshmeria-tipi"
            >
              {(["L", "U", "Lab"]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSessionType(t)}
                  aria-pressed={sessionType === t}
                  className={`prof-vijueshmeria-btn-6 ${
                    sessionType === t
                      ? "prof-vijueshmeria-btn-7"
                      : "prof-vijueshmeria-btn-8"
                  }`}
                >
                  {t === "L" ? "Ligjëratë" : t === "U" ? "Ushtrime" : "Laborator"}
                </button>
              ))}
            </div>
          </div>
          <div className="prof-vijueshmeria-stack-2">
            <div className="prof-vijueshmeria-row-5">
              <span className="prof-vijueshmeria-text-4">{counts.total} studentë</span>
              <span className="prof-vijueshmeria-text-5">{counts.p} prezent</span>
              <span className="prof-vijueshmeria-text-6">{counts.pj} pjesërisht</span>
              <span className="prof-vijueshmeria-text-7">{counts.m} mungesë</span>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="prof-vijueshmeria-scroll">
          <table className="prof-vijueshmeria-table">
            <caption className="sr-only">Prezenca në sesion</caption>
            <thead>
              <tr className="prof-vijueshmeria-row-6">
                {["Nr.", "Studenti", "Nr. Studentor", "Check-in", "Check-out", "Kohëzgjatja", "Statusi", "Veprim"].map((h) => (
                  <th scope="col" key={h} className="prof-vijueshmeria-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dur = durationLabel(r.checkIn, r.checkOut, r.statusi);
                return (
                  <tr
                    key={r.studentId}
                    className={`prof-vijueshmeria-row-7 ${rowBg(r.statusi, i)}`}
                  >
                    <td className="prof-vijueshmeria-cell">{r.nr}</td>
                    <td className="prof-vijueshmeria-cell-2">{r.name}</td>
                    <td className="prof-vijueshmeria-cell-3">{r.studentId}</td>
                    <td className="prof-vijueshmeria-cell-4">{r.checkIn}</td>
                    <td className={`prof-vijueshmeria-cell-5 ${
                      r.checkOut === "Nuk ka dalje" ? "prof-vijueshmeria-text-6" : "prof-vijueshmeria-cell-6"
                    }`}>{r.checkOut}</td>
                    <td className={`prof-vijueshmeria-cell-7 ${durationColor(dur.mins)}`}>{dur.label}</td>
                    <td className="prof-vijueshmeria-cell-8"><StatusBadge statusi={r.statusi} /></td>
                    <td className="prof-vijueshmeria-cell-8">
                      <button onClick={() => setEditStudent({ name: r.name, idx: i })} className="prof-vijueshmeria-btn-9">
                        <Edit3 size={14} className="prof-vijueshmeria-icon-2" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="prof-vijueshmeria-text-8">
          {rows.map((r) => {
            const dur = durationLabel(r.checkIn, r.checkOut, r.statusi);
            return (
              <div
                key={r.studentId}
                className={`prof-vijueshmeria-box-3 ${borderColor(r.statusi)} ${r.statusi === "Mungesë" ? "prof-vijueshmeria-row-bg" : ""}`}
              >
                <div className="prof-vijueshmeria-row-8">
                  <div className="prof-vijueshmeria-box-4">
                    <div className="prof-vijueshmeria-text-9">{r.name}</div>
                    <div className="prof-vijueshmeria-text-10">{r.studentId}</div>
                  </div>
                  <button onClick={() => setEditStudent({ name: r.name, idx: r.nr - 1 })} className="prof-vijueshmeria-btn-10">
                    <MoreHorizontal size={16} className="prof-vijueshmeria-icon-2" />
                  </button>
                </div>
                <div className="prof-vijueshmeria-row-9">
                  <div className="prof-vijueshmeria-row-10">
                    <span className="prof-vijueshmeria-badge-2">
                      <Clock size={10} /> {r.checkIn}
                    </span>
                    <span className={`prof-vijueshmeria-badge-3 ${
                      r.checkOut === "Nuk ka dalje" || r.checkOut === "—"
                        ? "prof-vijueshmeria-variant-2"
                        : "prof-vijueshmeria-btn-8"
                    }`}>
                      <Clock size={10} /> {r.checkOut === "Nuk ka dalje" ? "Pa dalje" : r.checkOut}
                    </span>
                    {dur.label !== "—" && (
                      <span className={`prof-vijueshmeria-text-11 ${durationColor(dur.mins)}`}>{dur.label}</span>
                    )}
                  </div>
                  <StatusBadge statusi={r.statusi} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Modal */}
      {qrOpen && (
        <div className="prof-vijueshmeria-overlay" onClick={() => setQrOpen(false)}>
          <div className="prof-vijueshmeria-card-2" onClick={(e) => e.stopPropagation()}>
            <div className="prof-vijueshmeria-row-11">
              <div>
                <h3 className="prof-vijueshmeria-heading-3">{PROF_COURSES.find(c=>c.id===courseId)?.name}</h3>
                <p className="prof-vijueshmeria-text-12">23 maj 2026 · 10:00 · Salla 201</p>
              </div>
              <button onClick={() => setQrOpen(false)} className="prof-vijueshmeria-btn-11">
                <X size={20} className="prof-vijueshmeria-icon-2" />
              </button>
            </div>
            <div className="prof-vijueshmeria-grid">
              <div className="prof-vijueshmeria-stack-3">
                <div className="prof-vijueshmeria-box-5">
                  <svg width="240" height="240" className="prof-vijueshmeria-svg">
                    <circle cx="120" cy="120" r="115" fill="none" stroke="#F2F2F7" strokeWidth="6" className="prof-vijueshmeria-ring" />
                    <circle cx="120" cy="120" r="115" fill="none" stroke="#007AFF" strokeWidth="6" strokeDasharray={2 * Math.PI * 115} strokeDashoffset={2 * Math.PI * 115 * (1 - countdown / 300)} strokeLinecap="round" className="prof-vijueshmeria-ring-2" />
                  </svg>
                  <div className="prof-vijueshmeria-popup">
                    <div className="prof-vijueshmeria-grid-2">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div key={i} className={`${(i * 7) % 11 > 5 ? "prof-vijueshmeria-box-6" : "prof-vijueshmeria-box-7"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="prof-vijueshmeria-text-13">
                  <div className="prof-vijueshmeria-text-14">QR-i skadon për</div>
                  <div className="prof-vijueshmeria-text-15">{mm}:{ss}</div>
                  <div className="prof-vijueshmeria-text-16">
                    Studentë që kanë skanuar: {scannedCount} / {students.length}
                  </div>
                </div>
                <div className="prof-vijueshmeria-row-12">
                  <button onClick={() => setCountdown(300)} className="prof-vijueshmeria-btn-12">
                    <RefreshCw size={12} /> Rifresko QR
                  </button>
                  <button onClick={() => setQrOpen(false)} className="prof-vijueshmeria-btn-13">
                    Mbyll Skanimin
                  </button>
                </div>
              </div>
              <div className="prof-vijueshmeria-card-3">
                <div className="prof-vijueshmeria-text-17">Live</div>
                <div className="prof-vijueshmeria-box-8">
                  {students.map((st, i) => (
                    <div key={st.studentId} className={`prof-vijueshmeria-row-13 ${i < scannedCount ? "prof-vijueshmeria-box-9" : "prof-vijueshmeria-box-10"}`}>
                      {i < scannedCount && <CheckCircle2 size={12} className="prof-vijueshmeria-duration-color" />}
                      <span className="prof-vijueshmeria-text-18">{st.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit attendance reason modal */}
      {editStudent && (
        <div className="prof-vijueshmeria-overlay-2" onClick={() => setEditStudent(null)}>
          <div className="prof-vijueshmeria-card-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="prof-vijueshmeria-heading-4">Ndrysho statusin</h3>
            <p className="prof-vijueshmeria-text-19">{editStudent.name}</p>
            <div className="prof-vijueshmeria-row-14">
              {(["Prezent", "Pjesërisht", "Mungesë"]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const sid = baseRows[editStudent.idx]?.studentId;
                    if (sid) setOverrides((o) => ({ ...o, [sid]: s }));
                  }}
                  className="prof-vijueshmeria-btn-14"
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Arsyeja e ndryshimit (p.sh. problem teknik me QR)"
              rows={3}
              aria-label="Arsyeja e ndryshimit"
              className="prof-vijueshmeria-textarea"
            />
            <div className="prof-vijueshmeria-row-15">
              <button onClick={() => setEditStudent(null)} className="prof-vijueshmeria-btn-15">Anulo</button>
              <button onClick={() => { setEditStudent(null); setReason(""); }} className="prof-vijueshmeria-btn-16">Ruaj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

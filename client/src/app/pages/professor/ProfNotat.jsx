import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { api } from "../../../api";
import { PROF_COURSES, STUDENTS_BY_COURSE } from "../../data/professor";
import "./ProfNotat.css";

const SESSIONS = ["Qershor 2026", "Shtator 2026", "Janar 2026"];

function gradeFor(total) {
  if (total < 51) return { grade: 5, status: "Mbetur" };
  if (total <= 60) return { grade: 6, status: "Kaluar" };
  if (total <= 70) return { grade: 7, status: "Kaluar" };
  if (total <= 80) return { grade: 8, status: "Kaluar" };
  if (total <= 90) return { grade: 9, status: "Kaluar" };
  return { grade: 10, status: "Kaluar" };
}

export function ProfNotat() {
  const [courseId, setCourseId] = useState(PROF_COURSES[0].id);
  const [session, setSession] = useState(SESSIONS[0]);
  const [rows, setRows] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [toast, setToast] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const students = STUDENTS_BY_COURSE[courseId] || [];
    Promise.all([
      api.get(`/professor/grades?courseId=${courseId}`).catch(() => []),
      api.get(`/professor/assessments?courseId=${courseId}`).catch(() => []),
    ]).then(([grades, assessments]) => {
      const gradeMap = {};
      for (const g of grades) gradeMap[g.studentId] = g;
      const assessMap = {};
      for (const a of assessments) assessMap[a.studentId] = a;
      setRows(students.map((s) => {
        const g = gradeMap[s.studentId];
        const a = assessMap[s.studentId];
        const continuous = a ? (a.kuiz + a.p1 + a.p2 + a.k1 + a.k2) : s.points;
        return {
          studentId: s.studentId,
          name: s.name,
          continuous,
          exam: g?.exam ?? 0,
          override: g?.override ?? undefined,
        };
      }));
    });
  }, [courseId]);

  const updateExam = (idx, val) => {
    let v = parseInt(val) || 0;
    if (v < 0) v = 0;
    if (v > 100) v = 100;
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, exam: v } : r)));
  };

  const updateOverride = (idx, val) => {
    const v = val === "" ? undefined : Math.min(10, Math.max(5, parseInt(val) || 5));
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, override: v } : r)));
  };

  const publish = async () => {
    setConfirm(false);
    if (publishing) return;
    setPublishing(true);
    setMsg(null);
    try {
      const grades = rows.map((r) => {
        const auto = gradeFor(r.exam);
        const finalGrade = r.override ?? auto.grade;
        return {
          studentId: r.studentId,
          exam: r.exam,
          final: finalGrade,
          override: r.override ?? null,
        };
      });
      await api.post("/professor/grades", { courseId, grades });
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="prof-notat-box">
      <div>
        <h1 className="prof-notat-title">Notat Përfundimtare</h1>
        <p className="prof-notat-text">Vendosni notat e provimit final për studentët</p>
      </div>

      <div className="prof-notat-card">
        <AlertTriangle size={18} className="prof-notat-icon" />
        <p className="prof-notat-text-2">
          Publikimi i notës nuk e mbyll automatikisht afatin e rivlerësimit (7 ditë pas publikimit).
        </p>
      </div>

      <div className="prof-notat-row">
        <div className="prof-notat-row-2">
          {PROF_COURSES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCourseId(c.id)}
              className={`prof-notat-btn ${
                courseId === c.id ? "prof-notat-btn-2" : "prof-notat-btn-3"
              }`}
              style={courseId === c.id ? { backgroundColor: c.color } : undefined}
            >
              {c.name}
            </button>
          ))}
        </div>
        <select value={session} onChange={(e) => setSession(e.target.value)} className="prof-notat-select">
          {SESSIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="prof-notat-scroll">
        <table className="prof-notat-table">
          <thead>
            <tr className="prof-notat-row-3">
              <th className="prof-notat-th">Studenti</th>
              <th className="prof-notat-th-2">Vazhdueshmëria</th>
              <th className="prof-notat-th-2">Provimi (max 100)</th>
              <th className="prof-notat-th-2">Nota (auto)</th>
              <th className="prof-notat-th-2">Override</th>
              <th className="prof-notat-th-2">Statusi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const auto = gradeFor(r.exam);
              const finalGrade = r.override ?? auto.grade;
              const finalStatus = finalGrade >= 6 ? "Kaluar" : "Mbetur";
              return (
                <tr key={r.studentId} className="prof-notat-row-4">
                  <td className="prof-notat-cell">
                    <div className="prof-notat-text-3">{r.name}</div>
                    <div className="prof-notat-text-4">{r.studentId}</div>
                  </td>
                  <td className="prof-notat-cell-2">{r.continuous}/100</td>
                  <td className="prof-notat-cell-3">
                    <input type="number" min={0} max={100} value={r.exam} onChange={(e) => updateExam(idx, e.target.value)} className="prof-notat-input" />
                  </td>
                  <td className="prof-notat-cell-4">{auto.grade}</td>
                  <td className="prof-notat-cell-3">
                    <input type="number" min={5} max={10} value={r.override ?? ""} onChange={(e) => updateOverride(idx, e.target.value)} placeholder="—" className="prof-notat-input-2" />
                  </td>
                  <td className="prof-notat-cell-3">
                    <span className={`prof-notat-badge ${
                      finalStatus === "Kaluar" ? "prof-notat-text-5" : "prof-notat-text-6"
                    }`}>
                      {finalStatus} ({finalGrade})
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {msg && <p style={{ color: "#FF3B30", fontSize: "0.85rem", margin: "0.5rem 0" }}>{msg}</p>}

      <div className="prof-notat-row-5">
        <button onClick={() => setConfirm(true)} disabled={publishing} className="prof-notat-btn-4">
          {publishing ? "Duke publikuar…" : "Publiko Notat"}
        </button>
      </div>

      {confirm && (
        <div className="prof-notat-overlay" onClick={() => setConfirm(false)}>
          <div className="prof-notat-card-2" onClick={(e) => e.stopPropagation()}>
            <div className="prof-notat-row-6">
              <h3 className="prof-notat-heading">Konfirmoni publikimin</h3>
              <button onClick={() => setConfirm(false)}><X size={18} className="prof-notat-icon-2" /></button>
            </div>
            <p className="prof-notat-text-7">
              Pas publikimit, notat shfaqen te studentët dhe nuk mund të ndryshohen pa kërkesë rivlerësimi. Jeni të sigurt?
            </p>
            <div className="prof-notat-row-7">
              <button onClick={() => setConfirm(false)} className="prof-notat-btn-5">Anulo</button>
              <button onClick={publish} className="prof-notat-btn-6">Publiko</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="prof-notat-card-3">
          <CheckCircle2 size={18} />
          <span className="prof-notat-text-8">Notat u publikuan me sukses.</span>
        </div>
      )}
    </div>
  );
}

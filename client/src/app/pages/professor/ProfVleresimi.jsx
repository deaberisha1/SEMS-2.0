import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { api } from "../../../api";
import { PROF_COURSES, STUDENTS_BY_COURSE } from "../../data/professor";
import "./ProfVleresimi.css";

const MAXES = { kuiz: 10, p1: 20, p2: 20, k1: 25, k2: 25 };

export function ProfVleresimi() {
  const [courseId, setCourseId] = useState(PROF_COURSES[0].id);
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const students = STUDENTS_BY_COURSE[courseId] || [];
    api.get(`/professor/assessments?courseId=${courseId}`).then((serverRows) => {
      const byStudent = {};
      for (const r of serverRows) byStudent[r.studentId] = r;
      setRows(students.map((s) => {
        const sr = byStudent[s.studentId];
        return {
          studentId: s.studentId,
          name: s.name,
          kuiz: sr?.kuiz ?? 0,
          p1: sr?.p1 ?? 0,
          p2: sr?.p2 ?? 0,
          k1: sr?.k1 ?? 0,
          k2: sr?.k2 ?? 0,
        };
      }));
    }).catch(() => {
      setRows(students.map((s) => ({
        studentId: s.studentId,
        name: s.name,
        kuiz: 0, p1: 0, p2: 0, k1: 0, k2: 0,
      })));
    });
  }, [courseId]);

  const update = (idx, key, val) => {
    const max = MAXES[key];
    let v = parseInt(val) || 0;
    if (v < 0) v = 0;
    if (v > max) v = max;
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: v } : r)));
  };

  const total = (r) => r.kuiz + r.p1 + r.p2 + r.k1 + r.k2;
  const status = (r) => (r.kuiz && r.p1 && r.p2 && r.k1 && r.k2 ? "Përfunduar" : "Në proces");

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMsg(null);
    try {
      await api.post("/professor/assessments", { courseId, rows });
      setToast(true);
      setTimeout(() => setToast(false), 3500);
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving(false);
    }
  };

  const course = PROF_COURSES.find((c) => c.id === courseId);

  return (
    <div className="prof-vleresimi-box">
      <div>
        <h1 className="prof-vleresimi-title">Vlerësimi i Vazhdueshëm</h1>
        <p className="prof-vleresimi-text">
          Plotësoni pikët për secilin student · Semestri {course.semester}
        </p>
      </div>

      <div className="prof-vleresimi-row">
        {PROF_COURSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCourseId(c.id)}
            className={`prof-vleresimi-btn ${
              courseId === c.id ? "prof-vleresimi-btn-2" : "prof-vleresimi-btn-3"
            }`}
            style={courseId === c.id ? { backgroundColor: c.color } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="prof-vleresimi-scroll">
        <table className="prof-vleresimi-table">
          <thead>
            <tr className="prof-vleresimi-row-2">
              <th className="prof-vleresimi-th">Studenti</th>
              <th className="prof-vleresimi-th-2">Kuiz<br/><span className="prof-vleresimi-text-2">/10</span></th>
              <th className="prof-vleresimi-th-2">Projekti 1<br/><span className="prof-vleresimi-text-2">/20</span></th>
              <th className="prof-vleresimi-th-2">Projekti 2<br/><span className="prof-vleresimi-text-2">/20</span></th>
              <th className="prof-vleresimi-th-2">Kolokf. 1<br/><span className="prof-vleresimi-text-2">/25</span></th>
              <th className="prof-vleresimi-th-2">Kolokf. 2<br/><span className="prof-vleresimi-text-2">/25</span></th>
              <th className="prof-vleresimi-th-2">Totali</th>
              <th className="prof-vleresimi-th-2">Statusi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.studentId} className="prof-vleresimi-row-3">
                <td className="prof-vleresimi-cell">{r.name}</td>
                {(["kuiz", "p1", "p2", "k1", "k2"]).map((k) => (
                  <td key={k} className="prof-vleresimi-cell-2">
                    <input
                      type="number"
                      min={0}
                      max={MAXES[k]}
                      value={r[k]}
                      onChange={(e) => update(idx, k, e.target.value)}
                      className="prof-vleresimi-input"
                    />
                  </td>
                ))}
                <td className="prof-vleresimi-cell-3">{total(r)}/100</td>
                <td className="prof-vleresimi-cell-4">
                  <span className={`prof-vleresimi-badge ${
                    status(r) === "Përfunduar" ? "prof-vleresimi-text-3" : "prof-vleresimi-text-4"
                  }`}>
                    {status(r)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {msg && <p style={{ color: "#FF3B30", fontSize: "0.85rem", margin: "0.5rem 0" }}>{msg}</p>}

      <div className="prof-vleresimi-row-4">
        <button onClick={save} disabled={saving} className="prof-vleresimi-btn-4">
          <Save size={14} /> {saving ? "Duke ruajtur…" : "Ruaj Vlerësimet"}
        </button>
      </div>

      {toast && (
        <div className="prof-vleresimi-card">
          <CheckCircle2 size={18} />
          <span className="prof-vleresimi-text-5">Vlerësimet u ruajtën.</span>
        </div>
      )}
    </div>
  );
}

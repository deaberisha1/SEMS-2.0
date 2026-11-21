import { useState } from "react";
import { Search, Download, X } from "lucide-react";
import { PROF_COURSES, STUDENTS_BY_COURSE } from "../../data/professor";
import "./ProfStudentet.css";

export function ProfStudentet() {
  const [courseId, setCourseId] = useState(PROF_COURSES[0].id);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const students = (STUDENTS_BY_COURSE[courseId] || []).filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search)
  );

  const statusBadge = (s) => {
    if (s === "Aktiv") return "prof-studentet-status-badge";
    if (s === "Rrezik mungesash") return "prof-studentet-status-badge-2";
    return "prof-studentet-status-badge-3";
  };

  return (
    <div className="prof-studentet-box">
      <div className="prof-studentet-row">
        <div>
          <h1 className="prof-studentet-title">Studentët</h1>
          <p className="prof-studentet-text">Lista e studentëve për lëndët tuaja</p>
        </div>
        <button className="prof-studentet-btn">
          <Download size={14} /> Eksporto Listën
        </button>
      </div>

      <div className="prof-studentet-row-2">
        {PROF_COURSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCourseId(c.id)}
            className={`prof-studentet-btn-2 ${
              courseId === c.id
                ? "prof-studentet-btn-3"
                : "prof-studentet-btn-4"
            }`}
            style={courseId === c.id ? { backgroundColor: c.color } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="prof-studentet-box-2">
        <div className="prof-studentet-box-3">
          <div className="prof-studentet-card">
            <Search size={14} className="prof-studentet-icon" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko sipas emrit ose numrit studentor..."
              className="prof-studentet-input"
            />
          </div>
        </div>
        <div className="prof-studentet-scroll">
          <table className="prof-studentet-table">
            <thead>
              <tr className="prof-studentet-row-3">
                <th className="prof-studentet-th">Nr.</th>
                <th className="prof-studentet-th">Emri</th>
                <th className="prof-studentet-th">Nr. Studentor</th>
                <th className="prof-studentet-th">Vijueshmëria</th>
                <th className="prof-studentet-th">Pikët</th>
                <th className="prof-studentet-th">Statusi</th>
                <th className="prof-studentet-th"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentId} className="prof-studentet-row-4">
                  <td className="prof-studentet-cell">{s.nr}</td>
                  <td className="prof-studentet-cell-2">{s.name}</td>
                  <td className="prof-studentet-cell-3">{s.studentId}</td>
                  <td className="prof-studentet-cell-4">
                    <div className="prof-studentet-row-5">
                      <div className="prof-studentet-dot">
                        <div className="prof-studentet-box-4" style={{
                          width: `${s.attendance}%`,
                          backgroundColor: s.attendance >= 90 ? "#34C759" : s.attendance >= 75 ? "#FF9500" : "#FF3B30",
                        }} />
                      </div>
                      <span className="prof-studentet-text-2">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="prof-studentet-cell-5">{s.points}/100</td>
                  <td className="prof-studentet-cell-4">
                    <span className={`prof-studentet-badge ${statusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="prof-studentet-cell-4">
                    <button onClick={() => setSelected(s)} className="prof-studentet-btn-5">
                      Detaje
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={7} className="prof-studentet-cell-6">Nuk u gjet asnjë student</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="prof-studentet-overlay" onClick={() => setSelected(null)}>
          <div className="prof-studentet-card-2" onClick={(e) => e.stopPropagation()}>
            <div className="prof-studentet-row-6">
              <div>
                <h3 className="prof-studentet-heading">{selected.name}</h3>
                <p className="prof-studentet-text-3">{selected.studentId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="prof-studentet-btn-6">
                <X size={18} className="prof-studentet-icon" />
              </button>
            </div>
            <div className="prof-studentet-box-5">
              <div className="prof-studentet-card-3">
                <div className="prof-studentet-text-4">Vijueshmëria</div>
                <div className="prof-studentet-text-5">{selected.attendance}%</div>
              </div>
              <div className="prof-studentet-card-3">
                <div className="prof-studentet-text-4">Vlerësimi i Vazhdueshëm</div>
                <div className="prof-studentet-box-6">
                  <Row label="Kuiz" value={`${Math.round(selected.points * 0.1)}/10`} />
                  <Row label="Projekti 1" value={`${Math.round(selected.points * 0.2)}/20`} />
                  <Row label="Projekti 2" value={`${Math.round(selected.points * 0.2)}/20`} />
                  <Row label="Kolokfiumi 1" value={`${Math.round(selected.points * 0.25)}/25`} />
                  <Row label="Kolokfiumi 2" value={`${Math.round(selected.points * 0.25)}/25`} />
                  <div className="prof-studentet-row-7">
                    <span>Totali</span><span>{selected.points}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="prof-studentet-row-8">
      <span className="prof-studentet-text-6">{label}</span>
      <span className="prof-studentet-text-7">{value}</span>
    </div>
  );
}

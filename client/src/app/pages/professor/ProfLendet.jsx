import { useNavigate } from "react-router";
import { Users, FolderOpen, ClipboardCheck } from "lucide-react";
import { PROF_COURSES } from "../../data/professor";
import "./ProfLendet.css";

export function ProfLendet() {
  const navigate = useNavigate();
  return (
    <div className="prof-lendet-box">
      <div>
        <h1 className="prof-lendet-title">Lëndët e Mia</h1>
        <p className="prof-lendet-text">4 lëndë aktive · Semestri 2 (2025/26)</p>
      </div>

      <div className="prof-lendet-grid">
        {PROF_COURSES.map((c) => (
          <div key={c.id} className="prof-lendet-box-2">
            <div className="prof-lendet-box-3" style={{ backgroundColor: c.color }} />
            <div className="prof-lendet-box-4">
              <div className="prof-lendet-row">
                <div>
                  <h3 className="prof-lendet-heading">{c.name}</h3>
                  <div className="prof-lendet-row-2">
                    <span className="prof-lendet-badge">
                      Viti {c.year} · Semestri {c.semester}
                    </span>
                    <span className="prof-lendet-badge-2" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                      {c.ects} ECTS
                    </span>
                  </div>
                </div>
              </div>
              <div className="prof-lendet-text-2">
                <Users size={13} className="prof-lendet-icon" />
                {c.students} studentë të regjistruar
              </div>
              <div className="prof-lendet-row-3">
                <button onClick={() => navigate("/prof/studentet")} className="prof-lendet-btn">
                  <Users size={12} /> Studentët
                </button>
                <button onClick={() => navigate("/prof/materialet")} className="prof-lendet-btn">
                  <FolderOpen size={12} /> Materialet
                </button>
                <button onClick={() => navigate("/prof/vleresimi")} className="prof-lendet-btn">
                  <ClipboardCheck size={12} /> Vlerësimi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

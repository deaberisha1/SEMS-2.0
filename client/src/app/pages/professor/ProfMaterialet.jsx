import { useState } from "react";
import { Upload, X, CheckCircle2, Download, Edit3, Trash2, FileText } from "lucide-react";
import { PROF_COURSES } from "../../data/professor";
import "./ProfMaterialet.css";

const INITIAL = [
  { id: "m1", name: "Hyrje në Rrjetat Kompjuterike.pdf", course: "rrjeta", type: "Ligjëratë", date: "20.05.2026", size: "4.2 MB", downloads: 42 },
  { id: "m2", name: "Syllabusi - UX/UI Design.pdf", course: "uxui", type: "Syllabus", date: "10.02.2026", size: "0.8 MB", downloads: 38 },
  { id: "m3", name: "Detyra Kursi 1 - Programimi në Web.pdf", course: "web", type: "Detyra Kursi", date: "15.05.2026", size: "1.2 MB", downloads: 28 },
  { id: "m4", name: "Ushtrime - Sistemet e Informacionit.pdf", course: "sinf", type: "Ushtrime", date: "18.05.2026", size: "2.5 MB", downloads: 26 },
];

const TYPE_COLORS = {
  "Ligjëratë": "#007AFF",
  "Ushtrime": "#AF52DE",
  "Detyra Kursi": "#FF9500",
  "Literaturë": "#34C759",
  "Syllabus": "#5856D6",
};

export function ProfMaterialet() {
  const [courseId, setCourseId] = useState(PROF_COURSES[0].id);
  const [materials, setMaterials] = useState(INITIAL);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Ligjëratë");

  const filtered = materials.filter((m) => m.course === courseId);
  const courseName = PROF_COURSES.find((c) => c.id === courseId)?.name || "";

  const upload = () => {
    if (!name) return;
    setMaterials((prev) => [
      { id: `m${Date.now()}`, name, course: courseId, type, date: new Date().toLocaleDateString("sq"), size: "1.0 MB", downloads: 0 },
      ...prev,
    ]);
    setUploadOpen(false);
    setName("");
    setToast("Materiali u ngarkua me sukses. Studentët mund ta shohin tani.");
    setTimeout(() => setToast(""), 3500);
  };

  const remove = () => {
    setMaterials((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    setToast("Materiali u fshi.");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="prof-materialet-box">
      <div className="prof-materialet-row">
        <div>
          <h1 className="prof-materialet-title">Materialet</h1>
          <p className="prof-materialet-text">Ngarkoni dhe menaxhoni materialet për studentët</p>
        </div>
        <button onClick={() => setUploadOpen(true)} className="prof-materialet-btn">
          <Upload size={14} /> Ngarko Material të Ri
        </button>
      </div>

      <div className="prof-materialet-row-2">
        {PROF_COURSES.map((c) => (
          <button key={c.id} onClick={() => setCourseId(c.id)} className={`prof-materialet-btn-2 ${
            courseId === c.id ? "prof-materialet-btn-3" : "prof-materialet-btn-4"
          }`} style={courseId === c.id ? { backgroundColor: c.color } : undefined}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="prof-materialet-scroll">
        <table className="prof-materialet-table">
          <caption className="sr-only">Materialet e lëndës</caption>
          <thead>
            <tr className="prof-materialet-row-3">
              <th scope="col" className="prof-materialet-th">Emri</th>
              <th scope="col" className="prof-materialet-th">Lloji</th>
              <th scope="col" className="prof-materialet-th">Data</th>
              <th scope="col" className="prof-materialet-th">Madhësia</th>
              <th scope="col" className="prof-materialet-th">Shkarkime</th>
              <th scope="col" className="prof-materialet-th">Veprime</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="prof-materialet-row-4">
                <td className="prof-materialet-cell">
                  <div className="prof-materialet-row-5">
                    <FileText size={14} className="prof-materialet-icon" />
                    {m.name}
                  </div>
                </td>
                <td className="prof-materialet-th">
                  <span className="prof-materialet-badge" style={{ backgroundColor: `${TYPE_COLORS[m.type]}20`, color: TYPE_COLORS[m.type] }}>
                    {m.type}
                  </span>
                </td>
                <td className="prof-materialet-cell-2">{m.date}</td>
                <td className="prof-materialet-cell-2">{m.size}</td>
                <td className="prof-materialet-cell-3">{m.downloads}</td>
                <td className="prof-materialet-th">
                  <div className="prof-materialet-row-6">
                    <button className="prof-materialet-btn-5"><Download size={14} className="prof-materialet-icon-2" /></button>
                    <button className="prof-materialet-btn-5"><Edit3 size={14} className="prof-materialet-icon" /></button>
                    <button onClick={() => setDeleteId(m.id)} className="prof-materialet-btn-6"><Trash2 size={14} className="prof-materialet-icon-3" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="prof-materialet-cell-4">Nuk ka materiale të ngarkuara</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {uploadOpen && (
        <div className="prof-materialet-overlay" onClick={() => setUploadOpen(false)}>
          <div className="prof-materialet-card" onClick={(e) => e.stopPropagation()}>
            <div className="prof-materialet-row-7">
              <h3 className="prof-materialet-heading">Ngarko Material të Ri</h3>
              <button onClick={() => setUploadOpen(false)}><X size={18} className="prof-materialet-icon" /></button>
            </div>
            <div className="prof-materialet-box-2">
              <div>
                <label className="prof-materialet-label">Emri i materialit</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="prof-materialet-input" placeholder="p.sh. Ligjërata 5 - Protokollet" />
              </div>
              <div>
                <label className="prof-materialet-label">Lloji</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="prof-materialet-input">
                  {Object.keys(TYPE_COLORS).map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="prof-materialet-label">Lënda</label>
                <input value={courseName} disabled className="prof-materialet-input-2" />
              </div>
              <div className="prof-materialet-box-3">
                <Upload size={20} className="prof-materialet-icon-4" />
                <p className="prof-materialet-text-2">Tërhiq ose kliko për të zgjedhur</p>
                <p className="prof-materialet-text-3">PDF, DOCX, PPTX, ZIP · max 50MB</p>
              </div>
            </div>
            <div className="prof-materialet-row-8">
              <button onClick={() => setUploadOpen(false)} className="prof-materialet-btn-7">Anulo</button>
              <button onClick={upload} className="prof-materialet-btn-8">Ngarko</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="prof-materialet-overlay" onClick={() => setDeleteId(null)}>
          <div className="prof-materialet-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="prof-materialet-heading-2">Fshi materialin</h3>
            <p className="prof-materialet-text-4">Ky material do të hiqet edhe nga faqja e studentëve. Jeni të sigurt?</p>
            <div className="prof-materialet-row-9">
              <button onClick={() => setDeleteId(null)} className="prof-materialet-btn-7">Anulo</button>
              <button onClick={remove} className="prof-materialet-btn-9">Fshi</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="prof-materialet-card-2">
          <CheckCircle2 size={18} />
          <span className="prof-materialet-text-5">{toast}</span>
        </div>
      )}
    </div>
  );
}

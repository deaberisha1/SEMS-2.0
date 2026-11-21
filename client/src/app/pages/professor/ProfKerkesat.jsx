import { useState, useEffect } from "react";
import { Search, FileText, CheckCircle2, X, Paperclip } from "lucide-react";
import { PROF_REQUESTS, PROF_COURSES } from "../../data/professor";
import { api } from "../../../api";
import "./ProfKerkesat.css";

const TYPES = ["Të gjitha", "Rivlerësim", "Konsultime", "Ankesa"];

export function ProfKerkesat() {
  const [filter, setFilter] = useState("Të gjitha");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("Të gjitha");
  const [requests, setRequests] = useState(PROF_REQUESTS);

  useEffect(() => {
    api.get("/professor/requests").then((data) => {
      setRequests(data);
      PROF_REQUESTS.splice(0, PROF_REQUESTS.length, ...data);
    }).catch(() => {});
  }, []);

  const [decisionFor, setDecisionFor] = useState(null);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  const counts = {
    "Të gjitha": requests.length,
    Rivlerësim: requests.filter((r) => r.type === "Rivlerësim").length,
    Konsultime: requests.filter((r) => r.type === "Konsultime").length,
    Ankesa: requests.filter((r) => r.type === "Ankesa").length,
  };

  const filtered = requests.filter((r) => {
    if (filter !== "Të gjitha" && r.type !== filter) return false;
    if (courseFilter !== "Të gjitha" && r.course !== courseFilter) return false;
    if (search && !r.studentName?.toLowerCase().includes(search.toLowerCase()) && !(r.course || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusBadge = (s) => {
    if (s === "Aprovuar") return "prof-kerkesat-status-badge";
    if (s === "Refuzuar") return "prof-kerkesat-status-badge-2";
    return "prof-kerkesat-status-badge-3";
  };

  const decide = async () => {
    if (!decisionFor) return;
    const status = decisionFor.type === "approve" ? "Aprovuar" : "Refuzuar";
    try {
      await api.patch(`/professor/requests/${decisionFor.id}`, { status, note });
    } catch (err) {
      setToast(err.message);
      return;
    }
    const updated = (prev) => prev.map((r) => (r.id === decisionFor.id ? { ...r, status: decisionFor.type === "approve" ? "Aprovuar" : "Refuzuar" } : r));
    setRequests(updated);
    PROF_REQUESTS.splice(0, PROF_REQUESTS.length, ...updated(PROF_REQUESTS));
    setToast(decisionFor.type === "approve" ? "Kërkesa u aprovua." : "Kërkesa u refuzua.");
    setDecisionFor(null);
    setNote("");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="prof-kerkesat-box">
      <div>
        <h1 className="prof-kerkesat-title">Kërkesat e Studentëve</h1>
        <p className="prof-kerkesat-text">Menaxhoni të gjitha kërkesat e studentëve tuaj</p>
      </div>

      <div className="prof-kerkesat-row">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`prof-kerkesat-btn ${
            filter === t ? "prof-kerkesat-btn-2" : "prof-kerkesat-btn-3"
          }`}>
            {t}
            <span className={`prof-kerkesat-badge ${filter === t ? "prof-kerkesat-text-2" : "prof-kerkesat-text-3"}`}>{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="prof-kerkesat-row-2">
        <div className="prof-kerkesat-card">
          <Search size={14} className="prof-kerkesat-icon" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kërko..." className="prof-kerkesat-input" />
        </div>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="prof-kerkesat-select">
          <option>Të gjitha</option>
          {PROF_COURSES.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="prof-kerkesat-box-2">
        {filtered.map((r) => (
          <div key={r.id} className="prof-kerkesat-card-2">
            <div className="prof-kerkesat-row-3">
              <div>
                <div className="prof-kerkesat-row-2">
                  <h3 className="prof-kerkesat-heading">{r.studentName}</h3>
                  <span className="prof-kerkesat-text-4">{r.studentId}</span>
                  <span className={`prof-kerkesat-badge-2 ${statusBadge(r.status)}`}>{r.status}</span>
                  <span className="prof-kerkesat-badge-3">{r.type}</span>
                </div>
                <p className="prof-kerkesat-text-5">{r.course} · {r.date}</p>
              </div>
            </div>
            <div className="prof-kerkesat-card-3">
              <div className="prof-kerkesat-text-6">Arsyeja</div>
              <p className="prof-kerkesat-text-7">{r.reason}</p>
              {r.detail && <p className="prof-kerkesat-text-8">{r.detail}</p>}
              {r.slot && (
                <div className="prof-kerkesat-text-9">📅 {r.slot}</div>
              )}
              {r.type === "Rivlerësim" && (
                <div className="prof-kerkesat-row-4">
                  <Paperclip size={12} /> <a href="#" className="prof-kerkesat-link">dokumenti.pdf</a>
                </div>
              )}
            </div>
            {r.status === "Në pritje" && (
              <div className="prof-kerkesat-row">
                <button onClick={() => setDecisionFor({ id: r.id, type: "approve" })} className="prof-kerkesat-btn-4">
                  {r.type === "Konsultime" ? "Prano" : "Aprovo"}
                </button>
                {r.type === "Konsultime" && (
                  <button className="prof-kerkesat-btn-5">
                    Propozo orë tjetër
                  </button>
                )}
                <button onClick={() => setDecisionFor({ id: r.id, type: "reject" })} className="prof-kerkesat-btn-6">
                  Refuzo
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="prof-kerkesat-box-3">
            <FileText size={24} className="prof-kerkesat-icon-2" />
            Nuk ka kërkesa
          </div>
        )}
      </div>

      {decisionFor && (
        <div className="prof-kerkesat-overlay" onClick={() => setDecisionFor(null)}>
          <div className="prof-kerkesat-card-4" onClick={(e) => e.stopPropagation()}>
            <div className="prof-kerkesat-row-5">
              <h3 className="prof-kerkesat-heading-2">
                {decisionFor.type === "approve" ? "Aprovo kërkesën" : "Refuzo kërkesën"}
              </h3>
              <button onClick={() => setDecisionFor(null)}><X size={18} className="prof-kerkesat-icon" /></button>
            </div>
            <label className="prof-kerkesat-label">Shënim për studentin (opsional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="prof-kerkesat-textarea" placeholder="Shkruani një shënim..." />
            <div className="prof-kerkesat-row-6">
              <button onClick={() => setDecisionFor(null)} className="prof-kerkesat-btn-7">Anulo</button>
              <button onClick={decide} className={`prof-kerkesat-btn-8 ${decisionFor.type === "approve" ? "prof-kerkesat-btn-9" : "prof-kerkesat-btn-10"}`}>
                {decisionFor.type === "approve" ? "Aprovo" : "Refuzo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="prof-kerkesat-card-5">
          <CheckCircle2 size={18} />
          <span className="prof-kerkesat-text-10">{toast}</span>
        </div>
      )}
    </div>
  );
}

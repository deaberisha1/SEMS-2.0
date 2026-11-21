import { useState } from "react";
import { Clock, MapPin, Edit2, Check, X, CalendarClock, User } from "lucide-react";
import { PROFESSOR } from "../../data/professor";
import "./ProfKonsultime.css";

const initialSlots = [
  { id: "s1", student: "Mira Hyseni", course: "UX/UI Design", date: "25.05.2026", time: "10:30", reason: "Diskutim për projektin final", status: "Në pritje" },
  { id: "s2", student: "Jonida Bajrami", course: "UX/UI Design", date: "25.05.2026", time: "11:00", reason: "Pyetje për kolokfiumin", status: "Konfirmuar" },
  { id: "s3", student: "Drilon Hoxha", course: "Rrjeta Kompjuterike dhe WWW", date: "26.05.2026", time: "10:00", reason: "Sqarime për detyrën", status: "Në pritje" },
  { id: "s4", student: "Olta Demaj", course: "Programimi në Web", date: "26.05.2026", time: "11:30", reason: "Diskutim për notën", status: "Konfirmuar" },
];

const weekDays = ["E hënë", "E martë", "E mërkurë", "E enjte", "E premte"];

export function ProfKonsultime() {
  const [hours, setHours] = useState(PROFESSOR.consultations);
  const [office, setOffice] = useState(PROFESSOR.office);
  const [editingHours, setEditingHours] = useState(false);
  const [draftHours, setDraftHours] = useState(hours);
  const [draftOffice, setDraftOffice] = useState(office);
  const [slots, setSlots] = useState(initialSlots);
  const [proposing, setProposing] = useState(null);
  const [proposalTime, setProposalTime] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  const saveHours = () => {
    setHours(draftHours);
    setOffice(draftOffice);
    setEditingHours(false);
    showToast("Orari i konsultimeve u përditësua.");
  };

  const accept = (id) => {
    setSlots((s) => s.map((x) => (x.id === id ? { ...x, status: "Konfirmuar" } : x)));
    showToast("Takimi u pranua.");
  };
  const refuse = (id) => {
    setSlots((s) => s.map((x) => (x.id === id ? { ...x, status: "Refuzuar" } : x)));
    showToast("Takimi u refuzua.");
  };
  const propose = (id) => {
    if (!proposalTime) return;
    setSlots((s) => s.map((x) => (x.id === id ? { ...x, time: proposalTime, status: "Në pritje" } : x)));
    setProposing(null);
    setProposalTime("");
    showToast("Propozimi u dërgua te studenti.");
  };
  const cancel = (id) => {
    setSlots((s) => s.filter((x) => x.id !== id));
    showToast("Takimi u anulua.");
  };

  const confirmed = slots.filter((s) => s.status === "Konfirmuar");
  const pending = slots.filter((s) => s.status === "Në pritje");

  const statusBadge = (s) => {
    if (s === "Konfirmuar") return "prof-konsultime-status-badge";
    if (s === "Refuzuar") return "prof-konsultime-status-badge-2";
    return "prof-konsultime-status-badge-3";
  };

  return (
    <div className="prof-konsultime-box">
      <div>
        <h1 className="prof-konsultime-title">Konsultime</h1>
        <p className="prof-konsultime-text">Menaxho orarin dhe kërkesat për takim me studentët</p>
      </div>

      <div className="prof-konsultime-card">
        <div className="prof-konsultime-row">
          <div className="prof-konsultime-row-2">
            <div className="prof-konsultime-icon-box">
              <CalendarClock size={18} className="prof-konsultime-icon" />
            </div>
            <div>
              <div className="prof-konsultime-text-2">Orari aktual i konsultimeve</div>
              {!editingHours ? (
                <div className="prof-konsultime-row-3">
                  <Clock size={14} className="prof-konsultime-icon-2" />
                  {hours}
                  <span className="prof-konsultime-icon-2">·</span>
                  <MapPin size={14} className="prof-konsultime-icon-2" />
                  {office}
                </div>
              ) : (
                <div className="prof-konsultime-row-4">
                  <input
                    value={draftHours}
                    onChange={(e) => setDraftHours(e.target.value)}
                    className="prof-konsultime-input"
                  />
                  <input
                    value={draftOffice}
                    onChange={(e) => setDraftOffice(e.target.value)}
                    className="prof-konsultime-input-2"
                  />
                </div>
              )}
            </div>
          </div>
          {!editingHours ? (
            <button
              onClick={() => { setDraftHours(hours); setDraftOffice(office); setEditingHours(true); }}
              className="prof-konsultime-btn"
            >
              <Edit2 size={12} /> Ndrysho orarin
            </button>
          ) : (
            <div className="prof-konsultime-row-5">
              <button onClick={() => setEditingHours(false)} className="prof-konsultime-btn-2">Anulo</button>
              <button onClick={saveHours} className="prof-konsultime-btn-3">Ruaj</button>
            </div>
          )}
        </div>
      </div>

      <div className="prof-konsultime-card">
        <h3 className="prof-konsultime-heading">Kalendari Javor</h3>
        <div className="prof-konsultime-grid">
          {weekDays.map((d, i) => {
            const dayDate = `${25 + i}.05.2026`;
            const dayAppts = confirmed.filter((s) => s.date === dayDate);
            return (
              <div key={d} className="prof-konsultime-card-2">
                <div className="prof-konsultime-text-3">{d}</div>
                <div className="prof-konsultime-text-4">{dayDate.slice(0, 5)}</div>
                <div className="prof-konsultime-box-2">
                  {dayAppts.length === 0 ? (
                    <div className="prof-konsultime-text-5">—</div>
                  ) : (
                    dayAppts.map((a) => (
                      <div key={a.id} className="prof-konsultime-card-3">
                        {a.time} · {a.student.split(" ")[0]}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="prof-konsultime-card">
        <h3 className="prof-konsultime-heading">Kërkesat e Reja ({pending.length})</h3>
        {pending.length === 0 ? (
          <div className="prof-konsultime-box-3">Nuk ka kërkesa në pritje.</div>
        ) : (
          <div className="prof-konsultime-box-4">
            {pending.map((s) => (
              <div key={s.id} className="prof-konsultime-card-4">
                <div className="prof-konsultime-row-6">
                  <div className="prof-konsultime-avatar">
                    <User size={14} />
                  </div>
                  <div className="prof-konsultime-box-5">
                    <div className="prof-konsultime-text-6">{s.student}</div>
                    <div className="prof-konsultime-text-7">{s.course} · {s.date} · {s.time}</div>
                    <div className="prof-konsultime-text-8">"{s.reason}"</div>
                  </div>
                  <span className={`prof-konsultime-badge ${statusBadge(s.status)}`}>{s.status}</span>
                </div>
                {proposing === s.id ? (
                  <div className="prof-konsultime-row-7">
                    <input
                      type="time"
                      value={proposalTime}
                      onChange={(e) => setProposalTime(e.target.value)}
                      className="prof-konsultime-input-3"
                    />
                    <button onClick={() => propose(s.id)} className="prof-konsultime-btn-3">Dërgo</button>
                    <button onClick={() => setProposing(null)} className="prof-konsultime-btn-4">Anulo</button>
                  </div>
                ) : (
                  <div className="prof-konsultime-row-8">
                    <button onClick={() => accept(s.id)} className="prof-konsultime-btn-5">
                      <Check size={12} /> Prano
                    </button>
                    <button onClick={() => setProposing(s.id)} className="prof-konsultime-btn-6">
                      Propozo orë tjetër
                    </button>
                    <button onClick={() => refuse(s.id)} className="prof-konsultime-btn-7">
                      <X size={12} /> Refuzo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="prof-konsultime-card">
        <h3 className="prof-konsultime-heading">Takimet e Konfirmuara ({confirmed.length})</h3>
        {confirmed.length === 0 ? (
          <div className="prof-konsultime-box-3">Nuk ka takime të konfirmuara.</div>
        ) : (
          <div className="prof-konsultime-box-4">
            {confirmed.map((s) => (
              <div key={s.id} className="prof-konsultime-card-5">
                <div className="prof-konsultime-avatar-2">
                  {s.student.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </div>
                <div className="prof-konsultime-box-5">
                  <div className="prof-konsultime-text-6">{s.student}</div>
                  <div className="prof-konsultime-text-7">{s.course} · {s.date} · {s.time}</div>
                </div>
                <button onClick={() => cancel(s.id)} className="prof-konsultime-btn-8">
                  Anulo takimin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="prof-konsultime-card-6">
          <Check size={18} />
          <span className="prof-konsultime-text-9">{toast}</span>
        </div>
      )}
    </div>
  );
}

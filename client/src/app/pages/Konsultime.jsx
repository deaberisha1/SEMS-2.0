import { useState } from "react";
import { Calendar, Clock, MapPin, User, CalendarRange, X, CheckCircle2, XCircle } from "lucide-react";
import { SmartSearch } from "../components/SmartSearch";
import { consultationProfessors as professors, bookedSlots, consultations as myConsultations } from "../data/student";
import { api } from "../../api";
import "./Konsultime.css";

const statusCfg = {
  "Në pritje": {
    cls: "konsultime-variant",
    icon: <Clock size={12} />,
  },
  Aprovuar: {
    cls: "konsultime-variant-2",
    icon: <CheckCircle2 size={12} />,
  },
  Refuzuar: {
    cls: "konsultime-variant-3",
    icon: <XCircle size={12} />,
  },
};

export function Konsultime() {
  const [query, setQuery] = useState("");
  const [activeProf, setActiveProf] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [arsyeja, setArsyeja] = useState("");
  const [toast, setToast] = useState(null);

  const [myRequests, setMyRequests] = useState(myConsultations);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? professors.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q)
      )
    : professors;

  const canSubmit = selectedSlot !== "" && selectedDate !== "" && arsyeja.trim().length > 5;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit() {
    if (!activeProf || !canSubmit) return;
    let newReq;
    try {
      // save the booking on the server
      newReq = await api.post("/student/consultations", {
        prof: activeProf.name,
        subject: activeProf.subject,
        date: selectedDate,
        slot: selectedSlot,
        room: activeProf.room,
        reason: arsyeja,
      });
    } catch (err) {
      showToast(err.message);
      return;
    }
    setMyRequests((prev) => [newReq, ...prev]);
    myConsultations.unshift(newReq);
    setActiveProf(null);
    setSelectedSlot("");
    setSelectedDate("");
    setArsyeja("");
    showToast("Kërkesa për konsultim u dërgua. Do të njoftoheni kur profesori të përgjigjet.");
  }

  async function cancelRequest(id) {
    try {
      await api.delete(`/student/consultations/${id}`);
    } catch (err) {
      showToast(err.message);
      return;
    }
    setMyRequests((prev) => prev.filter((r) => r.id !== id));
    const idx = myConsultations.findIndex((r) => r.id === id);
    if (idx !== -1) myConsultations.splice(idx, 1);
  }

  return (
    <div className="konsultime-box">
      {/* Toast */}
      {toast && (
        <div className="konsultime-card">
          <CheckCircle2 size={18} className="konsultime-icon" />
          <span className="konsultime-text">{toast}</span>
          <button onClick={() => setToast(null)} className="konsultime-btn"><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="konsultime-stack">
        <div>
          <h1 className="konsultime-title">
            Konsultime
          </h1>
          <p className="konsultime-text-2">
            Orari i konsultimeve me profesorët
          </p>
        </div>
        <div className="konsultime-box-2">
          <SmartSearch
            value={query}
            onChange={setQuery}
            placeholder="Kërko profesorin..."
            headerLabel="Sugjerime"
            suggestions={[
              { label: "Prof. Bujar Fejzullahu", icon: User },
              { label: "Prof. Korab Rrmoku",     icon: User },
              { label: "Prof. Artan Berisha",    icon: User },
              { label: "Prof. Faton Berisha",    icon: User },
              { label: "Prof. Eliot Bytyçi",    icon: User },
              { label: "Sot",                    icon: CalendarRange },
              { label: "Kjo javë",              icon: CalendarRange },
            ]}
          />
        </div>
      </div>

      {/* Professor cards */}
      <div className="konsultime-grid">
        {filtered.map((prof) => (
          <div key={prof.name} className="konsultime-card-2">
            <div className="konsultime-avatar">
              {prof.name.split(" ").filter(n => n !== "Prof.").map(n => n[0]).join("").substring(0, 2)}
            </div>
            <h3 className="konsultime-heading">{prof.name}</h3>
            <p className="konsultime-text-3">{prof.subject}</p>

            <div className="konsultime-box-3">
              <div className="konsultime-row">
                <Clock size={16} className="konsultime-icon-2" />
                <span>{prof.time}</span>
              </div>
              <div className="konsultime-row">
                <MapPin size={16} className="konsultime-icon-2" />
                <span>{prof.room}</span>
              </div>
              <div className="konsultime-row">
                <Calendar size={16} className="konsultime-icon-2" />
                <span>Çdo javë</span>
              </div>
            </div>

            <button
              onClick={() => { setActiveProf(prof); setSelectedSlot(""); setSelectedDate(""); setArsyeja(""); }}
              className="konsultime-btn-2"
            >
              Rezervo
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="konsultime-box-4">
            Nuk u gjet asnjë profesor
          </div>
        )}
      </div>

      {/* My Requests */}
      <div className="konsultime-box-5">
        <div className="konsultime-box-6">
          <h2 className="konsultime-title-2">
            Kërkesat e Mia për Konsultim
          </h2>
        </div>
        {myRequests.length === 0 ? (
          <div className="konsultime-box-7">
            Nuk keni kërkesa aktive.
          </div>
        ) : (
          <div className="konsultime-box-8">
            {myRequests.map((req) => {
              const s = statusCfg[req.status];
              return (
                <div key={req.id} className="konsultime-stack-2">
                  <div className="konsultime-box-9">
                    <div className="konsultime-text-4">{req.prof}</div>
                    <div className="konsultime-text-5">
                      {req.subject} · {req.date} · {req.slot} · {req.room}
                    </div>
                  </div>
                  <div className="konsultime-row-2">
                    <span className={`konsultime-badge ${s.cls}`}>
                      {s.icon}
                      {req.status}
                    </span>
                    {req.status === "Në pritje" && (
                      <button
                        onClick={() => cancelRequest(req.id)}
                        className="konsultime-btn-3"
                      >
                        Anulo kërkesën
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {activeProf && (
        <div className="konsultime-overlay" onClick={() => setActiveProf(null)}>
          <div
            className="konsultime-card-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="konsultime-row-3">
              <div>
                <h2 className="konsultime-title-3">
                  Rezervo Konsultim
                </h2>
                <p className="konsultime-text-6">{activeProf.name}</p>
              </div>
              <button onClick={() => setActiveProf(null)} className="konsultime-btn-4">
                <X size={17} className="konsultime-icon-2" />
              </button>
            </div>

            <div className="konsultime-box-10">
              {/* Date */}
              <div>
                <label className="konsultime-label">
                  Data ({activeProf.dayOfWeek})
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="konsultime-input"
                />
              </div>

              {/* Time slots */}
              <div>
                <label className="konsultime-label-2">
                  Ora ({activeProf.time.split(",")[1]?.trim() ?? ""})
                </label>
                <div className="konsultime-row-4">
                  {activeProf.slots.map((slot) => {
                    const isBooked = bookedSlots[activeProf.name]?.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`konsultime-btn-5 ${
                          isBooked
                            ? "konsultime-btn-6"
                            : isSelected
                            ? "konsultime-btn-7"
                            : "konsultime-btn-8"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="konsultime-label">
                  Lënda
                </label>
                <div className="konsultime-card-4">
                  {activeProf.subject}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="konsultime-label">
                  Arsyeja e takimit <span className="konsultime-text-7">*</span>
                </label>
                <textarea
                  value={arsyeja}
                  onChange={(e) => { if (e.target.value.length <= 300) setArsyeja(e.target.value); }}
                  placeholder="Përshkruani shkurtimisht arsyen e takimit (p.sh. pyetje për detyrën, projektin, etc.)"
                  rows={3}
                  className="konsultime-textarea"
                />
                <p className="konsultime-text-8">{arsyeja.length}/300</p>
              </div>
            </div>

            <div className="konsultime-row-5">
              <button
                onClick={() => setActiveProf(null)}
                className="konsultime-btn-9"
              >
                Anulo
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="konsultime-btn-10"
              >
                Dërgo Kërkesën
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

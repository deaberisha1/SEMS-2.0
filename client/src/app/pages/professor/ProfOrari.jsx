import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, X, QrCode, Users } from "lucide-react";
import { PROF_SCHEDULE } from "../../data/professor";
import "./ProfOrari.css";

const DAYS_FULL = ["E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte"];
const DAYS_SHORT = ["Hën", "Mar", "Mër", "Enj", "Pre"];
const WEEK_DATES = [18, 19, 20, 21, 22];
const WEEK_MONTH = "Maj";
const WEEK_YEAR = "2026";

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function typeColor(type) {
  if (type === "Ligjëratë") return { bg: "prof-orari-bg", color: "prof-orari-color" };
  if (type === "Ushtrime") return { bg: "prof-orari-bg-2", color: "prof-orari-color-2" };
  return { bg: "prof-orari-bg-3", color: "prof-orari-color-3" };
}

function TypeBadge({ type, small = false }) {
  const s = typeColor(type);
  const sz = small ? "prof-orari-sz" : "prof-orari-sz-2";
  return <span className={`prof-orari-text ${sz} ${s.bg} ${s.color}`}>{type}</span>;
}

function DetailModal({ course, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const dayName = DAYS_FULL[course.day];
  const dayNum = WEEK_DATES[course.day];
  const accent = course.color;
  const s = typeColor(course.type);

  const rows = [
    { label: "Koha", value: `${course.start} – ${course.end}` },
    { label: "Lloji", value: <span className={`prof-orari-badge ${s.bg} ${s.color}`}>{course.type}</span> },
    { label: "Lënda", value: course.course },
    { label: "Viti/Grupi", value: course.group },
    { label: "Salla", value: course.room },
    { label: "Numri i studentëve", value: String(course.students) },
    { label: "Kohëzgjatja", value: "90 minuta" },
  ];

  return (
    <div
      className="prof-orari-overlay"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="prof-orari-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="prof-orari-row">
          <h2 className="prof-orari-title">Detajet e orës</h2>
          <button
            onClick={onClose}
            className="prof-orari-btn"
          >
            <X size={16} className="prof-orari-color" />
          </button>
        </div>
        <div className="prof-orari-stack">
          <div
            className="prof-orari-stack-2"
            style={{ backgroundColor: `${accent}15`, border: `1.5px solid ${accent}30` }}
          >
            <span className="prof-orari-text-2" style={{ color: accent }}>{dayName}</span>
            <span className="prof-orari-text-3" style={{ color: accent }}>{dayNum}</span>
            <span className="prof-orari-text-4">{WEEK_MONTH} {WEEK_YEAR}</span>
          </div>
          <div className="prof-orari-box-2">
            {rows.map((row) => (
              <div key={row.label} className="prof-orari-row-2">
                <span className="prof-orari-text-5">
                  {row.label}
                </span>
                <span className="prof-orari-text-6">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="prof-orari-row-3">
          <button className="prof-orari-btn-2">
            <QrCode size={16} /> Gjenero QR Code
          </button>
          <button className="prof-orari-btn-3">
            <Users size={16} /> Shiko Listën e Studentëve
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfOrari() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selected, setSelected] = useState(null);

  const todayIdx = 2; // Wed
  const SLOT_HEIGHT = 80;

  return (
    <div className="prof-orari-box-3">
      <div className="">
        {/* Header */}
        <div className="prof-orari-stack-3">
          <div>
            <h1 className="prof-orari-title-2">Orari Mësimor</h1>
            <p className="prof-orari-text-7">
              Semestri Pranveror 2025/26 • 4 lëndë
            </p>
          </div>
          <div className="prof-orari-card">
            <button className="prof-orari-btn-4">
              <ChevronLeft size={16} className="prof-orari-color" />
            </button>
            <span className="prof-orari-text-8">
              18–22 Maj 2026
            </span>
            <button className="prof-orari-btn-4">
              <ChevronRight size={16} className="prof-orari-color" />
            </button>
          </div>
        </div>

        {/* Mobile day selector */}
        <div className="prof-orari-row-4">
          {DAYS_SHORT.map((d, i) => {
            const isActive = (selectedDay === null && i === todayIdx) || selectedDay === i;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(selectedDay === i ? null : i)}
                className={`prof-orari-btn-5 ${
                  isActive
                    ? "prof-orari-btn-6"
                    : "prof-orari-btn-7"
                }`}
              >
                <span className="prof-orari-text-9">{d}</span>
                <span className="prof-orari-text-10">{WEEK_DATES[i]}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop grid */}
        <div className="prof-orari-box-4">
          <div className="prof-orari-grid" style={{ gridTemplateColumns: "64px repeat(5, 1fr)" }}>
            <div className="prof-orari-box-5" />
            {DAYS_FULL.map((d, i) => (
              <div
                key={d}
                className={`prof-orari-box-6 ${i < 4 ? "prof-orari-box-5" : ""} ${i === todayIdx ? "prof-orari-box-7" : ""}`}
              >
                <div className="prof-orari-text-11">
                  {d.split(" ")[1]}
                </div>
                <div className={`prof-orari-text-12 ${i === todayIdx ? "prof-orari-color-2" : "prof-orari-text-13"}`}>
                  {WEEK_DATES[i]}
                </div>
              </div>
            ))}
          </div>
          <div
            className="prof-orari-grid-2"
            style={{ gridTemplateColumns: "64px repeat(5, 1fr)", height: `${HOURS.length * SLOT_HEIGHT}px` }}
          >
            <div className="prof-orari-box-5">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="prof-orari-row-5"
                  style={{ height: `${SLOT_HEIGHT}px` }}
                >
                  <span className="prof-orari-text-14">{h}:00</span>
                </div>
              ))}
            </div>
            {DAYS_FULL.map((_, dayIdx) => (
              <div
                key={dayIdx}
                className={`prof-orari-box-8 ${dayIdx < 4 ? "prof-orari-box-5" : ""} ${dayIdx === todayIdx ? "prof-orari-box-9" : ""}`}
              >
                {HOURS.map((h) => (
                  <div key={h} className="prof-orari-box-10" style={{ height: `${SLOT_HEIGHT}px` }} />
                ))}
                {PROF_SCHEDULE.filter((c) => c.day === dayIdx).map((c) => {
                  const top = (parseTime(c.start) - HOURS[0]) * SLOT_HEIGHT + 4;
                  const height = (parseTime(c.end) - parseTime(c.start)) * SLOT_HEIGHT - 8;
                  return (
                    <div
                      key={c.id}
                      className="prof-orari-layer"
                      style={{ top: `${top}px`, height: `${height}px`, backgroundColor: `${c.color}20`, borderLeft: `3px solid ${c.color}` }}
                      onClick={() => setSelected(c)}
                    >
                      <div className="prof-orari-text-15" style={{ color: c.color }}>
                        {c.course}
                      </div>
                      {height > 50 && (
                        <>
                          <div className="prof-orari-text-16">
                            {c.group}
                          </div>
                          <div className="prof-orari-row-6">
                            <MapPin size={9} />
                            <span className="prof-orari-text-17">{c.room}</span>
                          </div>
                        </>
                      )}
                      <div className="prof-orari-text-18"><TypeBadge type={c.type} small /></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile list */}
        <div className="prof-orari-box-11">
          {PROF_SCHEDULE
            .filter((c) => (selectedDay !== null ? c.day === selectedDay : c.day === todayIdx))
            .sort((a, b) => parseTime(a.start) - parseTime(b.start))
            .map((c) => (
              <div
                key={c.id}
                className="prof-orari-card-2"
                onClick={() => setSelected(c)}
              >
                <div className="prof-orari-layer-2" style={{ backgroundColor: c.color }} />
                <div className="prof-orari-box-12">
                  <div className="prof-orari-text-19">{c.start}</div>
                  <div className="prof-orari-text-20">{c.end}</div>
                </div>
                <div className="prof-orari-box-13">
                  <div className="prof-orari-text-21">{c.course}</div>
                  <div className="prof-orari-row-7">
                    <div className="prof-orari-row-8">
                      <Users size={11} />
                      <span className="prof-orari-text-22">{c.group}</span>
                    </div>
                    <div className="prof-orari-row-8">
                      <MapPin size={11} />
                      <span className="prof-orari-text-22">{c.room}</span>
                    </div>
                    <TypeBadge type={c.type} small />
                  </div>
                </div>
              </div>
            ))}
          {PROF_SCHEDULE.filter((c) => (selectedDay !== null ? c.day === selectedDay : c.day === todayIdx)).length === 0 && (
            <div className="prof-orari-card-3">
              <Clock size={32} className="prof-orari-icon" />
              <p className="prof-orari-text-23">Asnjë orë sot</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="prof-orari-row-9">
          {(["Ligjëratë", "Ushtrime", "Laborator"]).map((t) => {
            const s = typeColor(t);
            return (
              <div key={t} className={`prof-orari-row-10 ${s.bg}`}>
                <span className={`prof-orari-text-24 ${s.color}`}>{t}</span>
              </div>
            );
          })}
          <span className="prof-orari-text-25">• Kliko çdo orë për detaje</span>
        </div>
      </div>

      {selected && <DetailModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

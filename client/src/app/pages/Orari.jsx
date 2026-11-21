import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, User, X, Calendar, BookOpen } from "lucide-react";
import { schedule as courses } from "../data/student";
import "./Orari.css";

const days = ["E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte"];
const daysShort = ["Hën", "Mar", "Mër", "Enj", "Pre"];

// Current week: 18–22 Maj 2026 (Java 21) — today is Wednesday 20 Maj
const WEEK_DATES = [18, 19, 20, 21, 22];
const WEEK_MONTH = "Maj";
const WEEK_YEAR = "2026";
const WEEK_NUM = 21;

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

function formatTime(h) {
  const hh = Math.floor(h);
  const mm = h % 1 === 0.5 ? "30" : "00";
  return `${hh.toString().padStart(2, "0")}:${mm}`;
}

function typeBadge(type, small = false) {
  const map = {
    ligjëratë: { bg: "orari-bg", color: "orari-color", label: "Ligjëratë" },
    ushtrime:  { bg: "orari-bg-2", color: "orari-color-2", label: "Ushtrime" },
    lab:       { bg: "orari-bg-3", color: "orari-color-3", label: "Laborator" },
  };
  const s = map[type];
  const sz = small ? "orari-sz" : "orari-sz-2";
  return (
    <span className={`orari-text ${sz} ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  );
}

function typeBadgeModal(type) {
  const map = {
    ligjëratë: { bg: "orari-bg", color: "orari-color", label: "Ligjëratë" },
    ushtrime:  { bg: "orari-bg-2", color: "orari-color-2", label: "Ushtrime" },
    lab:       { bg: "orari-bg-3", color: "orari-color-3", label: "Laborator" },
  };
  const s = map[type];
  return (
    <span className={`orari-badge ${s.bg} ${s.color}`}>
      {s.label}
    </span>
  );
}

function DetailModal({ course, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const dayName = days[course.day];
  const dayNum = WEEK_DATES[course.day];
  const accentColor = course.color;
  const accentDark = course.darkColor || course.color;

  const rows = [
    { label: "Koha",            value: `${formatTime(course.startHour)} – ${formatTime(course.endHour)}` },
    { label: "Lloji",           value: typeBadgeModal(course.type) },
    { label: "Lënda",           value: course.subject },
    { label: "Kodi i lëndës",   value: course.kodi },
    { label: "Profesori",       value: course.professor },
    { label: "Asistenti",       value: course.ta },
    { label: "Salla",           value: course.room },
    { label: "Kohëzgjatja",     value: "90 minuta" },
  ];

  return (
    <div
      className="orari-overlay"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="orari-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="orari-row">
          <h2 className="orari-title">
            Detajet e orës
          </h2>
          <button
            onClick={onClose}
            className="orari-btn"
          >
            <X size={16} className="orari-color" />
          </button>
        </div>

        {/* Body */}
        <div className="orari-stack">
          {/* Left — Date card */}
          <div
            className="orari-stack-2"
            style={{ backgroundColor: `${accentColor}15`, border: `1.5px solid ${accentColor}30` }}
          >
            <span className="orari-text-2" style={{ color: accentColor }}>
              {dayName}
            </span>
            <span className="orari-text-3" style={{ color: accentColor }}>
              {dayNum}
            </span>
            <span className="orari-text-4">
              {WEEK_MONTH} {WEEK_YEAR}
            </span>
            <span className="orari-badge-2">
              Java {WEEK_NUM}
            </span>
          </div>
          <div
            className="orari-box-2"
            style={{ backgroundColor: `${accentDark}20`, border: `1.5px solid ${accentDark}40` }}
          >
            <span className="orari-text-2" style={{ color: accentDark }}>
              {dayName}
            </span>
            <span className="orari-text-3" style={{ color: accentDark }}>
              {dayNum}
            </span>
            <span className="orari-text-5">
              {WEEK_MONTH} {WEEK_YEAR}
            </span>
            <span className="orari-badge-3">
              Java {WEEK_NUM}
            </span>
          </div>

          {/* Right — Details */}
          <div className="orari-box-3">
            {rows.map((row) => (
              <div key={row.label} className="orari-row-2">
                <span className="orari-text-6">
                  {row.label}
                </span>
                <span className="orari-text-7">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="orari-row-3">
          <button className="orari-btn-2">
            <BookOpen size={16} />
            Shiko materialet
          </button>
          <button className="orari-btn-3">
            <Calendar size={16} />
            Shto në kalendar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Orari() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Today is Wednesday = index 2 in Mon-Fri
  const todayIdx = 2;

  const SLOT_HEIGHT = 80;

  return (
    <div className="orari-box-4">
      <div className="">
        {/* Header */}
        <div className="orari-stack-3">
          <div>
            <h1 className="orari-title-2">
              Orari
            </h1>
            <p className="orari-text-8">
              Semestri Pranveror 2025/26 • 21 Feb – 30 Qer
            </p>
          </div>
          <div className="orari-card">
            <button className="orari-btn-4">
              <ChevronLeft size={16} className="orari-color" />
            </button>
            <span className="orari-text-9">
              18–22 Maj 2026
            </span>
            <button className="orari-btn-4">
              <ChevronRight size={16} className="orari-color" />
            </button>
          </div>
        </div>

        {/* Day selector (mobile) */}
        <div className="orari-row-4">
          {daysShort.map((d, i) => {
            const isActive = (selectedDay === null && i === todayIdx) || selectedDay === i;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(selectedDay === i ? null : i)}
                className={`orari-btn-5 ${
                  isActive
                    ? "orari-btn-6"
                    : "orari-btn-7"
                }`}
              >
                <span className="orari-text-10">{d}</span>
                <span className="orari-text-11">{WEEK_DATES[i]}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop grid */}
        <div className="orari-box-5">
          {/* Day headers */}
          <div
            className="orari-grid"
            style={{ gridTemplateColumns: "64px repeat(5, 1fr)" }}
          >
            <div className="orari-box-6" />
            {days.map((d, i) => (
              <div
                key={d}
                className={`orari-box-7 ${i < 4 ? "orari-box-6" : ""} ${i === todayIdx ? "orari-box-8" : "orari-box-9"}`}
              >
                <div className="orari-text-12">
                  {d.split(" ")[1]}
                </div>
                <div className={`orari-text-13 ${i === todayIdx ? "orari-color-2" : "orari-text-14"}`}>
                  {WEEK_DATES[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div
            className="orari-grid-2"
            style={{
              gridTemplateColumns: "64px repeat(5, 1fr)",
              height: `${hours.length * SLOT_HEIGHT}px`,
            }}
          >
            {/* Hour labels */}
            <div className="orari-box-6">
              {hours.map((h) => (
                <div
                  key={h}
                  className="orari-row-5"
                  style={{ height: `${SLOT_HEIGHT}px` }}
                >
                  <span className="orari-text-15">
                    {h}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((_, dayIdx) => (
              <div
                key={dayIdx}
                className={`orari-box-10 ${dayIdx < 4 ? "orari-box-6" : ""} ${dayIdx === todayIdx ? "orari-box-11" : "orari-box-9"}`}
              >
                {hours.map((h) => (
                  <div
                    key={h}
                    className="orari-box-12"
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  />
                ))}

                {courses
                  .filter((c) => c.day === dayIdx)
                  .map((course) => {
                    const top = (course.startHour - hours[0]) * SLOT_HEIGHT + 4;
                    const height = (course.endHour - course.startHour) * SLOT_HEIGHT - 8;
                    return (
                      <div
                        key={course.id}
                        className="hover-group orari-layer"
                        style={{ top: `${top}px`, height: `${height}px` }}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className="orari-layer-2" style={{ backgroundColor: course.bg, borderLeft: `3px solid ${course.color}` }} />
                        <div className="orari-layer-3" style={{ backgroundColor: course.darkBg || course.bg, borderLeft: `3px solid ${course.darkColor || course.color}` }} />

                        <div className="orari-box-13">
                          <div className="orari-text-16" style={{ color: course.color }}>
                            {course.subject}
                          </div>
                          <div className="orari-box-14" style={{ color: course.darkColor || course.color }}>
                            {course.subject}
                          </div>
                          {height > 50 && (
                            <>
                              <div className="orari-text-17">
                                {course.professor.split(" ").slice(-1)[0]}
                              </div>
                              <div className="orari-row-6">
                                <MapPin size={9} />
                                <span className="orari-text-18">{course.room}</span>
                              </div>
                            </>
                          )}
                          <div className="orari-text-19">
                            {typeBadge(course.type, true)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile list view */}
        <div className="orari-box-15">
          {courses
            .filter((c) =>
              selectedDay !== null ? c.day === selectedDay : c.day === todayIdx
            )
            .sort((a, b) => a.startHour - b.startHour)
            .map((course) => (
              <div
                key={course.id}
                className="orari-card-2"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="orari-layer-4" style={{ backgroundColor: course.color }} />
                <div className="orari-layer-5" style={{ backgroundColor: course.darkColor || course.color }} />

                <div className="orari-box-16">
                  <div className="orari-text-20">
                    {formatTime(course.startHour)}
                  </div>
                  <div className="orari-text-21">
                    {formatTime(course.endHour)}
                  </div>
                </div>
                <div className="orari-box-17">
                  <div className="orari-text-22">
                    {course.subject}
                  </div>
                  <div className="orari-row-7">
                    <div className="orari-row-8">
                      <User size={11} />
                      <span className="orari-text-23">{course.professor}</span>
                    </div>
                    <div className="orari-row-8">
                      <MapPin size={11} />
                      <span className="orari-text-23">{course.room}</span>
                    </div>
                    {typeBadge(course.type, true)}
                  </div>
                </div>
              </div>
            ))}
          {courses.filter((c) =>
            selectedDay !== null ? c.day === selectedDay : c.day === todayIdx
          ).length === 0 && (
            <div className="orari-card-3">
              <Clock size={32} className="orari-icon" />
              <p className="orari-text-24">
                Asnjë orë sot
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="orari-row-9">
          {[
            { label: "Ligjëratë", color: "#3C3C43", darkColor: "#EBEBF5", bg: "#F2F2F7", darkBg: "#2C2C2E" },
            { label: "Ushtrime",  color: "#007AFF", darkColor: "#0A84FF", bg: "#EBF5FF", darkBg: "rgba(10, 132, 255, 0.2)" },
            { label: "Laborator", color: "#34C759", darkColor: "#32D74B", bg: "#EDFAF1", darkBg: "rgba(50, 215, 75, 0.2)" },
          ].map((l) => (
            <div key={l.label} className="orari-row-10">
              <div className="orari-box-18" style={{ backgroundColor: l.bg, border: `1px solid ${l.color}30` }} />
              <div className="orari-box-19" style={{ backgroundColor: l.darkBg, border: `1px solid ${l.darkColor}30` }} />
              <span className="orari-text-25">{l.label}</span>
            </div>
          ))}
          <span className="orari-text-26">
            • Kliko çdo orë për detaje
          </span>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCourse && (
        <DetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}

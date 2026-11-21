import { useNavigate } from "react-router";
import { BookOpen, Users, Inbox, Calendar, QrCode, Upload, ClipboardCheck, ChevronRight } from "lucide-react";
import { PROF_COURSES, PROF_REQUESTS, getTodayClasses } from "../../data/professor";
import "./ProfDashboard.css";

export function ProfDashboard() {
  const navigate = useNavigate();
  const today = getTodayClasses();
  const totalStudents = PROF_COURSES.reduce((s, c) => s + c.students, 0);
  const pendingRequests = PROF_REQUESTS.filter((r) => r.status === "Në pritje").length;

  const stats = [
    { label: "Lëndë aktive", value: PROF_COURSES.length, icon: BookOpen, color: "#007AFF", bg: "prof-dashboard-bg" },
    { label: "Studentë gjithsej", value: totalStudents, icon: Users, color: "#34C759", bg: "prof-dashboard-bg-2" },
    { label: "Kërkesa në pritje", value: pendingRequests, icon: Inbox, color: "#FF9500", bg: "prof-dashboard-bg-3" },
    { label: "Ligjërata sot", value: today.length, icon: Calendar, color: "#AF52DE", bg: "prof-dashboard-bg-4" },
  ];

  const quickActions = [
    { label: "Gjenero QR Code", icon: QrCode, path: "/prof/vijueshmeria", color: "#007AFF" },
    { label: "Ngarko Material", icon: Upload, path: "/prof/materialet", color: "#34C759" },
    { label: "Vlerëso Studentët", icon: ClipboardCheck, path: "/prof/vleresimi", color: "#FF9500" },
    { label: "Shiko Kërkesat", icon: Inbox, path: "/prof/kerkesat", color: "#AF52DE" },
    { label: "Orari", icon: Calendar, path: "/orari", color: "#FF2D55" },
    { label: "Studentët", icon: Users, path: "/prof/studentet", color: "#5856D6" },
  ];

  const today_date = new Date().toLocaleDateString("sq", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const badgeFor = (status) => {
    if (status === "Aprovuar") return "prof-dashboard-badge-for";
    if (status === "Refuzuar") return "prof-dashboard-badge-for-2";
    return "prof-dashboard-badge-for-3";
  };

  return (
    <div className="prof-dashboard-box">
      <div>
        <h1 className="prof-dashboard-title">
          Mirë se erdhe, Prof. Rrmoku 👋
        </h1>
        <p className="prof-dashboard-text">
          {today_date} · Semestri 2 (2025/26)
        </p>
      </div>

      <div className="prof-dashboard-grid">
        {stats.map((s) => (
          <div key={s.label} className="prof-dashboard-card">
            <div className={`prof-dashboard-icon-box ${s.bg}`}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div className="prof-dashboard-text-2">{s.value}</div>
            <div className="prof-dashboard-text-3">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="prof-dashboard-title-2">Veprime të Shpejta</h2>
        <div className="prof-dashboard-grid-2">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="prof-dashboard-btn"
            >
              <div className="prof-dashboard-icon-box-2" style={{ backgroundColor: `${a.color}1a` }}>
                <a.icon size={20} style={{ color: a.color }} />
              </div>
              <div className="prof-dashboard-text-4">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="prof-dashboard-grid-3">
        <div className="prof-dashboard-card-2">
          <div className="prof-dashboard-row">
            <h3 className="prof-dashboard-heading">Ligjëratat e Sotme</h3>
            <button onClick={() => navigate("/orari")} className="prof-dashboard-btn-2">
              Shiko të gjitha
            </button>
          </div>
          {today.length === 0 ? (
            <div className="prof-dashboard-box-2">
              Nuk ka ligjërata sot 🎉
            </div>
          ) : (
            <div className="prof-dashboard-box-3">
              {today.map((c) => (
                <div key={c.id} className="prof-dashboard-card-3">
                  <div className="prof-dashboard-box-4" style={{ backgroundColor: c.color }} />
                  <div className="prof-dashboard-box-5">
                    <div className="prof-dashboard-text-5">{c.course}</div>
                    <div className="prof-dashboard-text-6">
                      {c.start}–{c.end} · {c.room}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/prof/vijueshmeria")}
                    className="prof-dashboard-btn-3"
                  >
                    <QrCode size={12} /> QR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="prof-dashboard-card-2">
          <div className="prof-dashboard-row">
            <h3 className="prof-dashboard-heading">Kërkesat e Fundit</h3>
            <button onClick={() => navigate("/prof/kerkesat")} className="prof-dashboard-btn-2">
              Shiko të gjitha
            </button>
          </div>
          <div className="prof-dashboard-box-3">
            {PROF_REQUESTS.slice(0, 3).map((r) => (
              <div key={r.id} className="prof-dashboard-card-3">
                <div className="prof-dashboard-box-5">
                  <div className="prof-dashboard-text-7">{r.studentName}</div>
                  <div className="prof-dashboard-text-8">{r.type} · {r.course}</div>
                </div>
                <span className={`prof-dashboard-badge ${badgeFor(r.status)}`}>{r.status}</span>
                <ChevronRight size={14} className="prof-dashboard-icon" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Award, FileText, Scan, GraduationCap, Bell, X, ChevronRight, TrendingUp, CheckCircle, AlertCircle, Info, CreditCard, MessageCircle, CheckCircle2 } from "lucide-react";
import { upcomingExams, recentGrades, notifications as mockNotifications } from "../data/student";
import "./Dashboard.css";

const quickActions = [
  {
    icon: Award,
    label: "Notat & Rezultatet",
    subtitle: "Shiko transkriptën",
    path: "/transkripta",
    color: "dashboard-color",
    bg: "dashboard-bg",
  },
  {
    icon: CreditCard,
    label: "Pagesat",
    subtitle: "Paguaj semestrin/kartelën",
    path: "/pagesat",
    color: "dashboard-color-2",
    bg: "dashboard-bg-2",
  },
  {
    icon: MessageCircle,
    label: "Konsultime",
    subtitle: "Rezervo orar me profesorët",
    path: "/konsultime",
    color: "dashboard-color-3",
    bg: "dashboard-bg-3",
  },
  {
    icon: Calendar,
    label: "Orari",
    subtitle: "Shiko orarin javor",
    path: "/orari",
    color: "dashboard-color-4",
    bg: "dashboard-bg-4",
  },
  {
    icon: FileText,
    label: "Materialet",
    subtitle: "Syllabuset e lëndëve",
    path: "/tjera/literatura",
    color: "dashboard-color-5",
    bg: "dashboard-bg-5",
  },
  {
    icon: Scan,
    label: "Scan QR Code",
    subtitle: "Skanoni kodin QR",
    path: "/tjera/scan-qr",
    color: "dashboard-color-6",
    bg: "dashboard-bg-6",
  },
];

export function Dashboard() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [lang, setLang] = useState("SQ");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const today = new Date().toLocaleDateString("sq-AL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard-box">
      <div className="">

        {/* Top bar: Banner (left 60%) + 3 icon buttons (right) */}
        {bannerVisible && (
          <div className="dashboard-row">
            {/* Shrunken banner ~60% */}
            <div className="dashboard-card">
              <AlertCircle size={16} className="dashboard-icon" />
              <div className="dashboard-box-2">
                <span className="dashboard-text">
                  Afati i regjistrimit të provimeve mbyllet më 30 Mars 2026.
                </span>
                <span className="dashboard-text-2">
                  Regjistro provimin tënd përpara se afati të skadojë.
                </span>
              </div>
              <button
                onClick={() => setBannerVisible(false)}
                className="dashboard-btn"
              >
                <X size={13} className="dashboard-color-4" />
              </button>
            </div>

            {/* Right side: 3 circular icon buttons */}
            <div className="dashboard-row-2">
              {/* Language toggle */}
              <button
                onClick={() => setLang((l) => (l === "SQ" ? "EN" : "SQ"))}
                className="dashboard-btn-2"
                title={lang === "SQ" ? "Switch to English" : "Kalo në Shqip"}
              >
                <span className="dashboard-text-3">{lang}</span>
              </button>

              {/* Notifications */}
              <div className="dashboard-box-3" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="dashboard-btn-3"
                  title="Njoftimet"
                >
                  <Bell size={18} className="dashboard-icon-2" />
                  {unreadCount > 0 && (
                    <span className="dashboard-dot" />
                  )}
                </button>

                {notifOpen && (
                  <div className="dashboard-popup">
                    <div className="dashboard-row-3">
                      <span className="dashboard-text-4">Njoftimet</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="dashboard-btn-4">
                          Shëno të gjitha si lexuar
                        </button>
                      )}
                    </div>
                    <div className="dashboard-scroll">
                      {notifications.map((n) => (
                        <div key={n.id} className={`dashboard-row-4 ${!n.read ? "dashboard-box-4" : ""}`}>
                          <div className={`dashboard-avatar ${!n.read ? "dashboard-box-5" : "dashboard-box-6"}`}>
                            {n.read ? <CheckCircle2 size={14} className="dashboard-icon-3" /> : <Bell size={14} className="dashboard-color-2" />}
                          </div>
                          <div className="dashboard-box-2">
                            <p className={`dashboard-text-5 ${!n.read ? "dashboard-text-6" : "dashboard-text-7"}`}>
                              {n.text}
                            </p>
                            <span className="dashboard-text-8">{n.time} më parë</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <button
                onClick={() => navigate("/profili")}
                className="dashboard-btn-5"
                title="Profili Im"
              >
                <span className="dashboard-text-9">AB</span>
              </button>
            </div>
          </div>
        )}

        {/* If banner dismissed, still show icon buttons */}
        {!bannerVisible && (
          <div className="dashboard-row-5">
            <button
              onClick={() => setLang((l) => (l === "SQ" ? "EN" : "SQ"))}
              className="dashboard-btn-2"
            >
              <span className="dashboard-text-3">{lang}</span>
            </button>
            <div className="dashboard-box-3" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="dashboard-btn-3"
              >
                <Bell size={18} className="dashboard-icon-2" />
                {unreadCount > 0 && (
                  <span className="dashboard-dot" />
                )}
              </button>
              {notifOpen && (
                <div className="dashboard-popup">
                  <div className="dashboard-row-3">
                    <span className="dashboard-text-4">Njoftimet</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="dashboard-btn-4">
                        Shëno të gjitha si lexuar
                      </button>
                    )}
                  </div>
                  <div className="dashboard-scroll">
                    {notifications.map((n) => (
                      <div key={n.id} className={`dashboard-row-4 ${!n.read ? "dashboard-box-4" : ""}`}>
                        <div className={`dashboard-avatar ${!n.read ? "dashboard-box-5" : "dashboard-box-6"}`}>
                          {n.read ? <CheckCircle2 size={14} className="dashboard-icon-3" /> : <Bell size={14} className="dashboard-color-2" />}
                        </div>
                        <div className="dashboard-box-2">
                          <p className={`dashboard-text-5 ${!n.read ? "dashboard-text-6" : "dashboard-text-7"}`}>
                            {n.text}
                          </p>
                          <span className="dashboard-text-8">{n.time} më parë</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/profili")}
              className="dashboard-btn-5"
            >
              <span className="dashboard-text-9">AB</span>
            </button>
          </div>
        )}

        {/* Welcome Header */}
        <div className="dashboard-text-10">
          <h1 className="dashboard-title">
            Mirë se erdhe, Arta 👋
          </h1>
          <p className="dashboard-text-11">
            {today} • Semestri Pranveror 2025/26
          </p>
        </div>

        {/* Stats Row */}
        <div className="dashboard-grid">
          {[
            { label: "Nota Mesatare", value: "8.75", icon: TrendingUp, color: "dashboard-color-2", bg: "dashboard-box-5", suffix: "/10" },
            { label: "ECTS Totale",   value: "90",   icon: GraduationCap, color: "dashboard-color", bg: "dashboard-bg-7", suffix: " kr." },
            { label: "Vijueshmëria", value: "92%",  icon: CheckCircle, color: "dashboard-color-3", bg: "dashboard-bg-8", suffix: "" },
            { label: "Provime Kaluar", value: "15", icon: Award, color: "dashboard-color-4", bg: "dashboard-bg-9", suffix: "/15" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="dashboard-card-2"
            >
              <div className="dashboard-row-6">
                <div className="dashboard-text-12">
                  {stat.label}
                </div>
                <div className={`dashboard-avatar-2 ${stat.bg}`}>
                  <stat.icon size={16} className={stat.color} />
                </div>
              </div>
              <div className="dashboard-text-13">
                {stat.value}
                <span className="dashboard-text-14">
                  {stat.suffix}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-text-10">
          <h2 className="dashboard-title-2">
            Veprimet e shpejta
          </h2>
          <div className="dashboard-grid-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="hover-group dashboard-btn-6"
              >
                <div className={`dashboard-icon-box ${action.bg}`}>
                  <action.icon size={20} className={action.color} />
                </div>
                <div className="dashboard-box-2">
                  <span className="dashboard-text-15">
                    {action.label}
                  </span>
                  <div className="dashboard-text-16">
                    {action.subtitle}
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className="dashboard-icon-4"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom two-col */}
        <div className="dashboard-grid-3">

          {/* Upcoming Exams */}
          <div className="dashboard-box-7">
            <div className="dashboard-row-7">
              <div className="dashboard-row-8">
                <Calendar size={16} className="dashboard-color-2" />
                <h3 className="dashboard-heading">
                  Provimet e Ardhshme
                </h3>
              </div>
              <button
                onClick={() => navigate("/orari")}
                className="dashboard-btn-7"
              >
                Shiko të gjitha
              </button>
            </div>
            <div className="dashboard-box-8">
              {upcomingExams.map((exam) => (
                <div key={exam.subject} className="dashboard-row-9">
                  <div className={`dashboard-icon-box-2 ${exam.daysLeft <= 5 ? "dashboard-bg-4" : "dashboard-box-6"}`}>
                    <span className={`dashboard-text-17 ${exam.daysLeft <= 5 ? "dashboard-color-4" : "dashboard-text-18"}`}>
                      {exam.daysLeft}
                    </span>
                    <span className="dashboard-text-19">ditë</span>
                  </div>
                  <div className="dashboard-box-2">
                    <div className="dashboard-text-20">
                      {exam.subject}
                    </div>
                    <div className="dashboard-row-10">
                      <div className="dashboard-row-11">
                        <Calendar size={11} className="dashboard-icon-5" />
                        <span className="dashboard-text-21">
                          {exam.date}, {exam.time}
                        </span>
                      </div>
                      <div className="dashboard-card-3">
                        {exam.room}
                      </div>
                    </div>
                  </div>
                  {exam.daysLeft <= 5 && (
                    <AlertCircle size={14} className="dashboard-icon-6" />
                  )}
                </div>
              ))}
            </div>
            {/* Paraqit Provimet button */}
            <div className="dashboard-box-9">
              <button
                onClick={() => navigate("/lendet/paraqit")}
                className="dashboard-btn-8"
              >
                Paraqit Provimet
              </button>
            </div>
          </div>

          {/* Recent Grades */}
          <div className="dashboard-box-7">
            <div className="dashboard-row-7">
              <div className="dashboard-row-8">
                <Award size={16} className="dashboard-color" />
                <h3 className="dashboard-heading">
                  Notat e Fundit
                </h3>
              </div>
              <button
                onClick={() => navigate("/transkripta")}
                className="dashboard-btn-7"
              >
                Shiko të gjitha
              </button>
            </div>
            <div className="dashboard-box-8">
              {recentGrades.map((grade) => {
                const isTen = grade.grade === 10;
                const isHigh = grade.grade >= 8;
                return (
                  <div key={grade.subject} className="dashboard-row-12">
                    <div className={`dashboard-icon-box-3 ${isTen ? "dashboard-box-10" : isHigh ? "dashboard-box-11" : "dashboard-box-12"}`}>
                      {grade.grade}
                    </div>
                    <div className="dashboard-box-2">
                      <div className="dashboard-text-22">
                        {grade.subject}
                      </div>
                      <div className="dashboard-text-21">
                        {grade.ects} ECTS
                      </div>
                    </div>
                    <div className="dashboard-card-4">
                      Kaluar
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="dashboard-box-9">
              <button
                onClick={() => navigate("/transkripta")}
                className="dashboard-btn-8"
              >
                Shiko Transkriptën
              </button>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="dashboard-grid-4">
          {[
            {
              icon: Info,
              color: "dashboard-color-3",
              bg: "dashboard-bg-3",
              title: "Semestri Pranveror",
              desc: "21 Feb – 30 Qershor 2026",
            },
            {
              icon: CheckCircle,
              color: "dashboard-color",
              bg: "dashboard-bg",
              title: "Vijueshmëria",
              desc: "92% — Mbi kufirin minimal",
            },
            {
              icon: GraduationCap,
              color: "dashboard-color-2",
              bg: "dashboard-bg-2",
              title: "FAQ & Ndihmë",
              desc: "Shiko pyetjet e shpeshta",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="dashboard-card-5"
            >
              <div className={`dashboard-icon-box-4 ${card.bg}`}>
                <card.icon size={16} className={card.color} />
              </div>
              <div>
                <div className="dashboard-text-23">
                  {card.title}
                </div>
                <div className="dashboard-text-24">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

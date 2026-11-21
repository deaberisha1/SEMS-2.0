import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Bell, ClipboardList, CalendarClock, AlertTriangle } from "lucide-react";
import "./ProfTopBar.css";

const initialNotifications = [
  {
    id: 1,
    type: "rivleresim",
    title: "Kërkesë e re rivlerësimi",
    desc: "Arta Berisha kërkoi rivlerësim për Rrjeta Kompjuterike dhe WWW",
    badge: "Në pritje",
    badgeColor: "prof-top-bar-badge-color",
    link: "/prof/kerkesat",
    read: false,
  },
  {
    id: 2,
    type: "konsultim",
    title: "Rezervim konsultimi",
    desc: "Mira Hyseni rezervoi konsultim për 25.05.2026, 10:30",
    badge: "Në pritje",
    badgeColor: "prof-top-bar-badge-color",
    link: "/prof/kerkesat",
    read: false,
  },
  {
    id: 3,
    type: "afat",
    title: "Afati i notave",
    desc: "Afati për publikimin e notave për UX/UI Design është 28.05.2026",
    badge: "Kujdes",
    badgeColor: "prof-top-bar-badge-color-2",
    link: "/prof/notat",
    read: false,
  },
  {
    id: 4,
    type: "rivleresim",
    title: "Kërkesë e re rivlerësimi",
    desc: "Valon Murati kërkoi rivlerësim për Sistemet e Informacionit",
    badge: "Në pritje",
    badgeColor: "prof-top-bar-badge-color",
    link: "/prof/kerkesat",
    read: true,
  },
];

function notifIcon(type) {
  if (type === "rivleresim") return <ClipboardList size={14} className="prof-top-bar-icon" />;
  if (type === "konsultim") return <CalendarClock size={14} className="prof-top-bar-icon-2" />;
  return <AlertTriangle size={14} className="prof-top-bar-icon-3" />;
}

export function ProfTopBar() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("SQ");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef(null);

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

  return (
    <div className="prof-top-bar-box">
      <button
        onClick={() => setLang((l) => (l === "SQ" ? "EN" : "SQ"))}
        className="prof-top-bar-btn"
        title={lang === "SQ" ? "Switch to English" : "Kalo në Shqip"}
      >
        <span className="prof-top-bar-text">{lang}</span>
      </button>

      <div className="prof-top-bar-box-2" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="prof-top-bar-btn-2"
          title="Njoftimet"
        >
          <Bell size={18} className="prof-top-bar-icon-4" />
          {unreadCount > 0 && (
            <span className="prof-top-bar-dot" />
          )}
        </button>

        {notifOpen && (
          <div className="prof-top-bar-popup">
            <div className="prof-top-bar-row">
              <span className="prof-top-bar-text-2">Njoftimet</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                  className="prof-top-bar-btn-3"
                >
                  Shëno të gjitha si lexuar
                </button>
              )}
            </div>
            <div className="prof-top-bar-scroll">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className={`prof-top-bar-row-2 ${!n.read ? "prof-top-bar-box-3" : ""}`}>
                  <div className={`prof-top-bar-avatar ${!n.read ? "prof-top-bar-box-4" : "prof-top-bar-box-5"}`}>
                    {notifIcon(n.type)}
                  </div>
                  <div className="prof-top-bar-box-6">
                    <div className="prof-top-bar-row-3">
                      <p className={`prof-top-bar-text-3 ${!n.read ? "prof-top-bar-icon-4" : "prof-top-bar-text-4"}`}>
                        {n.title}
                      </p>
                      <span className={`prof-top-bar-badge ${n.badgeColor}`}>
                        {n.badge}
                      </span>
                    </div>
                    <p className="prof-top-bar-text-5">{n.desc}</p>
                    <button
                      onClick={() => { setNotifOpen(false); navigate(n.link); }}
                      className="prof-top-bar-btn-4"
                    >
                      Shiko
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="prof-top-bar-box-7">
              <button
                onClick={() => { setNotifOpen(false); navigate("/prof/kerkesat"); }}
                className="prof-top-bar-btn-5"
              >
                Shiko të gjitha
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/profili")}
        className="prof-top-bar-btn-6"
        title="Profili Im"
      >
        <span className="prof-top-bar-text-6">KR</span>
      </button>
    </div>
  );
}

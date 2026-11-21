import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import { useTheme } from "../context/ThemeContext";
import { logout } from "../../api";
import { profile as studentProfile } from "../data/student";
import { Home, Calendar, BookOpen, FileText, RefreshCw, Shield, Briefcase, GraduationCap, Search, X, Plus, ChevronRight, ChevronDown, Clock, LogOut, Moon, Sun, CreditCard, MessageCircle, ClipboardList, CheckCircle, Layers, Library, Award, RotateCcw, BookMarked, Scan, ArrowRightLeft, UserX, AlertCircle, ScrollText, User, Users, ClipboardCheck, FolderOpen, Inbox, Star, Accessibility } from "lucide-react";
import { useRole } from "../context/RoleContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { PROFESSOR } from "../data/professor";
import "./Sidebar.css";

const studentSections = [
  {
    kind: "static",
    title: "Kryesore",
    items: [
      { icon: Home, label: "Ballina", path: "/" },
      { icon: Calendar, label: "Orari", path: "/orari" },
      { icon: CreditCard, label: "Pagesat", path: "/pagesat" },
      { icon: MessageCircle, label: "Konsultime", path: "/konsultime" },
    ],
  },
  {
    kind: "accordion",
    title: "Lëndët",
    icon: BookOpen,
    items: [
      { icon: BookOpen, label: "Të Regjistruara", path: "/lendet" },
      { icon: Plus, label: "Regjistro Lëndë", path: "/lendet/regjistro" },
      { icon: FileText, label: "Paraqit Provimet", path: "/lendet/paraqit" },
      { icon: Library, label: "Literatura e lëndëve", path: "/tjera/literatura" },
    ],
  },
  {
    kind: "static",
    title: "Akademike",
    items: [
      { icon: ScrollText, label: "Transkriptë", path: "/transkripta" },
    ],
  },
  {
    kind: "accordion",
    title: "Kërkesat",
    icon: ClipboardList,
    items: [
      { icon: FileText, label: "Kërkesë për kartelë", path: "/kerkesat/kartele" },
      { icon: ArrowRightLeft, label: "Transferimi i notës", path: "/kerkesat/transferimi" },
      { icon: UserX, label: "Kërkesë për ç'regjistrim", path: "/kerkesat/cregjistrim" },
      { icon: AlertCircle, label: "Kërkesë / Ankesë", path: "/kerkesat/ankese" },
    ],
  },
  {
    kind: "accordion",
    title: "Vlerësimi",
    icon: RefreshCw,
    items: [
      { icon: RotateCcw, label: "Vlerësimi i Vazhdueshëm", path: "/rivleresimi" },
      { icon: FileText, label: "Regjistro kërkesën", path: "/rivleresimi/regjistro" },
      { icon: BookMarked, label: "Manuali i përdorimit", path: "/rivleresimi/manuali" },
    ],
  },
  {
    kind: "accordion",
    title: "Vijueshmëria",
    icon: CheckCircle,
    items: [
      { icon: ClipboardList, label: "Vijueshmëria në lëndë", path: "/vijueshmeria" },
      { icon: Scan, label: "Scan QR Code", path: "/tjera/scan-qr" },
      { icon: BookMarked, label: "Manuali i përdorimit", path: "/vijueshmeria/manuali" },
    ],
  },
  {
    kind: "accordion",
    title: "Të Tjera",
    icon: Layers,
    items: [
      { icon: Shield, label: "Vërtetimi online", path: "/vertetimet" },
      { icon: Award, label: "QEQ Aplikimi", path: "/qeq/aplikimi" },
      { icon: BookOpen, label: "QEQ Lëndët", path: "/qeq/lendet" },
      { icon: FileText, label: "QEQ Transkriptë", path: "/qeq/transkripta" },
      { icon: GraduationCap, label: "Kërkesë për titull të diplomës", path: "/tjera/diploma" },
      { icon: RotateCcw, label: "Kthimi i mjeteve", path: "/tjera/kthimi-mjeteve" },
      { icon: Award, label: "Apliko për bursë", path: "/tjera/burse" },
      { icon: Briefcase, label: "Praktika Apliko", path: "/praktika/apliko" },
      { icon: ClipboardList, label: "Praktika Aplikimet", path: "/praktika/aplikimet" },
      { icon: Shield, label: "Administrata", path: "/tjera/administrata" },
      { icon: BookOpen, label: "Raporto Broshura", path: "/raporto/broshura" },
      { icon: FileText, label: "Raporto Rregullore", path: "/raporto/rregullore" },
    ],
  },
];

const professorSections = [
  {
    kind: "static",
    title: "Kryesore",
    items: [
      { icon: Home, label: "Ballina", path: "/" },
      { icon: Calendar, label: "Orari", path: "/orari" },
      { icon: MessageCircle, label: "Konsultime", path: "/konsultime" },
    ],
  },
  {
    kind: "static",
    title: "Mësimdhënia",
    items: [
      { icon: BookOpen, label: "Lëndët e Mia", path: "/prof/lendet" },
      { icon: Users, label: "Studentët", path: "/prof/studentet" },
      { icon: ClipboardCheck, label: "Vlerësimi i Vazhdueshëm", path: "/prof/vleresimi" },
      { icon: Star, label: "Notat Përfundimtare", path: "/prof/notat" },
      { icon: CheckCircle, label: "Vijueshmëria", path: "/prof/vijueshmeria" },
      { icon: FolderOpen, label: "Materialet", path: "/prof/materialet" },
    ],
  },
  {
    kind: "static",
    title: "Kërkesat",
    items: [
      { icon: Inbox, label: "Kërkesat e Studentëve", path: "/prof/kerkesat" },
    ],
  },
  {
    kind: "static",
    title: "Të tjera",
    items: [
      { icon: User, label: "Profili", path: "/profili" },
    ],
  },
];

function buildFlatIndex(sections) {
  return sections.flatMap((section) =>
    section.items.map((item) => ({
      icon: item.icon,
      label: item.label,
      path: item.path,
      parent: section.title,
    }))
  );
}

const professors = [
  { name: "Prof. Artan Berisha", department: "Inxhinieria e Softuerit", initials: "AB", color: "#007AFF" },
  { name: "Prof. Korab Rrmoku", department: "Sistemet Kompjuterike", initials: "KR", color: "#34C759" },
  { name: "Prof. Eliot Bytyçi", department: "Inteligjenca Artificiale", initials: "EB", color: "#FF9500" },
  { name: "Prof. Faton Berisha", department: "Matematikë & Algoritme", initials: "FB", color: "#AF52DE" },
];

const recentSearches = [
  { icon: ScrollText, label: "Transkriptë", path: "/transkripta", parent: "Akademike" },
  { icon: Calendar, label: "Orari", path: "/orari", parent: "Kryesore" },
  { icon: ClipboardList, label: "Vijueshmëria në lëndë", path: "/vijueshmeria", parent: "Vijueshmëria" },
  { icon: CreditCard, label: "Pagesat", path: "/pagesat", parent: "Kryesore" },
];

const professorSuggestions = [
  { emoji: "📚", label: "Lëndët e Mia", subtitle: "Shiko të 4 lëndët tuaja aktive", path: "/prof/lendet" },
  { emoji: "📁", label: "Materialet", subtitle: "Ngarko ose menaxho materialet e lëndëve", path: "/prof/materialet" },
  { emoji: "✅", label: "Vijueshmëria", subtitle: "Gjenero QR ose shiko prezencën e studentëve", path: "/prof/vijueshmeria" },
  { emoji: "📋", label: "Kërkesat e Studentëve", subtitle: "Shiko kërkesat në pritje", path: "/prof/kerkesat" },
  { emoji: "📊", label: "Vlerësimi i Vazhdueshëm", subtitle: "Vendos pikët e studentëve", path: "/prof/vleresimi" },
];

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Sidebar({ mobile, onClose }) {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { resolvedTheme: theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();
  const { panelOpen, setPanelOpen, activeProfile } = useAccessibility();

  const sections = role === "professor" ? professorSections : studentSections;
  const flatIndex = buildFlatIndex(sections);

  const q = normalize(search.trim());
  const filtered = q
    ? flatIndex.filter(
        (s) =>
          normalize(s.label).includes(q) ||
          (s.parent && normalize(s.parent).includes(q))
      )
    : [];

  const filteredProfs = q
    ? professors.filter(
        (p) =>
          normalize(p.name).includes(q) ||
          normalize(p.department).includes(q)
      )
    : [];

  const handleSuggestionClick = (path) => {
    navigate(path);
    setSearch("");
    setSearchFocused(false);
    onClose?.();
  };

  const handleProfClick = () => {
    navigate("/konsultime");
    setSearch("");
    setSearchFocused(false);
    onClose?.();
  };

  const toggleAccordion = (title) => {
    setOpenAccordion((prev) => (prev === title ? null : title));
  };

  const isPathActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="sidebar-stack">
      {/* Header */}
      <div className="sidebar-box">
        <div className="sidebar-row">
          <div className="sidebar-row-2">
            <div className="sidebar-icon-box">
              <GraduationCap size={16} className="sidebar-icon" />
            </div>
            <div>
              <div className="sidebar-text">
                SEMS
              </div>
              <div className="sidebar-text-2">
                UP Prishtinë
              </div>
            </div>
          </div>
          <div className="sidebar-row-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="sidebar-btn"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {mobile && (
              <button
                onClick={onClose}
                className="sidebar-btn"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-box-2">
          <div
            className={`sidebar-row-4 ${
              searchFocused
                ? "sidebar-box-3"
                : "sidebar-box-4"
            }`}
          >
            <Search size={13} className="sidebar-icon-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Kërko..."
              className="sidebar-input"
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={11} className="sidebar-icon-3" />
              </button>
            )}
          </div>
          {searchFocused && (
            <div className="sidebar-popup">

              {/* No-results state */}
              {q && filtered.length === 0 && filteredProfs.length === 0 && (
                <>
                  <div className="sidebar-box-5">
                    Rezultatet
                  </div>
                  <div className="sidebar-box-6">
                    <div className="sidebar-text-3">
                      Asnjë rezultat për "{search}"
                    </div>
                    <div className="sidebar-text-4">
                      Provo: {recentSearches.slice(0, 3).map((r) => r.label).join(", ")}
                    </div>
                  </div>
                </>
              )}

              {/* Suggestions (empty query) */}
              {!q && role === "professor" && (
                <>
                  <div className="sidebar-row-5">
                    Sugjerime të shpejta
                  </div>
                  {professorSuggestions.map((s) => (
                    <button
                      key={s.path}
                      onMouseDown={() => handleSuggestionClick(s.path)}
                      className="sidebar-btn-2"
                    >
                      <span className="sidebar-text-5">{s.emoji}</span>
                      <div className="sidebar-box-7">
                        <div className="sidebar-text-6">{s.label}</div>
                        <div className="sidebar-text-7">{s.subtitle}</div>
                      </div>
                      <ChevronRight size={11} className="sidebar-icon-2" />
                    </button>
                  ))}
                </>
              )}
              {!q && role !== "professor" && (
                <>
                  <div className="sidebar-row-5">
                    <Clock size={10} /> Kërkimet e fundit
                  </div>
                  {recentSearches.map((s) => (
                    <button
                      key={s.path + s.label}
                      onMouseDown={() => handleSuggestionClick(s.path)}
                      className="sidebar-btn-2"
                    >
                      <s.icon size={14} className="sidebar-icon-2" />
                      <div className="sidebar-box-7">
                        <div className="sidebar-text-6">{s.label}</div>
                        {s.parent && s.parent !== s.label && (
                          <div className="sidebar-row-6">
                            {s.parent}<ChevronRight size={9} /><span className="sidebar-text-8">{s.label}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={11} className="sidebar-icon-2" />
                    </button>
                  ))}
                </>
              )}

              {/* Page results */}
              {q && filtered.length > 0 && (
                <>
                  <div className="sidebar-row-5">
                    Rezultatet <span className="sidebar-text-9">· {filtered.length}</span>
                  </div>
                  {filtered.map((s) => (
                    <button
                      key={s.path + s.label}
                      onMouseDown={() => handleSuggestionClick(s.path)}
                      className="sidebar-btn-2"
                    >
                      <s.icon size={14} className="sidebar-icon-2" />
                      <div className="sidebar-box-7">
                        <div className="sidebar-text-6">{s.label}</div>
                        {s.parent && s.parent !== s.label && (
                          <div className="sidebar-row-6">
                            {s.parent}<ChevronRight size={9} /><span className="sidebar-text-8">{s.label}</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={11} className="sidebar-icon-2" />
                    </button>
                  ))}
                </>
              )}

              {/* Professor results */}
              {q && filteredProfs.length > 0 && (
                <>
                  {filtered.length > 0 && (
                    <div className="sidebar-box-8" />
                  )}
                  <div className="sidebar-row-5">
                    <User size={10} /> Profesorët
                  </div>
                  {filteredProfs.map((prof) => (
                    <button
                      key={prof.name}
                      onMouseDown={handleProfClick}
                      className="sidebar-btn-2"
                    >
                      <div
                        className="sidebar-avatar"
                        style={{ backgroundColor: prof.color }}
                      >
                        {prof.initials}
                      </div>
                      <div className="sidebar-box-7">
                        <div className="sidebar-text-6">{prof.name}</div>
                        <div className="sidebar-row-6">
                          Konsultime <ChevronRight size={9} /> <span className="sidebar-text-8">{prof.department}</span>
                        </div>
                      </div>
                      <MessageCircle size={11} className="sidebar-icon-2" />
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {sections.map((section) => {
          if (section.kind === "static") {
            return (
              <div key={section.title} className="sidebar-text-10">
                {/* Section label */}
                <div className={`sidebar-box-9 ${mobile ? "sidebar-text-11" : "sidebar-text-12"}`}>
                  {section.title}
                </div>
                {/* Items */}
                {section.items.map((item) => {
                  const active = isPathActive(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/"}
                      className={`sidebar-link ${mobile ? "sidebar-link-2" : "sidebar-link-3"} ${
                        active
                          ? "sidebar-link-4"
                          : "sidebar-link-5"
                      }`}
                    >
                      {active && (
                        <div className="sidebar-popup-2" />
                      )}
                      <item.icon
                        size={16}
                        className={active ? "sidebar-text-13" : "sidebar-icon-3"}
                      />
                      <span className={`${mobile ? "sidebar-text-15" : "sidebar-text-16"} sidebar-text-14 ${active ? "sidebar-text-17" : "sidebar-text-18"}`}>
                        {item.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            );
          }

          // Accordion section
          const isOpen = openAccordion === section.title;
          const hasActiveChild = section.items.some((item) => isPathActive(item.path));

          return (
            <div key={section.title} className="sidebar-text-19">
              {/* Accordion header */}
              <button
                onClick={() => toggleAccordion(section.title)}
                className={`sidebar-btn-3 ${mobile ? "sidebar-link-2" : "sidebar-link-3"} ${
                  hasActiveChild
                    ? "sidebar-link-4"
                    : isOpen
                    ? "sidebar-btn-4"
                    : "sidebar-link-5"
                }`}
              >
                {hasActiveChild && (
                  <div className="sidebar-popup-2" />
                )}
                <section.icon
                  size={16}
                  className={
                    hasActiveChild
                      ? "sidebar-text-13"
                      : isOpen
                      ? "sidebar-text-20"
                      : "sidebar-icon-3"
                  }
                />
                <span className={`${mobile ? "sidebar-text-15" : "sidebar-text-16"} sidebar-text-21 ${hasActiveChild ? "sidebar-text-17" : "sidebar-text-18"}`}>
                  {section.title}
                </span>
                <ChevronDown
                  size={13}
                  className={`sidebar-icon-4 ${isOpen ? "sidebar-icon-5" : "sidebar-icon-6"} ${
                    hasActiveChild
                      ? "sidebar-text-13"
                      : "sidebar-icon-3"
                  }`}
                />
              </button>

              {/* Accordion children */}
              {isOpen && (
                <div className="sidebar-box-10">
                  {section.items.map((item) => {
                    const active = isPathActive(item.path);
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link-6 ${mobile ? "sidebar-link-7" : "sidebar-link-8"} ${
                          active
                            ? item.danger 
                              ? "sidebar-link-9"
                              : "sidebar-link-4"
                            : item.danger
                            ? "sidebar-link-10"
                            : "sidebar-link-5"
                        }`}
                      >
                        <item.icon
                          size={14}
                          className={
                            active 
                              ? item.danger ? "sidebar-text-22" : "sidebar-text-13" 
                              : item.danger ? "sidebar-text-23" : "sidebar-icon-3"
                          }
                        />
                        <span className={`${mobile ? "sidebar-text-16" : "sidebar-text-25"} sidebar-text-24 ${active ? "sidebar-text-17" : "sidebar-text-26"}`}>
                          {item.label}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Accessibility trigger */}
      <div className="sidebar-box-11">
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className={`sidebar-btn-3 ${mobile ? "sidebar-link-2" : "sidebar-link-3"} ${
            panelOpen
              ? "sidebar-link-4"
              : "sidebar-btn-5"
          }`}
        >
          {panelOpen && (
            <div className="sidebar-popup-2" />
          )}
          <Accessibility
            size={16}
            className={panelOpen ? "sidebar-text-13" : "sidebar-icon-3"}
          />
          <span className={`${mobile ? "sidebar-text-15" : "sidebar-text-16"} sidebar-text-21 ${panelOpen ? "sidebar-text-17" : "sidebar-text-18"}`}>
            Aksesueshmëria
          </span>
          {activeProfile && (
            <span className="sidebar-dot" />
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="sidebar-box-12">
        <div className="sidebar-row-7">
          <button
            onClick={() => { navigate("/profili"); onClose?.(); }}
            className={`sidebar-btn-6 ${
              role === "professor"
                ? "sidebar-btn-7"
                : "sidebar-btn-8"
            }`}
          >
            {role === "professor" ? PROFESSOR.initials : studentProfile.initials}
          </button>
          <div className="sidebar-box-7">
            <div className={`${mobile ? "sidebar-text-28" : "sidebar-text-29"} sidebar-text-27`}>
              {role === "professor" ? PROFESSOR.name : studentProfile.name}
            </div>
            <div className={`${mobile ? "sidebar-text-25" : "sidebar-text-11"} sidebar-icon-3`}>
              {role === "professor" ? `Profesor · ${PROFESSOR.faculty}` : studentProfile.info}
            </div>
          </div>
          <button
            onClick={() => logout().then(() => window.location.assign("/"))}
            className="sidebar-btn-9"
          >
            <LogOut size={14} className="sidebar-icon-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

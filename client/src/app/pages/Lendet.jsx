import { useState } from "react";
import { useLocation } from "react-router";
import {
  BookOpen,
  User,
  Clock,
  ChevronRight,
  Award,
  Check,
  ChevronDown,
  AlertTriangle,
  CalendarRange,
  Lock,
} from "lucide-react";
import { SmartSearch } from "../components/SmartSearch";
import { courses as lendet, examCourses as paraqitLendet } from "../data/student";
import "./Lendet.css";

// ── Semestri 4 registration data ─────────────────────────────────────────────
const ACTIVE_REG_SEM = 4;

const sem4Obligative = [
  { id: 201, emri: "Kriptografia e Aplikuar",      profesor: "Prof. Artan Berisha",   ects: 6, oreLigjerate: 3, oreUshtrime: 1, color: "#34C759", darkColor: "#32D74B", bg: "lendet-bg-3" },
  { id: 202, emri: "Menaxhimi i Projekteve",        profesor: "Prof. Bujar Fejzullahu", ects: 6, oreLigjerate: 2, oreUshtrime: 2, color: "#007AFF", darkColor: "#0A84FF", bg: "lendet-bg" },
  { id: 203, emri: "Inxhinieria e Softuerit 2",    profesor: "Prof. Faton Berisha",   ects: 6, oreLigjerate: 3, oreUshtrime: 1, color: "#5856D6", darkColor: "#5E5CE6", bg: "lendet-bg-4" },
];

const sem4Zgjedhore = [
  { id: 204, emri: "Mësimi i Thellë (Deep Learning)", profesor: "Prof. Eliot Bytyçi",   ects: 6, oreLigjerate: 3, oreUshtrime: 2, color: "#FF9500", darkColor: "#FF9F0A", bg: "lendet-bg-5" },
  { id: 205, emri: "Zhvillimi i Aplik. Mobile",       profesor: "Prof. Korab Rrmoku",  ects: 6, oreLigjerate: 2, oreUshtrime: 2, color: "#FF2D55", darkColor: "#FF375F", bg: "lendet-bg-2" },
  { id: 206, emri: "Informatika Mjekësore",           profesor: "Prof. Bujar Fejzullahu", ects: 6, oreLigjerate: 2, oreUshtrime: 1, color: "#AF52DE", darkColor: "#BF5AF2", bg: "lendet-bg-6" },
];

const OBL_ECTS = sem4Obligative.reduce((s, c) => s + c.ects, 0);

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(nota) {
  if (nota === 10) return "lendet-grade-color";
  if (nota >= 8) return "lendet-grade-color-2";
  return "lendet-grade-color-3";
}

function LlojiBadge({ lloji }) {
  const isObl = lloji === "Obligative";
  return (
    <span className={`lendet-badge ${isObl ? "lendet-text" : "lendet-text-2"}`}>
      {lloji}
    </span>
  );
}

function CardShell({ lenda, children }) {
  return (
    <div className="lendet-box">
      <div className="lendet-box-2" style={{ backgroundColor: lenda.color }} />
      <div className="lendet-box-3" style={{ backgroundColor: lenda.darkColor }} />
      <div className="lendet-box-4">{children}</div>
    </div>
  );
}

function CardHeader({ lenda, right }) {
  return (
    <div className="lendet-row">
      <div className={`lendet-icon-box ${TINT_BY_COLOR[lenda.color]}`}>
        <BookOpen size={18} className="lendet-icon" style={{ color: lenda.color }} />
        <BookOpen size={18} className="lendet-icon-2" style={{ color: lenda.darkColor }} />
      </div>
      {right}
    </div>
  );
}

function CardMeta({ lenda }) {
  return (
    <>
      <div className="lendet-text-3">{lenda.emri}</div>
      <div className="lendet-row-2">
        <User size={12} />
        <span className="lendet-text-4">{lenda.profesor}</span>
      </div>
    </>
  );
}

function CardFooter({ lenda }) {
  return (
    <div className="lendet-row-3">
      <div className="lendet-row-4"><Award size={12} /><span className="lendet-text-4">{lenda.ects} ECTS</span></div>
      <div className="lendet-row-4"><Clock size={12} /><span className="lendet-text-4">{lenda.oreLigjerate + lenda.oreUshtrime}h/javë</span></div>
    </div>
  );
}

function TeRegjistruaraCard({ lenda }) {
  return (
    <CardShell lenda={lenda}>
      <CardHeader lenda={lenda} right={
        <div className="lendet-row-5">
          <LlojiBadge lloji={lenda.lloji} />
          {lenda.nota > 5 && (
            <div className={`lendet-icon-box-2 ${gradeColor(lenda.nota)}`}>{lenda.nota}</div>
          )}
        </div>
      } />
      <CardMeta lenda={lenda} />
      <div className="lendet-dot">
        <div className="lendet-box-5" style={{ width: `${(lenda.ects / 7) * 100}%`, backgroundColor: lenda.color }} />
        <div className="lendet-box-6" style={{ width: `${(lenda.ects / 7) * 100}%`, backgroundColor: lenda.darkColor }} />
      </div>
      <div className="lendet-row-6">
        <CardFooter lenda={lenda} />
        <ChevronRight size={14} className="lendet-icon-3" />
      </div>
    </CardShell>
  );
}

function ParaqitCard({ lenda, paraqitur, onToggle, onAnulo }) {
  const eKaluar = lenda.nota && lenda.nota > 5;
  return (
    <CardShell lenda={lenda}>
      <CardHeader lenda={lenda} right={
        <div className="lendet-row-5">
          <LlojiBadge lloji={lenda.lloji} />
          {eKaluar && (
            <div className={`lendet-icon-box-2 ${gradeColor(lenda.nota)}`}>{lenda.nota}</div>
          )}
        </div>
      } />
      <CardMeta lenda={lenda} />
      <div className="lendet-row-7">
        <div className="lendet-box-7"><CardFooter lenda={lenda} /></div>
        {eKaluar ? (
          <span className="lendet-badge-2">E Kaluar</span>
        ) : paraqitur ? (
          <div className="lendet-stack">
            <span className="lendet-badge-3">
              <Check size={14} />E Paraqitur
            </span>
            <button
              onClick={onAnulo}
              className="lendet-btn"
            >
              Anulo paraqitjen
            </button>
          </div>
        ) : (
          <button onClick={onToggle} className="lendet-btn-2">
            Paraqit
          </button>
        )}
      </div>
    </CardShell>
  );
}

// ── Registration course row (checkbox style) ─────────────────────────────────

function RegCourseCard({ course, checked, disabled, onToggle }) {
  return (
    <div
      onClick={!disabled ? onToggle : undefined}
      className={`lendet-row-8 ${
        disabled
          ? "lendet-box-8"
          : checked
          ? "lendet-box-9"
          : "lendet-box-10"
      }`}
    >
      {/* Checkbox */}
      <div className={`lendet-icon-box-3 ${
        checked
          ? "lendet-box-11"
          : "lendet-box-12"
      }`}>
        {checked && <Check size={12} className="lendet-icon-4" strokeWidth={2.5} />}
      </div>

      {/* Color dot */}
      <div className={`lendet-icon-box-4 ${TINT_BY_COLOR[course.color]}`}>
        <BookOpen size={15} className="lendet-icon" style={{ color: course.color }} />
        <BookOpen size={15} className="lendet-icon-2" style={{ color: course.darkColor }} />
      </div>

      {/* Info */}
      <div className="lendet-box-13">
        <div className="lendet-text-5">{course.emri}</div>
        <div className="lendet-text-6">{course.profesor}</div>
      </div>

      {/* ECTS + lock */}
      <div className="lendet-row-5">
        <span className="lendet-text-7">{course.ects} ECTS</span>
        {disabled && <Lock size={13} className="lendet-icon-5" />}
      </div>
    </div>
  );
}

// ── Semester chip ─────────────────────────────────────────────────────────────

function SemChip({
  num, active, selected, onClick,
}) {
  const label = num === "all" ? "Të gjitha" : `Semestri ${num}`;
  if (!active) {
    return (
      <div
        title="Ky semestër nuk është aktiv"
        className="lendet-card"
      >
        <Lock size={10} />
        {label}
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`lendet-btn-3 ${
        selected
          ? "lendet-btn-4"
          : "lendet-btn-5"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

// background tint for each course color
const TINT_BY_COLOR = {
  "#007AFF": "lendet-tint-blue",
  "#FF2D55": "lendet-tint-pink",
  "#34C759": "lendet-tint-green",
  "#5856D6": "lendet-tint-indigo",
  "#FF9500": "lendet-tint-orange",
  "#AF52DE": "lendet-tint-purple",
};

export function Lendet() {
  const { pathname } = useLocation();

  // Shared
  const [search, setSearch] = useState("");

  // Tab 2: Paraqit Provimet
  const [paraqitura, setParaqitura] = useState({});
  const [anuloConfirmId, setAnuloConfirmId] = useState(null);
  const [paraqitSemFilter, setParaqitSemFilter] = useState(4);
  const [paraqitTypeFilter, setParaqitTypeFilter] = useState(null);

  // Tab 3: Regjistro Lëndë
  const [regSearch, setRegSearch] = useState("");
  const [selectedZgjedhore, setSelectedZgjedhore] = useState(new Set());
  const [regSemOpen, setRegSemOpen] = useState(false);

  let activeTab = "regjistruara";
  if (pathname.includes("/regjistro")) activeTab = "regjistro";
  else if (pathname.includes("/paraqit")) activeTab = "paraqit";

  // ── Tab 1 derived ───────────────────────────────────────────────────────────
  const currentCourses = lendet.filter((l) => l.semestri === "Pranveror 2025/26");
  const filteredCurrent = currentCourses.filter(
    (l) => l.emri.toLowerCase().includes(search.toLowerCase()) || l.profesor.toLowerCase().includes(search.toLowerCase())
  );
  const currentObl = filteredCurrent.filter((l) => l.lloji === "Obligative");
  const currentZgj = filteredCurrent.filter((l) => l.lloji === "Zgjedhore");

  // ── Tab 2 derived ───────────────────────────────────────────────────────────
  const filteredParaqit = paraqitLendet.filter((l) => {
    const matchSem = paraqitSemFilter === null || l.semNum === paraqitSemFilter;
    const matchType = paraqitTypeFilter === null || l.lloji === paraqitTypeFilter;
    const matchSearch =
      l.emri.toLowerCase().includes(search.toLowerCase()) ||
      l.profesor.toLowerCase().includes(search.toLowerCase());
    return matchSem && matchType && matchSearch;
  });
  const paraqitSorted = [
    ...filteredParaqit.filter((l) => !(l.nota && l.nota > 5) && !paraqitura[l.id]),
    ...filteredParaqit.filter((l) => (l.nota && l.nota > 5) || paraqitura[l.id]).sort((a, b) => a.emri.localeCompare(b.emri)),
  ];

  // ── Tab 3 derived ───────────────────────────────────────────────────────────
  const regObl = sem4Obligative.filter(
    (c) => c.emri.toLowerCase().includes(regSearch.toLowerCase()) || c.profesor.toLowerCase().includes(regSearch.toLowerCase())
  );
  const regZgj = sem4Zgjedhore.filter(
    (c) => c.emri.toLowerCase().includes(regSearch.toLowerCase()) || c.profesor.toLowerCase().includes(regSearch.toLowerCase())
  );
  const selECTS = [...selectedZgjedhore].reduce((s, id) => {
    const c = sem4Zgjedhore.find((z) => z.id === id);
    return s + (c?.ects ?? 0);
  }, 0);
  const totalECTS = OBL_ECTS + selECTS;
  const ectsStatus = totalECTS < 30 ? "under" : totalECTS === 30 ? "ok" : "over";

  function toggleZgjedhore(id) {
    setSelectedZgjedhore((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleConfirmAnulim() {
    if (anuloConfirmId !== null) {
      setParaqitura((p) => ({ ...p, [anuloConfirmId]: false }));
      setAnuloConfirmId(null);
    }
  }

  // ── Subtitle text ───────────────────────────────────────────────────────────
  const subtitle = {
    regjistruara: `${currentCourses.length} lëndë të regjistruara`,
    paraqit: "5 lëndë të disponueshme për paraqitje",
    regjistro: `Semestri ${ACTIVE_REG_SEM} — ${totalECTS}/30 ECTS`,
  }[activeTab] ?? "";

  return (
    <div className="lendet-box-14">
      <div className="">

        {/* Header */}
        <div className="lendet-text-8">
          <h1 className="lendet-title">
            {activeTab === "regjistruara" && "Të Regjistruara"}
            {activeTab === "paraqit" && "Paraqit Provimet"}
            {activeTab === "regjistro" && "Regjistro Lëndë"}
          </h1>
          <p className="lendet-text-9">{subtitle}</p>
        </div>

        {/* ── TOOLBAR ─────────────────────────────────────────────────────────── */}
        {activeTab !== "regjistro" && (
          <div className="lendet-text-10">
            <SmartSearch
              value={search}
              onChange={setSearch}
              placeholder={activeTab === "paraqit" ? "Kërko lëndën ose profesorin..." : "Kërko lëndën ose profesorin..."}
              headerLabel={activeTab === "paraqit" ? "Sugjerime për provime" : "Sugjerime"}
              suggestions={
                activeTab === "paraqit"
                  ? [
                      { label: "Provime obligative", icon: BookOpen },
                      { label: "Provime zgjedhore", icon: Award },
                      { label: "Provime të paraqitura", icon: Check },
                    ]
                  : [
                      { label: "Semestri aktual", icon: CalendarRange },
                      { label: "Lëndë obligative", icon: BookOpen },
                      { label: "Prof. Artan Berisha", icon: User },
                    ]
              }
            />
          </div>
        )}

        {/* ── PARAQIT FILTER BAR ───────────────────────────────────────────────── */}
        {activeTab === "paraqit" && (
          <div className="lendet-box-15">
            {/* Semester chips */}
            <div className="lendet-row-9">
              <span className="lendet-text-11">Semestri:</span>
              <SemChip
                num="all"
                active={true}
                selected={paraqitSemFilter === null}
                onClick={() => setParaqitSemFilter(null)}
              />
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SemChip
                  key={n}
                  num={n}
                  active={n === 4}
                  selected={paraqitSemFilter === n}
                  onClick={() => setParaqitSemFilter(paraqitSemFilter === n ? null : n)}
                />
              ))}
            </div>
            {/* Type chips */}
            <div className="lendet-row-9">
              <span className="lendet-text-11">Lloji:</span>
              {([null, "Obligative", "Zgjedhore"]).map((t) => (
                <button
                  key={t ?? "all"}
                  onClick={() => setParaqitTypeFilter(t)}
                  className={`lendet-btn-3 ${
                    paraqitTypeFilter === t
                      ? "lendet-btn-4"
                      : "lendet-btn-5"
                  }`}
                >
                  {t === null ? "Të gjitha" : t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── VIEW 1 — Të Regjistruara ────────────────────────────────────────── */}
        {activeTab === "regjistruara" && (
          <>
            {currentObl.length > 0 && (
              <>
                <h2 className="lendet-title-2">
                  Lëndë Obligative
                  <span className="lendet-text-12">({currentObl.length})</span>
                </h2>
                <div className="lendet-grid">
                  {currentObl.map((l) => <TeRegjistruaraCard key={l.id} lenda={l} />)}
                </div>
              </>
            )}
            {currentZgj.length > 0 && (
              <>
                <h2 className="lendet-title-2">
                  Lëndë Zgjedhore
                  <span className="lendet-text-12">({currentZgj.length})</span>
                </h2>
                <div className="lendet-grid-2">
                  {currentZgj.map((l) => <TeRegjistruaraCard key={l.id} lenda={l} />)}
                </div>
              </>
            )}
            {filteredCurrent.length === 0 && (
              <div className="lendet-card-2">
                <BookOpen size={32} className="lendet-icon-3" />
                <p className="lendet-text-13">Asnjë lëndë e gjetur</p>
              </div>
            )}
          </>
        )}

        {/* ── VIEW 2 — Paraqit Provimet ──────────────────────────────────────── */}
        {activeTab === "paraqit" && (
          <>
            <div className="lendet-grid-2">
              {paraqitSorted.map((l) => (
                <ParaqitCard
                  key={l.id}
                  lenda={l}
                  paraqitur={!!paraqitura[l.id]}
                  onToggle={() => setParaqitura((p) => ({ ...p, [l.id]: !p[l.id] }))}
                  onAnulo={() => setAnuloConfirmId(l.id)}
                />
              ))}
            </div>
            {paraqitSorted.length === 0 && (
              <div className="lendet-card-2">
                <BookOpen size={32} className="lendet-icon-3" />
                <p className="lendet-text-13">Asnjë lëndë e gjetur</p>
              </div>
            )}
          </>
        )}

        {/* ── VIEW 3 — Regjistro Lëndë ──────────────────────────────────────── */}
        {activeTab === "regjistro" && (
          <div className="lendet-box-16">

            {/* Semester selector */}
            <div>
              <label className="lendet-label">
                Zgjidh Semestrin
              </label>
              <div className="lendet-box-17">
                <button
                  onClick={() => setRegSemOpen((v) => !v)}
                  className="lendet-btn-6"
                >
                  Semestri {ACTIVE_REG_SEM}
                  <ChevronDown size={15} className={`lendet-icon-6 ${regSemOpen ? "lendet-icon-7" : ""}`} />
                </button>
                {regSemOpen && (
                  <div className="lendet-popup">
                    {[1, 2, 3, 4, 5, 6].map((n) => {
                      const isActive = n === ACTIVE_REG_SEM;
                      return (
                        <button
                          key={n}
                          disabled={!isActive}
                          onClick={() => isActive && setRegSemOpen(false)}
                          title={!isActive ? "Ky semestër nuk është aktiv për regjistrim aktualisht." : undefined}
                          className={`lendet-btn-7 ${
                            isActive
                              ? n === ACTIVE_REG_SEM
                                ? "lendet-btn-8"
                                : "lendet-btn-9"
                              : "lendet-btn-10"
                          }`}
                        >
                          <span>Semestri {n}</span>
                          {!isActive && <Lock size={12} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="lendet-box-18">
              <BookOpen size={15} className="lendet-icon-8" />
              <input
                type="text"
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                placeholder="Kërko sipas emrit të lëndës ose profesorit..."
                className="lendet-input"
              />
            </div>

            {/* ECTS counter */}
            <div className={`lendet-row-10 ${
              ectsStatus === "ok"
                ? "lendet-box-19"
                : ectsStatus === "over"
                ? "lendet-box-20"
                : "lendet-box-21"
            }`}>
              <div>
                <div className={`lendet-text-14 ${
                  ectsStatus === "ok" ? "lendet-text-15"
                  : ectsStatus === "over" ? "lendet-text-16"
                  : "lendet-text-17"
                }`}>
                  ECTS të zgjedhura: {totalECTS} / 30
                </div>
                <div className={`lendet-text-18 ${
                  ectsStatus === "ok" ? "lendet-text-19"
                  : ectsStatus === "over" ? "lendet-text-20"
                  : "lendet-text-21"
                }`}>
                  {ectsStatus === "ok"
                    ? "Perfekt! Mund të regjistroheni."
                    : ectsStatus === "over"
                    ? `Tejkaloni me ${totalECTS - 30} ECTS. Hiqni disa zgjedhore.`
                    : `Të nevojshme edhe ${30 - totalECTS} ECTS për të plotësuar kriterin.`}
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="lendet-dot-2">
                <div
                  className={`lendet-box-22 ${
                    ectsStatus === "ok" ? "lendet-grade-color-2"
                    : ectsStatus === "over" ? "lendet-box-23"
                    : "lendet-grade-color-3"
                  }`}
                  style={{ width: `${Math.min(100, (totalECTS / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* Two-column layout */}
            <div className="lendet-grid-3">
              {/* Obligative */}
              <div>
                <div className="lendet-row-11">
                  <h2 className="lendet-title-3">Lëndë Obligative</h2>
                  <span className="lendet-text-22">— pararegjistruar ({OBL_ECTS} ECTS)</span>
                </div>
                <div className="lendet-box-24">
                  {regObl.map((c) => (
                    <RegCourseCard key={c.id} course={c} checked={true} disabled={true} />
                  ))}
                  {regObl.length === 0 && (
                    <p className="lendet-text-23">Asnjë lëndë obligative e gjetur</p>
                  )}
                </div>
              </div>

              {/* Zgjedhore */}
              <div>
                <div className="lendet-row-11">
                  <h2 className="lendet-title-3">Lëndë Zgjedhore</h2>
                  <span className="lendet-text-22">— zgjidhni lirisht</span>
                </div>
                <div className="lendet-box-24">
                  {regZgj.map((c) => (
                    <RegCourseCard
                      key={c.id}
                      course={c}
                      checked={selectedZgjedhore.has(c.id)}
                      onToggle={() => toggleZgjedhore(c.id)}
                    />
                  ))}
                  {regZgj.length === 0 && (
                    <p className="lendet-text-23">Asnjë lëndë zgjedhore e gjetur</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              disabled={ectsStatus !== "ok"}
              className="lendet-btn-11"
            >
              {ectsStatus === "ok" ? "Regjistro Lëndët" : `Regjistro Lëndët (${totalECTS}/30 ECTS)`}
            </button>
          </div>
        )}
      </div>

      {/* Anulo confirmation modal */}
      {anuloConfirmId !== null && (
        <div className="lendet-overlay">
          <div className="lendet-stack-2">
            <div className="lendet-stack-3">
              <div className="lendet-avatar">
                <AlertTriangle size={24} className="lendet-text-16" />
              </div>
              <h3 className="lendet-heading">Anulo Paraqitjen</h3>
              <p className="lendet-text-24">
                A jeni i sigurt që doni të anuloni paraqitjen e provimit? Kjo kërkesë nuk mund të kthehet prapa.
              </p>
            </div>
            <div className="lendet-row-12">
              <button
                onClick={() => setAnuloConfirmId(null)}
                className="lendet-btn-12"
              >
                Kthehu
              </button>
              <button
                onClick={handleConfirmAnulim}
                className="lendet-btn-13"
              >
                Po, Anulo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

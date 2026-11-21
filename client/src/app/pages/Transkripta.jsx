import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  CheckCircle2,
  XCircle,
  X,
  Star,
  Filter,
  CalendarRange,
  History,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SmartSearch } from "../components/SmartSearch";
import { transcript as allResults } from "../data/student";
import "./Transkripta.css";

const GRADE_COLORS = {
  "Nota 6":  "#93C5FD",
  "Nota 7":  "#7C3AED",
  "Nota 8":  "#3B82F6",
  "Nota 9":  "#EF4444",
  "Nota 10": "#22C55E",
};

function buildPieData(results) {
  const counts = {
    "Nota 6":  0,
    "Nota 7":  0,
    "Nota 8":  0,
    "Nota 9":  0,
    "Nota 10": 0,
  };
  results.forEach((r) => {
    if (r.nota !== null) {
      const key = `Nota ${r.nota}`;
      if (key in counts) counts[key]++;
    }
  });
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));
}

function getNotaBg(nota) {
  if (nota === null) return "transkripta-nota-bg";
  if (nota >= 9)     return "transkripta-nota-bg-2";
  if (nota >= 7)     return "transkripta-nota-bg-3";
  if (nota >= 6)     return "transkripta-nota-bg-4";
  return "transkripta-nota-bg-5";
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = (props) => {
  const { cx, cy, midAngle, outerRadius, percent, fill, index, name } = props;
  if (percent < 0.04) return null;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 4) * cos;
  const sy = cy + (outerRadius + 4) * sin;
  const mx = cx + (outerRadius + 14) * cos;
  const my = cy + (outerRadius + 14) * sin;
  const ex = mx + (cos >= 0 ? 6 : -6);
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g key={`label-${name ?? "n"}-${index ?? 0}`}>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={ex} cy={ey} r={1.8} fill={fill} />
      <text x={ex + (cos >= 0 ? 4 : -4)} y={ey} textAnchor={textAnchor} dominantBaseline="central" fill={fill} fontSize={11} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--tooltip-bg, #fff)", border: "1px solid #E5E5EA", borderRadius: 10, padding: "8px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{payload[0].name}</p>
      <p style={{ fontSize: 12, color: "#8E8E93", margin: "2px 0 0" }}>{payload[0].value} provime</p>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="transkripta-row">
      {payload.map((entry, i) => (
        <div key={`legend-${i}-${entry.value}`} className="transkripta-row-2">
          <span className="transkripta-dot" style={{ backgroundColor: entry.color }} />
          <span className="transkripta-text">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const sessions = ["Të gjitha", "Qershor 2026", "Janar 2026", "Qershor 2025", "Janar 2025", "Qershor 2024"];
const GRADE_OPTIONS = [6, 7, 8, 9, 10];

export function Transkripta() {
  const [searchTerm, setSearchTerm]           = useState("");
  const [selectedSession, setSelectedSession] = useState("Të gjitha");
  const [activeFilter, setActiveFilter]       = useState("all");
  const [currentPage, setCurrentPage]         = useState(1);
  const rowsPerPage = 8;

  // Advanced filter state
  const [filterOpen, setFilterOpen]           = useState(false);
  const [pendingLendet, setPendingLendet]     = useState(new Set());
  const [pendingNotat, setPendingNotat]       = useState(new Set());
  const [activeLendet, setActiveLendet]       = useState(new Set());
  const [activeNotat, setActiveNotat]         = useState(new Set());
  const filterRef                             = useRef(null);

  const allCourses = useMemo(() => [...new Set(allResults.map((r) => r.lenda))], []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const openFilter = () => {
    setPendingLendet(new Set(activeLendet));
    setPendingNotat(new Set(activeNotat));
    setFilterOpen(true);
  };

  const applyAdvanced = () => {
    setActiveLendet(new Set(pendingLendet));
    setActiveNotat(new Set(pendingNotat));
    setCurrentPage(1);
    setFilterOpen(false);
  };

  const clearAdvanced = () => {
    setPendingLendet(new Set());
    setPendingNotat(new Set());
  };

  const removeActiveLenda = (lenda) => {
    setActiveLendet((prev) => { const n = new Set(prev); n.delete(lenda); return n; });
    setCurrentPage(1);
  };

  const removeActiveNota = (nota) => {
    setActiveNotat((prev) => { const n = new Set(prev); n.delete(nota); return n; });
    setCurrentPage(1);
  };

  const activeFilterCount = activeLendet.size + activeNotat.size;

  const togglePendingLenda = (lenda) => {
    setPendingLendet((prev) => {
      const n = new Set(prev);
      n.has(lenda) ? n.delete(lenda) : n.add(lenda);
      return n;
    });
  };

  const togglePendingNota = (nota) => {
    setPendingNotat((prev) => {
      const n = new Set(prev);
      n.has(nota) ? n.delete(nota) : n.add(nota);
      return n;
    });
  };

  const passed     = allResults.filter((r) => r.nota !== null);
  const remaining  = allResults.filter((r) => r.nota === null);
  const avgGrade   = passed.length
    ? (passed.reduce((acc, r) => acc + (r.nota ?? 0), 0) / passed.length).toFixed(2)
    : "—";
  const totalEcts  = passed.reduce((acc, r) => acc + r.ects, 0);
  const highGrade  = passed.length ? Math.max(...passed.map((r) => r.nota ?? 0)) : 0;
  const lowGrade   = passed.length ? Math.min(...passed.map((r) => r.nota ?? 0)) : 0;

  const highestCount = passed.filter((r) => r.nota === highGrade).length;
  const lowestCount  = passed.filter((r) => r.nota === lowGrade).length;

  const applyChipFilter = (r) => {
    switch (activeFilter) {
      case "highest": return r.nota === highGrade;
      case "lowest":  return r.nota === lowGrade;
      case "passed":  return r.nota !== null;
      case "failed":  return r.nota === null;
      default:        return true;
    }
  };

  const filtered = allResults.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.lenda.toLowerCase().includes(q) ||
      r.prof.toLowerCase().includes(q) ||
      r.kodi.toLowerCase().includes(q);
    const matchSession = selectedSession === "Të gjitha" || r.sesioni === selectedSession;
    const matchLenda   = activeLendet.size === 0 || activeLendet.has(r.lenda);
    const matchNota    = activeNotat.size === 0 || (r.nota !== null && activeNotat.has(r.nota));
    return matchSearch && matchSession && applyChipFilter(r) && matchLenda && matchNota;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated  = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const pieData    = buildPieData(allResults);

  const stats = [
    { label: "Nota mesatare", value: avgGrade, icon: TrendingUp, iconCls: "transkripta-icon-color", bgCls: "transkripta-bg" },
    { label: "Totali i kredive", value: `${totalEcts} ECTS`, icon: BookOpen, iconCls: "transkripta-icon-color-2", bgCls: "transkripta-bg-2" },
    { label: "Provime të kaluara", value: `${passed.length}`, icon: CheckCircle2, iconCls: "transkripta-icon-color-3", bgCls: "transkripta-bg-3" },
  ];

  const filterChips = [
    { key: "highest", label: "Nota më e lartë",  value: highGrade,        count: highestCount,   icon: TrendingUp,   color: "green" },
    { key: "lowest",  label: "Nota më e ulët",   value: lowGrade,         count: lowestCount,    icon: TrendingDown, color: "red"   },
    { key: "passed",  label: "Lëndë të kaluara", value: passed.length,    count: null,           icon: CheckCircle2, color: "green" },
    { key: "failed",  label: "Lëndë të mbetura", value: remaining.length, count: null,           icon: XCircle,      color: "red"   },
  ];

  const handleFilterClick = (key) => {
    setActiveFilter((prev) => (prev === key ? "all" : key));
    setCurrentPage(1);
  };

  const lastSubjects = useMemo(
    () => allResults.slice(0, 2).map((r) => r.lenda),
    []
  );

  const searchSuggestions = [
    { label: "Lëndët me notën 10",       icon: Star },
    { label: "Lëndët e semestrit aktual", icon: CalendarRange },
    { label: "Lëndët e kaluara",          icon: CheckCircle2 },
    { label: "Lëndët e mbetura",          icon: XCircle },
    ...lastSubjects.map((l) => ({ label: l, icon: History })),
  ];

  const hasActiveChips = activeLendet.size > 0 || activeNotat.size > 0;

  return (
    <div className="transkripta-box">
      <div className="transkripta-box-2">

        {/* TITLE */}
        <div>
          <h1 className="transkripta-title">
            Grafikoni dhe transkripta e notave!
          </h1>
          <p className="transkripta-text-2">
            Viti akademik 2025/2026
          </p>
        </div>

        {/* TOP ROW: DONUT (40%) + STATS (60%) */}
        <div className="transkripta-grid">

          {/* DONUT — 2/5 */}
          <div className="transkripta-stack">
            <div className="transkripta-box-3">
              <h2 className="transkripta-title-2">
                Shpërndarja e notave
              </h2>
              <p className="transkripta-text-3">
                Bazuar në të gjitha provimet e kryera
              </p>
            </div>
            <div className="transkripta-row-3">
              <div style={{ width: 280, height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 8, right: 28, bottom: 8, left: 28 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="value"
                      label={renderCustomLabel}
                      labelLine={false}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={`cell-${i}-${entry.name}`} fill={GRADE_COLORS[entry.name] ?? "#8E8E93"} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} verticalAlign="bottom" wrapperStyle={{ paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* STATS — 3/5, stacked vertically */}
          <div className="transkripta-grid-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="transkripta-card"
              >
                <div className={`transkripta-icon-box ${stat.bgCls}`}>
                  <stat.icon size={22} className={stat.iconCls} />
                </div>
                <div className="transkripta-box-4">
                  <div className="transkripta-text-4">
                    {stat.value}
                  </div>
                  <div className="transkripta-text-5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REZULTATET — interactive filter chips */}
        <div className="transkripta-box-5">
          <div className="transkripta-row-4">
            <div>
              <h2 className="transkripta-title-2">
                Rezultatet
              </h2>
              <p className="transkripta-text-3">
                Klikoni një kartë për të filtruar tabelën
              </p>
            </div>
            <button
              onClick={() => { setActiveFilter("all"); setCurrentPage(1); }}
              className={`transkripta-btn ${
                activeFilter === "all"
                  ? "transkripta-btn-2"
                  : "transkripta-btn-3"
              }`}
            >
              <Filter size={12} />
              Të gjitha
            </button>
          </div>
          <div className="transkripta-grid-3">
            {filterChips.map((m) => {
              const isGreen = m.color === "green";
              const isActive = activeFilter === m.key;
              const iconColorCls = isGreen ? "transkripta-icon-color-cls" : "transkripta-icon-color-cls-2";
              const iconBgCls    = isGreen ? "transkripta-icon-bg-cls" : "transkripta-icon-bg-cls-2";
              const valueCls     = isGreen ? "transkripta-icon-color-cls" : "transkripta-icon-color-cls-2";

              return (
                <button
                  key={m.key}
                  onClick={() => handleFilterClick(m.key)}
                  className={`transkripta-btn-4 ${
                    isActive
                      ? "transkripta-btn-5"
                      : "transkripta-btn-6"
                  }`}
                >
                  {/* Count badge — only for "highest" and "lowest" chips */}
                  {m.count !== null && (
                    <span className="transkripta-badge">
                      {m.count}
                    </span>
                  )}

                  {isActive && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setActiveFilter("all"); setCurrentPage(1); }}
                      className="transkripta-dot-2"
                      aria-label="Hiq filtrin"
                    >
                      <X size={12} />
                    </span>
                  )}

                  <div className={`transkripta-icon-box-2 ${iconBgCls}`}>
                    <m.icon size={18} className={iconColorCls} />
                  </div>
                  <div className={`transkripta-text-6 ${valueCls}`}>
                    {m.value}
                  </div>
                  <div className="transkripta-text-7">
                    {m.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH + SESSION FILTER */}
        <div className="transkripta-card-2">
          <div className="transkripta-stack-2">
            <div className="transkripta-box-6">
              <SmartSearch
                value={searchTerm}
                onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                suggestions={searchSuggestions}
                placeholder="Kërko lëndën ose profesorin..."
                headerLabel="Sugjerime"
                size="sm"
              />
            </div>
            <div className="transkripta-row-5">
              {sessions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSession(s); setCurrentPage(1); }}
                  className={`transkripta-btn-7 ${
                    selectedSession === s
                      ? "transkripta-btn-8"
                      : "transkripta-btn-3"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GRADES TABLE */}
        <div className="transkripta-box-7">
          <div className="transkripta-box-8">
            <div className="transkripta-row-6">
              <div>
                <h2 className="transkripta-title-3">
                  Rezultatet e lëndëve
                </h2>
                <p className="transkripta-text-3">
                  {filtered.length} lëndë gjithsej
                </p>
              </div>

              {/* Filter button + dropdown */}
              <div className="transkripta-box-9" ref={filterRef}>
                <button
                  onClick={filterOpen ? () => setFilterOpen(false) : openFilter}
                  className={`transkripta-btn-9 ${
                    filterOpen || activeFilterCount > 0
                      ? "transkripta-btn-10"
                      : "transkripta-btn-11"
                  }`}
                >
                  <Filter size={13} />
                  Filtro
                  {activeFilterCount > 0 && (
                    <span className="transkripta-badge-2">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Dropdown panel */}
                {filterOpen && (
                  <div className="transkripta-popup">
                    <div className="transkripta-box-10">

                      {/* Filter by course */}
                      <div>
                        <p className="transkripta-text-8">
                          Filtro sipas lëndës
                        </p>
                        <div className="transkripta-scroll">
                          {allCourses.map((lenda) => {
                            const checked = pendingLendet.has(lenda);
                            return (
                              <label
                                key={lenda}
                                className="transkripta-label"
                              >
                                <span
                                  className={`transkripta-text-9 ${
                                    checked
                                      ? "transkripta-text-10"
                                      : "transkripta-text-11"
                                  }`}
                                  onClick={() => togglePendingLenda(lenda)}
                                >
                                  {checked && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  )}
                                </span>
                                <span
                                  className="transkripta-text-12"
                                  onClick={() => togglePendingLenda(lenda)}
                                >
                                  {lenda}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="transkripta-box-11" />

                      {/* Filter by grade */}
                      <div>
                        <p className="transkripta-text-8">
                          Filtro sipas notës
                        </p>
                        <div className="transkripta-row-7">
                          {GRADE_OPTIONS.map((nota) => {
                            const selected = pendingNotat.has(nota);
                            return (
                              <button
                                key={nota}
                                onClick={() => togglePendingNota(nota)}
                                className={`transkripta-btn-12 ${
                                  selected
                                    ? "transkripta-btn-13"
                                    : "transkripta-btn-14"
                                }`}
                              >
                                {nota}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="transkripta-row-8">
                      <button
                        onClick={clearAdvanced}
                        className="transkripta-btn-15"
                      >
                        Pastro filtrat
                      </button>
                      <button
                        onClick={applyAdvanced}
                        className="transkripta-btn-16"
                      >
                        Apliko
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveChips && (
            <div className="transkripta-row-9">
              {[...activeNotat].sort().map((nota) => (
                <span
                  key={`nota-${nota}`}
                  className="transkripta-text-13"
                >
                  Notë: {nota}
                  <button
                    onClick={() => removeActiveNota(nota)}
                    className="transkripta-btn-17"
                    aria-label={`Hiq notën ${nota}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {[...activeLendet].sort().map((lenda) => (
                <span
                  key={`lenda-${lenda}`}
                  className="transkripta-text-14"
                >
                  <span className="transkripta-text-15">Lënda: {lenda}</span>
                  <button
                    onClick={() => removeActiveLenda(lenda)}
                    className="transkripta-btn-18"
                    aria-label={`Hiq lëndën ${lenda}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setActiveLendet(new Set()); setActiveNotat(new Set()); setCurrentPage(1); }}
                className="transkripta-btn-19"
              >
                Pastro të gjitha
              </button>
            </div>
          )}

          {/* Desktop table */}
          <div className="transkripta-scroll-2">
            <table className="transkripta-table">
              <thead>
                <tr className="transkripta-row-10">
                  {[
                    { label: "Nr", align: "left" },
                    { label: "Kodi i lëndës", align: "left" },
                    { label: "Lënda", align: "left" },
                    { label: "Profesori", align: "left" },
                    { label: "Nota", align: "center" },
                    { label: "ECTS", align: "center" },
                    { label: "Data e provimit", align: "left" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      className={`transkripta-th ${h.align === "center" ? "transkripta-th-2" : h.align === "right" ? "transkripta-th-3" : "transkripta-th-4"}`}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr
                    key={r.nr}
                    className={`transkripta-row-11 ${
                      i % 2 === 0 ? "transkripta-row-12" : "transkripta-row-13"
                    } ${
                      i < paginated.length - 1 ? "transkripta-row-14" : ""
                    }`}
                  >
                    <td className="transkripta-cell">{r.nr}</td>
                    <td className="transkripta-cell-2">{r.kodi}</td>
                    <td className="transkripta-cell-3">
                      <span className="transkripta-text-16">{r.lenda}</span>
                    </td>
                    <td className="transkripta-cell-4">{r.prof}</td>
                    <td className="transkripta-cell-5">
                      <span className={`transkripta-dot-3 ${getNotaBg(r.nota)}`}>
                        {r.nota ?? "—"}
                      </span>
                    </td>
                    <td className="transkripta-cell-6">{r.ects}</td>
                    <td className="transkripta-cell-7">{r.data}</td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="transkripta-cell-8">
                      Nuk u gjet asnjë rezultat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="transkripta-box-12">
            {paginated.map((r, i) => (
              <div
                key={r.nr}
                className={`transkripta-row-15 ${
                  i % 2 === 0 ? "transkripta-row-12" : "transkripta-row-13"
                }`}
              >
                <span className={`transkripta-dot-4 ${getNotaBg(r.nota)}`}>
                  {r.nota ?? "—"}
                </span>
                <div className="transkripta-box-6">
                  <div className="transkripta-text-17">{r.lenda}</div>
                  <div className="transkripta-text-3">{r.prof} · {r.kodi}</div>
                  <div className="transkripta-row-16">
                    <span className="transkripta-text-18">{r.ects} ECTS</span>
                    <span className="transkripta-text-18">{r.data}</span>
                  </div>
                </div>
              </div>
            ))}
            {paginated.length === 0 && (
              <div className="transkripta-box-13">
                Nuk u gjet asnjë rezultat
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="transkripta-row-17">
              <span className="transkripta-text-18">
                {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} nga {filtered.length}
              </span>
              <div className="transkripta-row-18">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="transkripta-btn-20"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="transkripta-btn-20"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

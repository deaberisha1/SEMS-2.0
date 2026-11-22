import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

import "./AttendanceDetail.css";

function parseDuration(checkIn, checkOut, statusi) {
  if (statusi === "Mungesë" || checkIn === "—") return { minutes: 0, label: "—" };
  if (checkOut === "—" || checkOut === "Nuk ka dalje") return { minutes: 30, label: "Pa dalje" };
  const [h1, m1] = checkIn.split(":").map(Number);
  const [h2, m2] = checkOut.split(":").map(Number);
  const mins = h2 * 60 + m2 - (h1 * 60 + m1);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return { minutes: mins, label: `${h}h ${m}min` };
}

function durationColor(mins) {
  if (mins >= 75) return "attendance-detail-duration-color";
  if (mins >= 45) return "attendance-detail-duration-color-2";
  return "attendance-detail-duration-color-3";
}

function TypeBadge({ lloji }) {
  const cfg = {
    L:   { label: "L",   cls: "attendance-detail-variant" },
    U:   { label: "U",   cls: "attendance-detail-variant-2" },
    Lab: { label: "Lab", cls: "attendance-detail-variant-3" },
  }[lloji];
  return (
    <span className={`attendance-detail-badge ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ statusi }) {
  const cfg = {
    Prezent:    { label: "Prezent ✓",  cls: "attendance-detail-variant-4" },
    "Pjesërisht": { label: "Pjesërisht", cls: "attendance-detail-variant-5" },
    Mungesë:    { label: "Mungesë ✗",  cls: "attendance-detail-variant-6" },
  }[statusi];
  return (
    <span className={`attendance-detail-badge-2 ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

const filterChips = [
  { key: "all", label: "Të gjitha" },
  { key: "Prezent", label: "Prezent" },
  { key: "Pjesërisht", label: "Pjesërisht" },
  { key: "Mungesë", label: "Mungesë" },
];

const ROWS_PER_PAGE = 10;

export function AttendanceDetail({
  sessions,
  subtitle,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("nr");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = sessions.slice();
    if (filter !== "all") rows = rows.filter((r) => r.statusi === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.lenda.toLowerCase().includes(q) ||
          r.profAsist.toLowerCase().includes(q) ||
          r.salla.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nr") cmp = a.nr - b.nr;
      else if (sortKey === "data") {
        const [da, ma, ya] = a.data.split(".").map(Number);
        const [db, mb, yb] = b.data.split(".").map(Number);
        cmp = new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
      } else if (sortKey === "statusi") {
        const order = { Prezent: 0, "Pjesërisht": 1, Mungesë: 2 };
        cmp = order[a.statusi] - order[b.statusi];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [sessions, filter, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const counts = useMemo(() => {
    const c = { total: sessions.length, p: 0, pj: 0, m: 0 };
    sessions.forEach((s) => {
      if (s.statusi === "Prezent") c.p++;
      else if (s.statusi === "Pjesërisht") c.pj++;
      else c.m++;
    });
    const pct = c.total ? Math.round(((c.p + 0.5 * c.pj) / c.total) * 100) : 0;
    return { ...c, pct };
  }, [sessions]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  return (
    <div className="attendance-detail-box">
      {/* Header */}
      <div className="attendance-detail-row">
        <div>
          <h3 className="attendance-detail-heading">
            Detajet e Vijueshmërisë
          </h3>
          <p className="attendance-detail-text">
            {subtitle ?? "Çdo orë e regjistruar gjatë semestrit"}
          </p>
        </div>
        <button className="attendance-detail-btn">
          <Download size={14} /> Eksporto (PDF/Excel)
        </button>
      </div>

      {/* Mobile summary strip */}
      <div className="attendance-detail-box-2">
        <div className="attendance-detail-row-2">
          <span className="attendance-detail-text-2">{counts.total} orë gjithsej</span>
          <span className="attendance-detail-text-3">
            <span className="attendance-detail-dot" />
            {counts.p} Prezent
          </span>
          <span className="attendance-detail-text-4">
            <span className="attendance-detail-dot-2" />
            {counts.pj} Pjesërisht
          </span>
          <span className="attendance-detail-text-5">
            <span className="attendance-detail-dot-3" />
            {counts.m} Mungesë
          </span>
          <span className="attendance-detail-text-2">{counts.pct}%</span>
        </div>
      </div>

      {/* Search + Filters (sticky on mobile) */}
      <div className="attendance-detail-stack">
        <div className="attendance-detail-card">
          <Search size={14} className="attendance-detail-icon" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Kërko sipas lëndës..."
            className="attendance-detail-input"
          />
        </div>
        <div className="attendance-detail-row-3">
          {filterChips.map((c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => { setFilter(c.key); setPage(1); }}
                className={`attendance-detail-btn-2 ${
                  active
                    ? "attendance-detail-btn-3"
                    : "attendance-detail-btn-4"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="attendance-detail-scroll">
        <table className="attendance-detail-table">
          <caption className="sr-only">Detajet e vijueshmërisë</caption>
          <thead>
            <tr className="attendance-detail-row-4">
              {[
                { key: "nr",   label: "Nr.",   sortable: true },
                { key: "data", label: "Data",  sortable: true },
                { key: null,              label: "Dita",  sortable: false },
                { key: null,              label: "Lënda", sortable: false },
                { key: null,              label: "Profesori/Asistenti", sortable: false },
                { key: null,              label: "L/U",   sortable: false },
                { key: null,              label: "Check-in",  sortable: false },
                { key: null,              label: "Check-out", sortable: false },
                { key: null,              label: "Kohëzgjatja", sortable: false },
                { key: null,              label: "Salla", sortable: false },
                { key: "statusi", label: "Statusi", sortable: true },
              ].map((h) => (
                <th
                  scope="col"
                  key={h.label}
                  onClick={() => h.sortable && h.key && toggleSort(h.key)}
                  className={`attendance-detail-th ${
                    h.sortable ? "attendance-detail-th-2" : ""
                  }`}
                >
                  <span className="attendance-detail-text-6">
                    {h.label}
                    {h.sortable && <ArrowUpDown size={10} className="attendance-detail-icon-2" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => {
              const dur = parseDuration(row.checkIn, row.checkOut, row.statusi);
              const isMung = row.statusi === "Mungesë";
              return (
                <tr
                  key={row.nr}
                  className={`attendance-detail-row-5 ${
                    isMung
                      ? "attendance-detail-row-6"
                      : i % 2 === 1
                      ? "attendance-detail-row-7"
                      : ""
                  }`}
                >
                  <td className="attendance-detail-cell">{row.nr}</td>
                  <td className="attendance-detail-cell-2">{row.data}</td>
                  <td className="attendance-detail-cell-2">{row.dita}</td>
                  <td className="attendance-detail-cell-3">{row.lenda}</td>
                  <td className="attendance-detail-cell-2">{row.profAsist}</td>
                  <td className="attendance-detail-cell-4"><TypeBadge lloji={row.lloji} /></td>
                  <td className="attendance-detail-cell-5">{row.checkIn}</td>
                  <td className={`attendance-detail-cell-6 ${
                    row.checkOut === "Nuk ka dalje"
                      ? "attendance-detail-cell-7"
                      : "attendance-detail-cell-8"
                  }`}>{row.checkOut}</td>
                  <td className={`attendance-detail-cell-9 ${durationColor(dur.minutes)}`}>{dur.label}</td>
                  <td className="attendance-detail-cell-2">{row.salla}</td>
                  <td className="attendance-detail-cell-4"><StatusBadge statusi={row.statusi} /></td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={11} className="attendance-detail-cell-10">
                  Nuk ka rezultate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Timeline Cards */}
      <div className="attendance-detail-text-7">
        {paginated.map((row) => {
          const dur = parseDuration(row.checkIn, row.checkOut, row.statusi);
          const borderColor =
            row.statusi === "Prezent"
              ? "attendance-detail-border-color"
              : row.statusi === "Pjesërisht"
              ? "attendance-detail-border-color-2"
              : "attendance-detail-border-color-3";
          const bg = row.statusi === "Mungesë" ? "attendance-detail-row-6" : "";
          return (
            <div
              key={row.nr}
              className={`attendance-detail-box-3 ${borderColor} ${bg}`}
            >
              <div className="attendance-detail-row-8">
                <div className="attendance-detail-row-9">
                  <span className="attendance-detail-text-8">{row.data.slice(0, 5)}</span>
                  <span className="attendance-detail-text-9">{row.dita}</span>
                </div>
                <TypeBadge lloji={row.lloji} />
              </div>
              <div className="attendance-detail-text-10">
                <div className="attendance-detail-text-11">{row.lenda}</div>
                <div className="attendance-detail-text-12">{row.profAsist}</div>
              </div>
              <div className="attendance-detail-row-10">
                <div className="attendance-detail-row-11">
                  <span className="attendance-detail-badge-3">
                    <Clock size={10} /> {row.checkIn}
                  </span>
                  <span className={`attendance-detail-badge-4 ${
                    row.checkOut === "Nuk ka dalje" || row.checkOut === "—"
                      ? "attendance-detail-variant-5"
                      : "attendance-detail-btn-4"
                  }`}>
                    <Clock size={10} />
                    {row.checkOut === "Nuk ka dalje" ? "Pa dalje" : row.checkOut}
                  </span>
                  <span className="attendance-detail-badge-3">
                    <MapPin size={10} /> {row.salla}
                  </span>
                  {dur.label !== "—" && (
                    <span className={`attendance-detail-text-13 ${durationColor(dur.minutes)}`}>{dur.label}</span>
                  )}
                </div>
                <StatusBadge statusi={row.statusi} />
              </div>
            </div>
          );
        })}
        {paginated.length === 0 && (
          <div className="attendance-detail-box-4">
            Nuk ka rezultate.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > ROWS_PER_PAGE && (
        <div className="attendance-detail-row-12">
          <span className="attendance-detail-text-9">
            {(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} nga {filtered.length}
          </span>
          <div className="attendance-detail-row-13">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="attendance-detail-btn-5"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="attendance-detail-btn-5"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

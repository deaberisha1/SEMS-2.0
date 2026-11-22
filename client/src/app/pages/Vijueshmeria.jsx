import { useState } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceDetail } from "../components/AttendanceDetail";
import { attendanceSemesters as semestrat, attendanceCourses as lendetOptions, attendanceSummary as allData, attendanceLogs as detailedLogs } from "../data/student";
import "./Vijueshmeria.css";

function getStatus(perqindja) {
  if (perqindja >= 80) return "ok";
  if (perqindja >= 60) return "paralajmerim";
  return "kritike";
}

const statusConfig = {
  ok: {
    label: "Rregullt",
    icon: CheckCircle2,
    color: "vijueshmeria-color",
    bg: "vijueshmeria-bg",
  },
  paralajmerim: {
    label: "Paralajmërim",
    icon: AlertTriangle,
    color: "vijueshmeria-color-2",
    bg: "vijueshmeria-bg-2",
  },
  kritike: {
    label: "Kritike",
    icon: XCircle,
    color: "vijueshmeria-color-3",
    bg: "vijueshmeria-bg-3",
  },
};

function PercentBar({ value }) {
  const color =
    value >= 80
      ? "vijueshmeria-color-4"
      : value >= 60
      ? "vijueshmeria-color-5"
      : "vijueshmeria-color-6";
  return (
    <div className="vijueshmeria-row">
      <div className="vijueshmeria-box">
        <div className={`vijueshmeria-box-2 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span
        className={`vijueshmeria-text ${
          value >= 80
            ? "vijueshmeria-color"
            : value >= 60
            ? "vijueshmeria-color-2"
            : "vijueshmeria-color-3"
        }`}
      >
        {value}%
      </span>
    </div>
  );
}

function StyledSelect({
  id,
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="vijueshmeria-stack">
      <label htmlFor={id} className="vijueshmeria-label">
        {label}
      </label>
      <div className="vijueshmeria-box-3">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="vijueshmeria-select"
        >
          <option value="" disabled hidden>
            Zgjedh
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="vijueshmeria-icon"
        />
      </div>
    </div>
  );
}

const ROWS_PER_PAGE = 5;

export function Vijueshmeria() {
  const [semestri, setSemestri] = useState("");
  const [lenda, setLenda] = useState("");
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLenda, setSelectedLenda] = useState(null);

  const handleKerko = () => {
    setSearched(true);
    setCurrentPage(1);
    setSelectedLenda(null);
  };

  const filtered = searched
    ? allData.filter((r) => {
        if (lenda && lenda !== "Të gjitha lëndët" && r.lenda !== lenda) return false;
        return true;
      })
    : [];

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const criticalCount = filtered.filter((r) => getStatus(r.perqindja) === "kritike").length;
  const warnCount = filtered.filter((r) => getStatus(r.perqindja) === "paralajmerim").length;
  const avgAtt = filtered.length
    ? Math.round(filtered.reduce((a, r) => a + r.perqindja, 0) / filtered.length)
    : null;

  return (
    <div className="vijueshmeria-box-4">
      <div className="vijueshmeria-box-5">

        {/* Header */}
        <div className="vijueshmeria-text-2">
          <h1 className="vijueshmeria-title">
            Vijueshmëria
          </h1>
          <p className="vijueshmeria-text-3">
            Kontrollo vijueshmërinë tuaj për çdo lëndë
          </p>
        </div>

        {/* Mobile Filter Card */}
        <div className="vijueshmeria-card">
          <label htmlFor="vijueshmeria-semestri" className="vijueshmeria-label-2">
            Semestri
          </label>
          <div className="vijueshmeria-box-3">
            <select
              id="vijueshmeria-semestri"
              value={semestri}
              onChange={(e) => setSemestri(e.target.value)}
              className="vijueshmeria-select-2"
            >
              <option value="" disabled hidden>Zgjedh</option>
              {semestrat.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
            <ChevronDown size={16} className="vijueshmeria-icon" />
          </div>

          <div className="vijueshmeria-box-6" />

          <label htmlFor="vijueshmeria-lenda" className="vijueshmeria-label-2">
            Lënda
          </label>
          <div className="vijueshmeria-box-3">
            <select
              id="vijueshmeria-lenda"
              value={lenda}
              onChange={(e) => setLenda(e.target.value)}
              className="vijueshmeria-select-2"
            >
              <option value="" disabled hidden>Zgjedh</option>
              {lendetOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
            </select>
            <ChevronDown size={16} className="vijueshmeria-icon" />
          </div>

          <div className="vijueshmeria-box-7" />

          <button
            onClick={handleKerko}
            disabled={!semestri}
            className="vijueshmeria-btn"
          >
            Kërko
          </button>
        </div>

        {/* Desktop Filter Card */}
        <div className="vijueshmeria-card-2">
          <div className="vijueshmeria-stack-2">
            <StyledSelect
              id="vijueshmeria-filtri-semestri"
              label="Semestri"
              value={semestri}
              onChange={setSemestri}
              options={semestrat}
            />
            <StyledSelect
              id="vijueshmeria-filtri-lenda"
              label="Lënda"
              value={lenda}
              onChange={setLenda}
              options={lendetOptions}
            />
            <button
              onClick={handleKerko}
              disabled={!semestri}
              className="vijueshmeria-btn-2"
            >
              Kërko
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Summary stats */}
            {filtered.length > 0 && (
              <div className="vijueshmeria-grid">
                <div className="vijueshmeria-card-3">
                  <div className="vijueshmeria-text-4">{avgAtt}%</div>
                  <div className="vijueshmeria-text-5">Mesatare</div>
                </div>
                <div className="vijueshmeria-card-3">
                  <div className="vijueshmeria-text-6">{warnCount}</div>
                  <div className="vijueshmeria-text-5">Paralajmërim</div>
                </div>
                <div className="vijueshmeria-card-3">
                  <div className="vijueshmeria-text-7">{criticalCount}</div>
                  <div className="vijueshmeria-text-5">Kritike</div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="vijueshmeria-box-8">
              {/* Desktop */}
              <div className="vijueshmeria-scroll">
                <table className="vijueshmeria-table">
                  <caption className="sr-only">Vijueshmëria sipas lëndëve</caption>
                  <thead>
                    <tr className="vijueshmeria-row-2">
                      <th scope="col" className="vijueshmeria-th">Nr</th>
                      <th scope="col" className="vijueshmeria-th">Lënda</th>
                      <th scope="col" className="vijueshmeria-th">Profesori</th>
                      <th scope="col" className="vijueshmeria-th-2">Gjithsej</th>
                      <th scope="col" className="vijueshmeria-th-2">I pranishëm</th>
                      <th scope="col" className="vijueshmeria-th-2">I munguar</th>
                      <th scope="col" className="vijueshmeria-th-3">Vijueshmëria</th>
                      <th scope="col" className="vijueshmeria-th">Statusi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r, i) => {
                      const statusKey = getStatus(r.perqindja);
                      const status = statusConfig[statusKey];
                      const StatusIcon = status.icon;
                      const isSelected = selectedLenda === r.lenda;
                      return (
                        <tr
                          key={r.nr}
                          onClick={() => setSelectedLenda(isSelected ? null : r.lenda)}
                          className={`vijueshmeria-row-3 ${
                            isSelected ? "vijueshmeria-row-4" : "vijueshmeria-row-5"
                          } ${i === paginated.length - 1 ? "vijueshmeria-row-6" : ""}`}
                        >
                          <td className="vijueshmeria-cell">{r.nr}</td>
                          <td className="vijueshmeria-cell-2">
                            <div className="vijueshmeria-text-8">{r.lenda}</div>
                            <div className="vijueshmeria-text-9">{r.kodi}</div>
                          </td>
                          <td className="vijueshmeria-cell-3">{r.prof}</td>
                          <td className="vijueshmeria-cell-4">{r.gjithsej}</td>
                          <td className="vijueshmeria-cell-5">
                            <span className="vijueshmeria-dot">
                              {r.pranishem}
                            </span>
                          </td>
                          <td className="vijueshmeria-cell-5">
                            <span className={`vijueshmeria-dot-2 ${r.munguar > 0 ? "vijueshmeria-text-10" : "vijueshmeria-text-11"}`}>
                              {r.munguar}
                            </span>
                          </td>
                          <td className="vijueshmeria-cell-2">
                            <PercentBar value={r.perqindja} />
                          </td>
                          <td className="vijueshmeria-cell-2">
                            <span className={`vijueshmeria-badge ${status.color} ${status.bg}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {paginated.length === 0 && (
                      <tr>
                        <td colSpan={8} className="vijueshmeria-cell-6">
                          Nuk u gjet asnjë të dhënë për filtrat e zgjedhura
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="vijueshmeria-box-9">
                {paginated.map((r) => {
                  const statusKey = getStatus(r.perqindja);
                  const status = statusConfig[statusKey];
                  const StatusIcon = status.icon;
                  return (
                    <div key={r.nr} className="vijueshmeria-box-10">
                      <div className="vijueshmeria-row-7">
                        <div className="vijueshmeria-box-11">
                          <div className="vijueshmeria-text-12">{r.lenda}</div>
                          <div className="vijueshmeria-text-5">{r.prof} · {r.kodi}</div>
                        </div>
                        <span className={`vijueshmeria-badge-2 ${status.color} ${status.bg}`}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </div>
                      <div className="vijueshmeria-row-8">
                        <div className="vijueshmeria-text-13">
                          <span className="vijueshmeria-text-14">{r.pranishem}</span> prezent ·{" "}
                          <span className={`vijueshmeria-text-15 ${r.munguar > 0 ? "vijueshmeria-color-3" : "vijueshmeria-text-16"}`}>{r.munguar}</span> mungesë ·{" "}
                          {r.gjithsej} gjithsej
                        </div>
                      </div>
                      <PercentBar value={r.perqindja} />
                    </div>
                  );
                })}
                {paginated.length === 0 && (
                  <div className="vijueshmeria-cell-6">
                    Nuk u gjet asnjë të dhënë për filtrat e zgjedhura
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="vijueshmeria-row-9">
                  <span className="vijueshmeria-text-17">
                    {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} nga {filtered.length}
                  </span>
                  <div className="vijueshmeria-row-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="vijueshmeria-btn-3"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="vijueshmeria-btn-3"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* New attendance detail (desktop: when a course is selected) */}
            {selectedLenda && (
              <div className="vijueshmeria-box-12">
                <AttendanceDetail
                  subtitle={selectedLenda}
                  sessions={detailedLogs[selectedLenda] ?? detailedLogs["UX/UI Design"]}
                />
              </div>
            )}

            {/* Mobile timeline: always shown below the course summary list */}
            <div className="vijueshmeria-text-18">
              <AttendanceDetail
                subtitle={selectedLenda ?? "UX/UI Design"}
                sessions={detailedLogs[selectedLenda ?? "UX/UI Design"] ?? detailedLogs["UX/UI Design"]}
              />
            </div>

            {/* Critical warning banner */}
            {criticalCount > 0 && (
              <div className="vijueshmeria-card-4">
                <XCircle size={18} className="vijueshmeria-icon-2" />
                <div>
                  <div className="vijueshmeria-text-19">
                    {criticalCount} lëndë me vijueshmëri kritike
                  </div>
                  <div className="vijueshmeria-text-20">
                    Vijueshmëria nën 60% mund të rezultojë me ndalim nga provimi. Kontaktoni pedagogun përgjegjës.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChevronLeft, ChevronRight, Award, TrendingUp, BookOpen, CheckCircle2, Clock, XCircle, Star, CalendarRange } from "lucide-react";
import { SmartSearch } from "../components/SmartSearch";
import "./Rezultatet.css";

const allResults = [
  { nr: 1, kodi: "O-21", lenda: "Inxhinieria e Softuerit", prof: "Blerim Rexha", nota: 9, ects: 6, data: "20.01.2026", sesioni: "Janar 2026", statusi: "kaloi" },
  { nr: 2, kodi: "O-22", lenda: "Siguria në Internet", prof: "Blerim Rexha", nota: 10, ects: 6, data: "24.01.2026", sesioni: "Janar 2026", statusi: "kaloi" },
  { nr: 3, kodi: "Z-14", lenda: "Zhvillimi në Web", prof: "Kadri Sylejmani", nota: 10, ects: 5, data: "28.01.2026", sesioni: "Janar 2026", statusi: "kaloi" },
  { nr: 4, kodi: "O-19", lenda: "Sistemet Operative", prof: "Lule Ahmedi", nota: 8, ects: 6, data: "05.02.2026", sesioni: "Janar 2026", statusi: "kaloi" },
  { nr: 5, kodi: "O-18", lenda: "Rrjetet Kompjuterike", prof: "Kadri Sylejmani", nota: 9, ects: 6, data: "12.02.2026", sesioni: "Janar 2026", statusi: "kaloi" },
  { nr: 6, kodi: "O-23", lenda: "Inteligjenca Artificiale", prof: "Lule Ahmedi", nota: null, ects: 6, data: "—", sesioni: "Qershor 2026", statusi: "ne_pritje" },
  { nr: 7, kodi: "Z-17", lenda: "Menaxhimi i Projekteve", prof: "Blerim Rexha", nota: null, ects: 5, data: "—", sesioni: "Qershor 2026", statusi: "ne_pritje" },
  { nr: 8, kodi: "O-15", lenda: "Databazat", prof: "Lule Ahmedi", nota: 9, ects: 6, data: "18.06.2025", sesioni: "Qershor 2025", statusi: "kaloi" },
  { nr: 9, kodi: "O-12", lenda: "Algoritmet", prof: "Blerim Rexha", nota: 7, ects: 6, data: "22.06.2025", sesioni: "Qershor 2025", statusi: "kaloi" },
  { nr: 10, kodi: "Z-09", lenda: "Programimi i Lojërave", prof: "Kadri Sylejmani", nota: 10, ects: 5, data: "30.06.2025", sesioni: "Qershor 2025", statusi: "kaloi" },
  { nr: 11, kodi: "O-11", lenda: "Bazat e të Dhënave", prof: "Kadri Sylejmani", nota: 5, ects: 6, data: "15.07.2025", sesioni: "Qershor 2025", statusi: "nuk_kaloi" },
  { nr: 12, kodi: "O-07", lenda: "Programimi Objekt i Orientuar", prof: "Lule Ahmedi", nota: 9, ects: 6, data: "15.01.2025", sesioni: "Janar 2025", statusi: "kaloi" },
  { nr: 13, kodi: "O-05", lenda: "Arkitektura e Kompjuterëve", prof: "Blerim Rexha", nota: 8, ects: 6, data: "20.01.2025", sesioni: "Janar 2025", statusi: "kaloi" },
  { nr: 14, kodi: "O-02", lenda: "Matematikë Diskrete", prof: "Qefsere Gjonbalaj", nota: 6, ects: 6, data: "10.02.2025", sesioni: "Janar 2025", statusi: "kaloi" },
  { nr: 15, kodi: "O-01", lenda: "Matematika 1", prof: "Qefsere Gjonbalaj", nota: 6, ects: 7, data: "15.06.2024", sesioni: "Qershor 2024", statusi: "kaloi" },
  { nr: 16, kodi: "O-04", lenda: "Fizika 1", prof: "Milaim Zabeli", nota: 7, ects: 6, data: "22.06.2024", sesioni: "Qershor 2024", statusi: "kaloi" },
  { nr: 17, kodi: "O-03", lenda: "Qarqet Logjike", prof: "Milaim Zabeli", nota: 8, ects: 6, data: "28.06.2024", sesioni: "Qershor 2024", statusi: "kaloi" },
  { nr: 18, kodi: "Z-02", lenda: "Anglisht 1", prof: "Teuta Pllana", nota: 10, ects: 3, data: "05.07.2024", sesioni: "Qershor 2024", statusi: "kaloi" },
];

const sessions = ["Të gjitha", "Janar 2026", "Qershor 2026", "Qershor 2025", "Janar 2025", "Qershor 2024"];

function getNotaColor(nota) {
  if (nota === null) return "rezultatet-nota-color";
  if (nota >= 9) return "rezultatet-nota-color-2";
  if (nota >= 7) return "rezultatet-nota-color-3";
  if (nota >= 6) return "rezultatet-nota-color-4";
  return "rezultatet-nota-color-5";
}

function getNotaBg(nota) {
  if (nota === null) return "rezultatet-nota-bg";
  if (nota >= 9) return "rezultatet-nota-bg-2";
  if (nota >= 7) return "rezultatet-nota-bg-3";
  if (nota >= 6) return "rezultatet-nota-bg-4";
  return "rezultatet-nota-bg-5"; // nota 5
}

const statusConfig = {
  kaloi: { label: "Kaloi", icon: CheckCircle2, color: "rezultatet-nota-color-2" },
  ne_pritje: { label: "Në pritje", icon: Clock, color: "rezultatet-nota-color-4" },
  nuk_kaloi: { label: "Nuk kaloi", icon: XCircle, color: "rezultatet-nota-color-5" },
};

export function Rezultatet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("Të gjitha");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const filtered = allResults.filter((r) => {
    const matchSearch =
      r.lenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.prof.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kodi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSession = selectedSession === "Të gjitha" || r.sesioni === selectedSession;
    return matchSearch && matchSession;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const passed = allResults.filter((r) => r.statusi === "kaloi");
  const avgGrade = passed.length
    ? (passed.reduce((acc, r) => acc + (r.nota ?? 0), 0) / passed.length).toFixed(2)
    : "—";
  const totalEcts = passed.reduce((acc, r) => acc + r.ects, 0);
  const pending = allResults.filter((r) => r.statusi === "ne_pritje").length;
  const failed = allResults.filter((r) => r.statusi === "nuk_kaloi").length;

  return (
    <div className="rezultatet-box">
      <div className="rezultatet-box-2">

        {/* Header */}
        <div className="rezultatet-text">
          <h1 className="rezultatet-title">
            Rezultatet
          </h1>
          <p className="rezultatet-text-2">
            Viti akademik 2025/2026
          </p>
        </div>

        {/* Stats Cards */}
        <div className="rezultatet-grid">
          <div className="rezultatet-card">
            <div className="rezultatet-row">
              <div className="rezultatet-icon-box">
                <TrendingUp size={16} className="rezultatet-nota-color-2" />
              </div>
            </div>
            <div className="rezultatet-text-3">{avgGrade}</div>
            <div className="rezultatet-text-4">Mesatarja</div>
          </div>

          <div className="rezultatet-card">
            <div className="rezultatet-row">
              <div className="rezultatet-icon-box-2">
                <BookOpen size={16} className="rezultatet-nota-color-3" />
              </div>
            </div>
            <div className="rezultatet-text-3">{totalEcts}</div>
            <div className="rezultatet-text-4">ECTS Totale</div>
          </div>

          <div className="rezultatet-card">
            <div className="rezultatet-row">
              <div className="rezultatet-icon-box-3">
                <Clock size={16} className="rezultatet-nota-color-4" />
              </div>
            </div>
            <div className="rezultatet-text-3">{pending}</div>
            <div className="rezultatet-text-4">Në pritje</div>
          </div>

          <div className="rezultatet-card">
            <div className="rezultatet-row">
              <div className="rezultatet-icon-box-4">
                <Award size={16} className="rezultatet-nota-color-5" />
              </div>
            </div>
            <div className="rezultatet-text-3">{passed.length}</div>
            <div className="rezultatet-text-4">Të kaluara</div>
          </div>
        </div>

        {/* Filters */}
        <div className="rezultatet-card-2">
          <div className="rezultatet-stack">
            {/* Search */}
            <div className="rezultatet-box-3">
              <SmartSearch
                value={searchTerm}
                onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                placeholder="Kërko lëndën ose profesorin..."
                headerLabel="Sugjerime"
                size="sm"
                suggestions={[
                  { label: "Lëndët me notën 10",       icon: Star },
                  { label: "Lëndët e semestrit aktual", icon: CalendarRange },
                  { label: "Lëndët e kaluara",          icon: CheckCircle2 },
                  { label: "Lëndët e mbetura",          icon: XCircle },
                ]}
              />
            </div>

            {/* Session filter */}
            <div className="rezultatet-row-2">
              {sessions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSelectedSession(s); setCurrentPage(1); }}
                  className={`rezultatet-btn ${
                    selectedSession === s
                      ? "rezultatet-btn-2"
                      : "rezultatet-btn-3"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rezultatet-box-4">
          {/* Desktop table */}
          <div className="rezultatet-scroll">
            <table className="rezultatet-table">
              <caption className="sr-only">Rezultatet e provimeve</caption>
              <thead>
                <tr className="rezultatet-row-3">
                  <th scope="col" className="rezultatet-th">Nr</th>
                  <th scope="col" className="rezultatet-th">Kodi</th>
                  <th scope="col" className="rezultatet-th">Lënda</th>
                  <th scope="col" className="rezultatet-th">Profesori</th>
                  <th scope="col" className="rezultatet-th-2">Nota</th>
                  <th scope="col" className="rezultatet-th-2">ECTS</th>
                  <th scope="col" className="rezultatet-th">Data</th>
                  <th scope="col" className="rezultatet-th">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => {
                  const status = statusConfig[r.statusi];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={r.nr}
                      className={`rezultatet-row-4 ${
                        i === paginated.length - 1 ? "rezultatet-row-5" : ""
                      }`}
                    >
                      <td className="rezultatet-cell">{r.nr}</td>
                      <td className="rezultatet-cell-2">{r.kodi}</td>
                      <td className="rezultatet-cell-3">
                        <span className="rezultatet-text-5">{r.lenda}</span>
                      </td>
                      <td className="rezultatet-cell-4">{r.prof}</td>
                      <td className="rezultatet-cell-5">
                        <span className={`rezultatet-dot ${getNotaBg(r.nota)}`}>
                          {r.nota ?? "—"}
                        </span>
                      </td>
                      <td className="rezultatet-cell-6">{r.ects}</td>
                      <td className="rezultatet-cell">{r.data}</td>
                      <td className="rezultatet-cell-7">
                        <span className={`rezultatet-text-6 ${status.color}`}>
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="rezultatet-cell-8">
                      Nuk u gjet asnjë rezultat
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="rezultatet-box-5">
            {paginated.map((r) => {
              const status = statusConfig[r.statusi];
              const StatusIcon = status.icon;
              return (
                <div key={r.nr} className="rezultatet-row-6">
                  <span className={`rezultatet-dot-2 ${getNotaBg(r.nota)}`}>
                    {r.nota ?? "—"}
                  </span>
                  <div className="rezultatet-box-3">
                    <div className="rezultatet-text-7">{r.lenda}</div>
                    <div className="rezultatet-text-8">{r.prof} · {r.kodi}</div>
                    <div className="rezultatet-row-7">
                      <span className={`rezultatet-text-9 ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                      <span className="rezultatet-text-4">{r.ects} ECTS</span>
                      <span className="rezultatet-text-4">{r.data}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {paginated.length === 0 && (
              <div className="rezultatet-cell-8">
                Nuk u gjet asnjë rezultat
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="rezultatet-row-8">
              <span className="rezultatet-text-10">
                {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filtered.length)} nga {filtered.length}
              </span>
              <div className="rezultatet-row-9">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rezultatet-btn-4"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rezultatet-btn-4"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Failed notice */}
        {failed > 0 && (
          <div className="rezultatet-card-3">
            <XCircle size={18} className="rezultatet-icon" />
            <div>
              <div className="rezultatet-text-11">
                {failed} lëndë nuk kaloi
              </div>
              <div className="rezultatet-text-12">
                Mund të aplikoni për rivlerësim ose të regjistroheni sërisht në sesionin tjetër.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
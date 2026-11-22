import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  ChevronDown,
  FileText,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Literatura.css";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Sample data ──────────────────────────────────────────────────────────────

const allMaterials = [
  // Teoria e Gjasës
  { id: 1,  emri: "Hyrje në Teorinë e Gjasës",           lenda: "Teoria e Gjasës",          lloji: "Ligjërata",  data: "21.02.2026", madhesia: "2.4 MB"  },
  { id: 2,  emri: "Ngjarjet dhe Hapësira e Mundësive",   lenda: "Teoria e Gjasës",          lloji: "Ligjërata",  data: "28.02.2026", madhesia: "3.1 MB"  },
  { id: 3,  emri: "Ushtrime – Seria 1 (Gjasa)",          lenda: "Teoria e Gjasës",          lloji: "Ushtrime",   data: "07.03.2026", madhesia: "1.2 MB"  },
  { id: 4,  emri: "Shpërndarjet Diskrete",               lenda: "Teoria e Gjasës",          lloji: "Ligjërata",  data: "14.03.2026", madhesia: "2.8 MB"  },
  { id: 5,  emri: "Probability – Sheldon Ross (libër)",  lenda: "Teoria e Gjasës",          lloji: "Literaturë", data: "21.02.2026", madhesia: "22.4 MB" },
  { id: 6,  emri: "Detyrë Kursi 1 – Afati Prill",       lenda: "Teoria e Gjasës",          lloji: "Detyra",     data: "01.04.2026", madhesia: "0.6 MB"  },
  // UX/UI Design
  { id: 7,  emri: "Hyrje në UX/UI – Parimet Themelore", lenda: "UX/UI Design",             lloji: "Ligjërata",  data: "23.02.2026", madhesia: "5.1 MB"  },
  { id: 8,  emri: "User Research & Personas",            lenda: "UX/UI Design",             lloji: "Ligjërata",  data: "02.03.2026", madhesia: "4.3 MB"  },
  { id: 9,  emri: "Figma Workshop – Wireframes",         lenda: "UX/UI Design",             lloji: "Ushtrime",   data: "09.03.2026", madhesia: "2.0 MB"  },
  { id: 10, emri: "Don't Make Me Think – S. Krug",      lenda: "UX/UI Design",             lloji: "Literaturë", data: "23.02.2026", madhesia: "15.8 MB" },
  { id: 11, emri: "Detyrë – Prototyping Figma",         lenda: "UX/UI Design",             lloji: "Detyra",     data: "30.03.2026", madhesia: "1.1 MB"  },
  // Siguria e të Dhënave
  { id: 12, emri: "Hyrje në Sigurinë e të Dhënave",     lenda: "Siguria e të Dhënave",     lloji: "Ligjërata",  data: "24.02.2026", madhesia: "3.6 MB"  },
  { id: 13, emri: "Enkriptimi Simetrik dhe Asimetrik",  lenda: "Siguria e të Dhënave",     lloji: "Ligjërata",  data: "03.03.2026", madhesia: "4.2 MB"  },
  { id: 14, emri: "Lab 1 – Kriptografia në Praktikë",  lenda: "Siguria e të Dhënave",     lloji: "Ushtrime",   data: "10.03.2026", madhesia: "1.8 MB"  },
  { id: 15, emri: "Computer Security – Stallings",      lenda: "Siguria e të Dhënave",     lloji: "Literaturë", data: "24.02.2026", madhesia: "19.2 MB" },
  // OOP / GUI
  { id: 16, emri: "Hyrje në OOP – Klasat dhe Objektet", lenda: "OOP / GUI",                lloji: "Ligjërata",  data: "25.02.2026", madhesia: "3.3 MB"  },
  { id: 17, emri: "Trashëgimia dhe Polimorfizmi",       lenda: "OOP / GUI",                lloji: "Ligjërata",  data: "04.03.2026", madhesia: "2.9 MB"  },
  { id: 18, emri: "Lab 1 – JavaFX GUI Bazë",           lenda: "OOP / GUI",                lloji: "Ushtrime",   data: "11.03.2026", madhesia: "2.1 MB"  },
  { id: 19, emri: "Head First Java – O'Reilly",         lenda: "OOP / GUI",                lloji: "Literaturë", data: "25.02.2026", madhesia: "24.5 MB" },
  { id: 20, emri: "Detyrë – Mini-Aplikacion GUI",       lenda: "OOP / GUI",                lloji: "Detyra",     data: "05.04.2026", madhesia: "0.9 MB"  },
  // Inteligjenca Artificiale
  { id: 21, emri: "Hyrje në AI – Historia dhe Fushëveprimi", lenda: "Inteligjenca Artificiale", lloji: "Ligjërata",  data: "26.02.2026", madhesia: "4.0 MB"  },
  { id: 22, emri: "Kërkimi dhe Optimizimi",             lenda: "Inteligjenca Artificiale", lloji: "Ligjërata",  data: "05.03.2026", madhesia: "3.7 MB"  },
  { id: 23, emri: "Lab 1 – Python & Scikit-Learn",      lenda: "Inteligjenca Artificiale", lloji: "Ushtrime",   data: "12.03.2026", madhesia: "1.5 MB"  },
  { id: 24, emri: "AI – Russell & Norvig (AIMA)",       lenda: "Inteligjenca Artificiale", lloji: "Literaturë", data: "26.02.2026", madhesia: "28.3 MB" },
  { id: 25, emri: "Detyrë – Klasifikues me ML",         lenda: "Inteligjenca Artificiale", lloji: "Detyra",     data: "10.04.2026", madhesia: "0.8 MB"  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const vitiOptions   = ["2025/2026", "2024/2025", "2023/2024"];
const semestratOpt  = ["Semestri 5 – Pranveror", "Semestri 4 – Vjeshtor", "Semestri 3 – Pranveror", "Semestri 2 – Vjeshtor"];
const lendetOpt     = ["Teoria e Gjasës", "UX/UI Design", "Siguria e të Dhënave", "OOP / GUI", "Inteligjenca Artificiale"];
const llojetOpt     = ["Të gjitha", "Ligjërata", "Ushtrime", "Literaturë", "Detyra"];

const llojConfig = {
  Ligjërata: { icon: BookOpen,     color: "literatura-color",    bg: "literatura-bg"  },
  Ushtrime:  { icon: ClipboardList,color: "literatura-color-2",    bg: "literatura-bg-2"  },
  Literaturë:{ icon: GraduationCap,color: "literatura-color-3",    bg: "literatura-bg-3"  },
  Detyra:    { icon: FileText,     color: "literatura-color-4",    bg: "literatura-bg-4"  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="literatura-stack">
      <label htmlFor={id} className="literatura-label">
        {label}
      </label>
      <div className="literatura-box">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="literatura-select"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={13} className="literatura-icon" />
      </div>
    </div>
  );
}

function LlojiBadge({ lloji }) {
  const cfg = llojConfig[lloji];
  const Icon = cfg.icon;
  return (
    <span className={`literatura-badge ${cfg.color} ${cfg.bg}`}>
      <Icon size={12} />
      {lloji}
    </span>
  );
}

const ROWS = 8;

// ─── Main component ───────────────────────────────────────────────────────────

export function Literatura() {
  const [viti,     setViti]     = useState(vitiOptions[0]);
  const [semestri, setSemestri] = useState(semestratOpt[0]);
  const [lenda,    setLenda]    = useState(lendetOpt[0]);
  const [lloji,    setLloji]    = useState(llojetOpt[0]);
  const [results,  setResults]  = useState(null);
  const [page,     setPage]     = useState(1);

  // Real-time search with 300ms debounce
  const [rawSearch,       setRawSearch]       = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(rawSearch.trim()), 300);
    return () => clearTimeout(t);
  }, [rawSearch]);

  const handleKerko = () => {
    const filtered = allMaterials.filter((m) => {
      const matchLenda = m.lenda === lenda;
      const matchLloji = lloji === "Të gjitha" || m.lloji === lloji;
      return matchLenda && matchLloji;
    });
    setResults(filtered);
    setPage(1);
    setRawSearch("");
    setDebouncedSearch("");
  };

  // When search is active, override results with live search
  const searchResults = debouncedSearch
    ? allMaterials.filter((m) =>
        m.emri.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.lenda.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : results;

  const totalPages = searchResults ? Math.ceil(searchResults.length / ROWS) : 0;
  const paginated  = searchResults ? searchResults.slice((page - 1) * ROWS, page * ROWS) : [];

  return (
    <div className="literatura-box-2">
      <div className="literatura-box-3">

        {/* Page header */}
        <div className="literatura-text">
          <h1 className="literatura-title">
            Shkarko materialet mësimore
          </h1>
          <p className="literatura-text-2">
            Kërko dhe shkarko materialet e lëndëve tuaja
          </p>
        </div>

        {/* Search bar */}
        <div className="literatura-box-4">
          <Search size={15} className="literatura-icon-2" />
          <input
            type="text"
            value={rawSearch}
            onChange={(e) => { setRawSearch(e.target.value); setPage(1); }}
            placeholder="Kërko material..."
            aria-label="Kërko literaturë"
            className="literatura-input"
          />
        </div>

        {/* Filter card */}
        <div className="literatura-card">
          <div className="literatura-stack-2">
            <FilterSelect id="literatura-viti" label="Viti akademik" value={viti}     onChange={setViti}     options={vitiOptions}  />
            <FilterSelect id="literatura-semestri" label="Semestri"      value={semestri} onChange={setSemestri} options={semestratOpt} />
            <FilterSelect id="literatura-lenda" label="Lënda"         value={lenda}    onChange={setLenda}    options={lendetOpt}    />
            <FilterSelect id="literatura-lloji" label="Lloji i materialit" value={lloji} onChange={setLloji} options={llojetOpt}    />
            <button
              onClick={handleKerko}
              className="literatura-btn"
            >
              <Search size={14} />
              Kërko
            </button>
          </div>
        </div>

        {/* Results */}
        {(results !== null || debouncedSearch) && (
          <div className="literatura-box-5">

            {/* Desktop table */}
            <div className="literatura-scroll">
              <table className="literatura-table">
                <caption className="sr-only">Materialet mësimore</caption>
                <thead>
                  <tr className="literatura-row">
                    {["Emri i materialit", "Lënda", "Lloji", "Data e publikimit", "Madhësia", "Veprimi"].map((h) => (
                      <th
                        scope="col"
                        key={h}
                        className="literatura-th"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="literatura-cell">
                        <div className="literatura-stack-3">
                          <FileText size={32} className="literatura-icon-3" />
                          <span className="literatura-text-3">
                            Nuk ka materiale të disponueshme.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((m, i) => (
                      <tr
                        key={m.id}
                        className={`literatura-row-2 ${
                          i < paginated.length - 1 ? "literatura-row-3" : ""
                        }`}
                      >
                        {/* Emri */}
                        <td className="literatura-cell-2">
                          <span className="literatura-text-4">
                            {m.emri}
                          </span>
                        </td>
                        {/* Lënda */}
                        <td className="literatura-cell-3">
                          <span className="literatura-text-5">{m.lenda}</span>
                        </td>
                        {/* Lloji */}
                        <td className="literatura-cell-4">
                          <LlojiBadge lloji={m.lloji} />
                        </td>
                        {/* Data */}
                        <td className="literatura-cell-5">
                          {m.data}
                        </td>
                        {/* Madhësia */}
                        <td className="literatura-cell-5">
                          {m.madhesia}
                        </td>
                        {/* Veprimi */}
                        <td className="literatura-cell-4">
                          <div className="literatura-row-4">
                            <button className="literatura-btn-2">
                              <Download size={12} />
                              Shkarko
                            </button>
                            <button className="literatura-btn-3">
                              <Eye size={12} />
                              Shiko
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="literatura-box-6">
              {paginated.length === 0 ? (
                <div className="literatura-stack-4">
                  <FileText size={32} className="literatura-icon-3" />
                  <span className="literatura-text-3">
                    Nuk ka materiale të disponueshme.
                  </span>
                </div>
              ) : (
                paginated.map((m) => (
                  <div key={m.id} className="literatura-box-7">
                    <div className="literatura-row-5">
                      <div className="literatura-box-8">
                        <p className="literatura-text-6">
                          {m.emri}
                        </p>
                        <p className="literatura-text-7">{m.lenda}</p>
                      </div>
                      <LlojiBadge lloji={m.lloji} />
                    </div>
                    <div className="literatura-row-6">
                      <div className="literatura-text-8">
                        {m.data} · {m.madhesia}
                      </div>
                      <div className="literatura-row-4">
                        <button className="literatura-btn-4">
                          <Download size={12} />
                          Shkarko
                        </button>
                        <button className="literatura-btn-5">
                          <Eye size={12} />
                          Shiko
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="literatura-row-7">
                <span className="literatura-text-9">
                  {(page - 1) * ROWS + 1}–{Math.min(page * ROWS, searchResults.length)} nga {searchResults.length}
                </span>
                <div className="literatura-row-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="literatura-btn-6"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="literatura-btn-6"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

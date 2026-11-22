import { useState, useEffect } from "react";
import { Search, FilePlus2, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { api } from "../../api";
import "./KerkeseAnkese.css";

const statusConfig = {
  "Në pritje": {
    className: "kerkese-ankese-variant",
  },
  "Në shqyrtim": {
    className: "kerkese-ankese-variant-2",
  },
  Aprovuar: {
    className: "kerkese-ankese-variant-3",
  },
  Refuzuar: {
    className: "kerkese-ankese-variant-4",
  },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function KerkeseAnkese() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/student/requests").then((data) => {
      setRequests(
        data.map((r) => ({
          id: r.id,
          iniciuesi: r.studentName || "",
          titulli: r.details?.titulli || r.type,
          data: r.createdAt ? new Date(r.createdAt).toLocaleDateString("sq-AL") : "",
          cc: r.details?.cc || "",
          statusi: r.status,
        })),
      );
    }).catch(() => {});
  }, []);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulli: "", cc: "", pershkrim: "" });
  const [viewItem, setViewItem] = useState(null);

  const filtered = requests.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.iniciuesi.toLowerCase().includes(search.toLowerCase()) ||
      r.titulli.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleSubmit() {
    if (!form.titulli.trim()) return;
    try {
      const r = await api.post("/student/requests", {
        type: "Ankesa",
        details: {
          titulli: form.titulli,
          cc: form.cc,
          pershkrim: form.pershkrim,
        },
      });
      setRequests((prev) => [
        {
          id: r.id,
          iniciuesi: r.studentName || "",
          titulli: r.details?.titulli || r.type,
          data: r.createdAt ? new Date(r.createdAt).toLocaleDateString("sq-AL") : "",
          cc: r.details?.cc || "",
          statusi: r.status,
        },
        ...prev,
      ]);
    } catch (err) {
      alert(err.message);
      return;
    }
    setShowModal(false);
    setForm({ titulli: "", cc: "", pershkrim: "" });
  }

  return (
    <div className="kerkese-ankese-box">
      {/* Page header */}
      <div>
        <h1 className="kerkese-ankese-title">
          Kërkesë / Ankesë
        </h1>
        <p className="kerkese-ankese-text">
          Paraqit dhe menaxho kërkesat dhe ankesat tuaja
        </p>
      </div>

      {/* Card container — KËRKESAT ANKESE section */}
      <div className="kerkese-ankese-box-2">

        {/* Toolbar */}
        <div className="kerkese-ankese-stack">
          {/* Search */}
          <div className="kerkese-ankese-row">
            <label className="kerkese-ankese-label">
              Kërkoni:
            </label>
            <div className="kerkese-ankese-box-3">
              <Search
                size={14}
                className="kerkese-ankese-icon"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Kërko kërkesë..."
                className="kerkese-ankese-input"
              />
            </div>
          </div>

          {/* Right controls */}
          <div className="kerkese-ankese-row-2">
            {/* Rows per page */}
            <div className="kerkese-ankese-row">
              <label className="kerkese-ankese-label">
                Shiko
              </label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="kerkese-ankese-select"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238E8E93' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n} rreshta</option>
                ))}
              </select>
            </div>

            {/* Register button */}
            <button
              onClick={() => setShowModal(true)}
              className="kerkese-ankese-btn"
            >
              <FilePlus2 size={15} />
              Regjistro
            </button>
          </div>
        </div>

        {/* Table — desktop */}
        <div className="kerkese-ankese-scroll">
          <table className="kerkese-ankese-table">
            <caption className="sr-only">Kërkesat dhe ankesat e mia</caption>
            <thead>
              <tr className="kerkese-ankese-row-3">
                {[
                  "Numri i kërkesës",
                  "Inicuesi i kërkesës",
                  "Titulli",
                  "Data e kërkesës",
                  "CC",
                  "Statusi",
                  "Aksion",
                ].map((col) => (
                  <th
                    scope="col"
                    key={col}
                    className="kerkese-ankese-th"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="kerkese-ankese-cell"
                  >
                    Nuk ka të dhëna
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`kerkese-ankese-row-4 ${
                      i < paginated.length - 1
                        ? "kerkese-ankese-row-3"
                        : ""
                    }`}
                  >
                    <td className="kerkese-ankese-cell-2">
                      {row.id}
                    </td>
                    <td className="kerkese-ankese-cell-3">
                      {row.iniciuesi}
                    </td>
                    <td className="kerkese-ankese-cell-4">
                      {row.titulli}
                    </td>
                    <td className="kerkese-ankese-cell-5">
                      {row.data}
                    </td>
                    <td className="kerkese-ankese-cell-6">
                      {row.cc}
                    </td>
                    <td className="kerkese-ankese-cell-7">
                      <span
                        className={`kerkese-ankese-badge ${statusConfig[row.statusi].className}`}
                      >
                        {row.statusi}
                      </span>
                    </td>
                    <td className="kerkese-ankese-cell-7">
                      <button
                        onClick={() => setViewItem(row)}
                        className="kerkese-ankese-btn-2"
                      >
                        <Eye size={13} />
                        Shiko
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="kerkese-ankese-text-2">
          {paginated.length === 0 ? (
            <div className="kerkese-ankese-box-4">
              Nuk ka të dhëna
            </div>
          ) : (
            <div className="kerkese-ankese-box-5">
              {paginated.map((row) => (
                <div
                  key={row.id}
                  className="kerkese-ankese-box-6"
                >
                  <div className="kerkese-ankese-row-5">
                    <span className="kerkese-ankese-text-3">
                      {row.id}
                    </span>
                    <span
                      className={`kerkese-ankese-badge ${statusConfig[row.statusi].className}`}
                    >
                      {row.statusi}
                    </span>
                  </div>
                  <div className="kerkese-ankese-grid">
                    <div>
                      <span className="kerkese-ankese-text-4">Inicuesi: </span>
                      <span className="kerkese-ankese-text-5">{row.iniciuesi}</span>
                    </div>
                    <div>
                      <span className="kerkese-ankese-text-4">Data: </span>
                      <span className="kerkese-ankese-text-5">{row.data}</span>
                    </div>
                    <div className="kerkese-ankese-box-7">
                      <span className="kerkese-ankese-text-4">Titulli: </span>
                      <span className="kerkese-ankese-text-5">{row.titulli}</span>
                    </div>
                    <div>
                      <span className="kerkese-ankese-text-4">CC: </span>
                      <span className="kerkese-ankese-text-5">{row.cc}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewItem(row)}
                    className="kerkese-ankese-btn-2"
                  >
                    <Eye size={13} />
                    Shiko
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination footer */}
        <div className="kerkese-ankese-row-6">
          <span className="kerkese-ankese-text-6">
            {filtered.length === 0
              ? "0 rezultate"
              : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} nga ${filtered.length}`}
          </span>
          <div className="kerkese-ankese-row">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="kerkese-ankese-btn-3"
            >
              <ChevronLeft size={13} />
              E Kaluara
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || filtered.length === 0}
              className="kerkese-ankese-btn-3"
            >
              Tjetra
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Register modal */}
      {showModal && (
        <div
          className="kerkese-ankese-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="kerkese-ankese-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kerkese-ankese-row-7">
              <div>
                <h2 className="kerkese-ankese-title-2">
                  Kërkesë / Ankesë e re
                </h2>
                <p className="kerkese-ankese-text-7">
                  Plotëso fushat për të paraqitur kërkesën
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="kerkese-ankese-btn-4"
              >
                <X size={18} />
              </button>
            </div>

            <div className="kerkese-ankese-box-8">
              <div>
                <label className="kerkese-ankese-label-2">
                  Titulli
                </label>
                <input
                  type="text"
                  value={form.titulli}
                  onChange={(e) => setForm((f) => ({ ...f, titulli: e.target.value }))}
                  placeholder="Shkruaj titullin e kërkesës"
                  className="kerkese-ankese-input-2"
                />
              </div>
              <div>
                <label className="kerkese-ankese-label-2">
                  CC (Kopje te)
                </label>
                <input
                  type="text"
                  value={form.cc}
                  onChange={(e) => setForm((f) => ({ ...f, cc: e.target.value }))}
                  placeholder="p.sh. Dekani, Koordinatori"
                  className="kerkese-ankese-input-2"
                />
              </div>
              <div>
                <label className="kerkese-ankese-label-2">
                  Përshkrimi
                </label>
                <textarea
                  value={form.pershkrim}
                  onChange={(e) => setForm((f) => ({ ...f, pershkrim: e.target.value }))}
                  placeholder="Përshkruaj shkurtimisht kërkesën ose ankesën..."
                  rows={4}
                  className="kerkese-ankese-textarea"
                />
              </div>
            </div>

            <div className="kerkese-ankese-row-8">
              <button
                onClick={() => setShowModal(false)}
                className="kerkese-ankese-btn-5"
              >
                Anulo
              </button>
              <button
                onClick={handleSubmit}
                className="kerkese-ankese-btn-6"
              >
                Dërgo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View detail modal */}
      {viewItem && (
        <div
          className="kerkese-ankese-overlay"
          onClick={() => setViewItem(null)}
        >
          <div
            className="kerkese-ankese-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="kerkese-ankese-row-7">
              <h2 className="kerkese-ankese-title-2">
                Detajet e kërkesës
              </h2>
              <button
                onClick={() => setViewItem(null)}
                className="kerkese-ankese-btn-4"
              >
                <X size={18} />
              </button>
            </div>
            <div className="kerkese-ankese-box-9">
              {[
                { label: "Numri i kërkesës", value: viewItem.id },
                { label: "Inicuesi", value: viewItem.iniciuesi },
                { label: "Titulli", value: viewItem.titulli },
                { label: "Data e kërkesës", value: viewItem.data },
                { label: "CC", value: viewItem.cc },
              ].map(({ label, value }) => (
                <div key={label} className="kerkese-ankese-row-9">
                  <span className="kerkese-ankese-text-8">{label}</span>
                  <span className="kerkese-ankese-text-5">{value}</span>
                </div>
              ))}
              <div className="kerkese-ankese-row-2">
                <span className="kerkese-ankese-text-8">Statusi</span>
                <span
                  className={`kerkese-ankese-badge ${statusConfig[viewItem.statusi].className}`}
                >
                  {viewItem.statusi}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

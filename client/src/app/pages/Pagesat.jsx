import { useEffect, useRef, useState } from "react";
import { CreditCard, FileText, Download, ChevronDown, Search, Lock, CheckCircle2, XCircle, Clock, Smartphone, Wallet, Globe, Award, GraduationCap, ArrowLeft, Mail, Receipt } from "lucide-react";
import { paymentHistory as history } from "../data/student";
import "./Pagesat.css";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const paymentGroups = [
  {
    category: "Dokumente",
    icon: FileText,
    items: [
      { id: "cert-nota",    label: "Certifikatë e notave",            amount: 2.50,  desc: "Certifikatë zyrtare me të gjitha notat dhe kreditet e fituara." },
      { id: "cert-diplome", label: "Certifikatë e diplomës",          amount: 2.50,  desc: "Dëshmi zyrtare e diplomimit nga Universiteti i Prishtinës." },
      { id: "indeks-dupl",  label: "Indeks duplikat",                 amount: 5.00,  desc: "Kopje e indeksit të studentit në rast humbjeje ose dëmtimi." },
      { id: "diplome",      label: "Diplomë",                         amount: 10.00, desc: "Dokumenti zyrtar i diplomimit me vulë dhe nënshkrim zyrtar." },
      { id: "diplome-dupl", label: "Diplomë duplikat",                amount: 15.00, desc: "Kopje duplikat e diplomës në rast humbjeje ose dëmtimi." },
      { id: "nderrim",      label: "Ndërrim fakulteti/departamenti",  amount: 20.00, desc: "Tarifa administrative për ndërrimin e fakultetit ose departamentit." },
      { id: "katalog",      label: "Pagesë për katalog",              amount: 3.00,  desc: "Katalogu zyrtar i programeve dhe kurseve universitare." },
      { id: "module",       label: "Pagesë për modulet shtesë",       amount: 30.00, desc: "Modulet shtesë jashtë planit mësimor të rregullt." },
    ],
  },
  {
    category: "Kartelë",
    icon: CreditCard,
    items: [
      { id: "kartela", label: "Kartelë e humbur/dëmtuar", amount: 3.00, desc: "Zëvendësim i kartelës studentore në rast humbjeje ose dëmtimi." },
    ],
  },
  {
    category: "QEQ",
    icon: Award,
    items: [
      { id: "qeq",        label: "Regjistrim në kursin QEQ",      amount: 25.00, desc: "Regjistrim në kursin e Kualifikimit Evropian të Kualifikimeve." },
      { id: "gjuhe-a1",   label: "Kurs i gjuhës niveli A1",       amount: 40.00, desc: "Kurs i gjuhës angleze ose gjermane niveli A1." },
      { id: "test-gjuhe", label: "Test për nivelin e gjuhës",     amount: 10.00, desc: "Test për përcaktimin e nivelit të njohjes së gjuhës." },
      { id: "perkthim",   label: "Përkthim me shkrim",            amount: 15.00, desc: "Shërbim i përkthimit me shkrim i dokumenteve zyrtare." },
    ],
  },
  {
    category: "Provime & Tjera",
    icon: GraduationCap,
    items: [
      { id: "provim-master", label: "Provim plotësues për Master",       amount: 20.00,  desc: "Tarifa për secilin provim plotësues të regjistrimit në studimet Master." },
      { id: "summer-uni",    label: "International Summer University",   amount: 150.00, desc: "Tarifa e pjesëmarrjes në International Summer University." },
      { id: "panairi",       label: "Panairi i karrierës",               amount: 5.00,   desc: "Tarifa e regjistrimit dhe pjesëmarrjes në panairin e karrierës." },
      { id: "matematik",     label: "Kurs për matematikë elementare",    amount: 30.00,  desc: "Kurs përgatitor për matematikë elementare bazë." },
    ],
  },
];

const allItems = paymentGroups.flatMap((g) => g.items);

const paymentMethods = [
  { id: "card",   label: "Kartelë Krediti / Debiti", sub: "Visa · Mastercard",           icon: CreditCard, color: "#007AFF" },
  { id: "paypal", label: "PayPal",                   sub: "Paguaj me llogari PayPal",    icon: Globe,      color: "#003087" },
  { id: "apple",  label: "Apple Pay",                sub: "Touch ID ose Face ID",         icon: Smartphone, color: "#1C1C1E" },
  { id: "google", label: "Google Pay",               sub: "Paguaj me llogari Google",    icon: Wallet,     color: "#4285F4" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function fmt(n) {
  return n.toFixed(2).replace(".", ",") + " €";
}

function StatusBadge({ status }) {
  if (status === "paid")
    return (
      <span className="pagesat-badge">
        <CheckCircle2 size={10} /> E paguar
      </span>
    );
  if (status === "pending")
    return (
      <span className="pagesat-badge-2">
        <Clock size={10} /> Në pritje
      </span>
    );
  return (
    <span className="pagesat-badge-3">
      <XCircle size={10} /> E dështuar
    </span>
  );
}

function MethodIcon({ method, size = 16 }) {
  const m = paymentMethods.find((x) => x.id === method);
  if (!m) return <CreditCard size={size} className="pagesat-icon" />;
  return <m.icon size={size} style={{ color: m.color }} />;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function Pagesat() {
  const [selectedItem, setSelectedItem]   = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [searchQ, setSearchQ]             = useState("");
  const [success, setSuccess]             = useState(false);
  const dropdownRef                       = useRef(null);

  const txnId = "TXN-2026-00481";
  const txnDate = "20 Maj 2026, 14:37";

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const filtered = searchQ.trim()
    ? allItems.filter((i) => i.label.toLowerCase().includes(searchQ.toLowerCase()))
    : null;

  const handlePay = () => {
    if (selectedItem && selectedMethod) setSuccess(true);
  };

  const handleReset = () => {
    setSuccess(false);
    setSelectedItem(null);
    setSelectedMethod(null);
    setSearchQ("");
  };

  /* ── Success screen ──────────────────────────────────────────────────── */
  if (success && selectedItem) {
    return (
      <div className="pagesat-box">
        <div className="pagesat-card">
          <div className="pagesat-avatar">
            <CheckCircle2 size={44} className="pagesat-icon-2" />
          </div>
          <div>
            <h2 className="pagesat-title">Pagesa u krye me sukses!</h2>
            <p className="pagesat-text">Transaksioni juaj është procesuar.</p>
          </div>

          <div className="pagesat-card-2">
            {[
              ["ID e transaksionit", txnId],
              ["Lloji i pagesës", selectedItem.label],
              ["Shuma e paguar", fmt(selectedItem.amount)],
              ["Data & ora", txnDate],
              ["Metoda", paymentMethods.find((m) => m.id === selectedMethod)?.label ?? ""],
            ].map(([k, v]) => (
              <div key={k} className="pagesat-row">
                <span className="pagesat-text-2">{k}</span>
                <span className="pagesat-text-3">{v}</span>
              </div>
            ))}
          </div>

          <div className="pagesat-card-3">
            <Mail size={15} className="pagesat-icon-3" />
            <p className="pagesat-text-4">
              Fatura është dërguar gjithashtu në email-in tuaj:{" "}
              <strong>arta.berisha@student.uni-pr.edu</strong>
            </p>
          </div>

          <div className="pagesat-row-2">
            <button className="pagesat-btn">
              <Download size={15} />
              Shkarko faturën
            </button>
            <button
              onClick={handleReset}
              className="pagesat-btn-2"
            >
              <ArrowLeft size={15} />
              Kthehu te Ballina
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main screen ─────────────────────────────────────────────────────── */
  return (
    <div className="pagesat-box-2">

      {/* Header */}
      <div>
        <h1 className="pagesat-title-2">Pagesat</h1>
        <p className="pagesat-text-5">
          Kryeni pagesat universitare shpejt dhe me siguri, direkt nga platforma.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="pagesat-grid">

        {/* Left — Steps */}
        <div className="pagesat-box-3">

          {/* Step 1 */}
          <div className="pagesat-box-4">
            <div className="pagesat-row-3">
              <span className="pagesat-dot">1</span>
              <div>
                <h2 className="pagesat-title-3">Zgjidhni llojin e pagesës</h2>
                <p className="pagesat-text-6">Kërkoni ose shfletoni sipas kategorisë</p>
              </div>
            </div>

            <div className="pagesat-box-5">
              {/* Searchable dropdown */}
              <div className="pagesat-box-6" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={`pagesat-btn-3 ${
                    dropdownOpen ? "pagesat-btn-4" : "pagesat-btn-5"
                  }`}
                >
                  <span className={`pagesat-text-7 ${selectedItem ? "pagesat-text-8" : "pagesat-text-9"}`}>
                    {selectedItem ? selectedItem.label : "Zgjidhni llojin e pagesës..."}
                  </span>
                  <ChevronDown size={17} className={`pagesat-icon-4 ${dropdownOpen ? "pagesat-icon-5" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="pagesat-popup">
                    {/* Search */}
                    <div className="pagesat-box-7">
                      <div className="pagesat-card-4">
                        <Search size={14} className="pagesat-icon-6" />
                        <input
                          autoFocus
                          value={searchQ}
                          onChange={(e) => setSearchQ(e.target.value)}
                          placeholder="Kërko..."
                          className="pagesat-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                        {searchQ && (
                          <button onClick={() => setSearchQ("")} className="pagesat-btn-6">
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pagesat-scroll">
                      {filtered ? (
                        filtered.length === 0 ? (
                          <p className="pagesat-text-10">Nuk u gjet asnjë rezultat</p>
                        ) : (
                          filtered.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => { setSelectedItem(item); setDropdownOpen(false); setSearchQ(""); }}
                              className={`pagesat-btn-7 ${selectedItem?.id === item.id ? "pagesat-btn-8" : ""}`}
                            >
                              <span className="pagesat-text-11">{item.label}</span>
                              <span className="pagesat-text-12">{fmt(item.amount)}</span>
                            </button>
                          ))
                        )
                      ) : (
                        paymentGroups.map((group) => (
                          <div key={group.category}>
                            <div className="pagesat-row-4">
                              <group.icon size={13} className="pagesat-text-9" />
                              <span className="pagesat-text-13">{group.category}</span>
                            </div>
                            {group.items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => { setSelectedItem(item); setDropdownOpen(false); }}
                                className={`pagesat-btn-7 ${selectedItem?.id === item.id ? "pagesat-btn-8" : ""}`}
                              >
                                <span className="pagesat-text-11">{item.label}</span>
                                <span className="pagesat-text-12">{fmt(item.amount)}</span>
                              </button>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected payment info card */}
              {selectedItem && (
                <div className="pagesat-card-5">
                  <div className="pagesat-icon-box">
                    <Receipt size={18} className="pagesat-icon-7" />
                  </div>
                  <div className="pagesat-box-8">
                    <div className="pagesat-row-5">
                      <p className="pagesat-text-14">{selectedItem.label}</p>
                      <span className="pagesat-text-15">{fmt(selectedItem.amount)}</span>
                    </div>
                    <p className="pagesat-text-16">{selectedItem.desc}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className={`pagesat-box-9 ${!selectedItem ? "pagesat-box-10" : ""}`}>
            <div className="pagesat-row-3">
              <span className={`pagesat-dot-2 ${selectedItem ? "pagesat-text-17" : "pagesat-text-18"}`}>2</span>
              <div>
                <h2 className="pagesat-title-3">Zgjidhni metodën e pagesës</h2>
                <p className="pagesat-text-6">Të gjitha transaksionet janë të sigurta</p>
              </div>
            </div>

            <div className="pagesat-box-5">
              {/* 2x2 grid of payment method cards */}
              <div className="pagesat-grid-2">
                {paymentMethods.map((m) => {
                  const isSelected = selectedMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`pagesat-btn-9 ${
                        isSelected
                          ? "pagesat-btn-10"
                          : "pagesat-btn-11"
                      }`}
                    >
                      <m.icon
                        size={26}
                        className={isSelected ? "pagesat-text-19" : ""}
                        style={!isSelected ? { color: m.color } : undefined}
                      />
                      <span className={`pagesat-text-20 ${isSelected ? "pagesat-text-19" : "pagesat-text-8"}`}>{m.label}</span>
                      <span className={`pagesat-text-21 ${isSelected ? "pagesat-text-22" : "pagesat-text-9"}`}>{m.sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Security note */}
              <div className="pagesat-row-6">
                <Lock size={13} className="pagesat-icon-8" />
                <p className="pagesat-text-23">
                  Pagesat janë të sigurta dhe të enkriptuara me SSL. SEMS nuk ruan të dhënat e kartelës suaj.
                </p>
              </div>

              {/* Fallback: old bank slip link */}
              <div className="pagesat-box-11">
                <button className="pagesat-btn-12">
                  Ose gjenero fletëpagesën për pagesë në bankë
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Summary panel */}
        <div className="pagesat-text-24">
          <div className="pagesat-box-12">
            <div className="pagesat-box-13">
              <h2 className="pagesat-title-3">Përmbledhja</h2>
            </div>

            <div className="pagesat-box-5">
              {/* Summary rows */}
              <div className="pagesat-box-14">
                <div className="pagesat-row-5">
                  <span className="pagesat-text-2">Lloji i pagesës</span>
                  <span className="pagesat-text-25">
                    {selectedItem ? selectedItem.label : <span className="pagesat-text-26">—</span>}
                  </span>
                </div>
                <div className="pagesat-row-7">
                  <span className="pagesat-text-2">Shuma</span>
                  <span className={`pagesat-text-27 ${selectedItem ? "pagesat-text-8" : "pagesat-text-26"}`}>
                    {selectedItem ? fmt(selectedItem.amount) : "—"}
                  </span>
                </div>
                <div className="pagesat-row-7">
                  <span className="pagesat-text-2">Metoda</span>
                  <span className="pagesat-text-28">
                    {selectedMethod ? (
                      <>
                        <MethodIcon method={selectedMethod} size={14} />
                        {paymentMethods.find((m) => m.id === selectedMethod)?.label}
                      </>
                    ) : (
                      <span className="pagesat-text-26">—</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="pagesat-box-15">
                <div className="pagesat-row-8">
                  <span className="pagesat-text-29">Totali</span>
                  <span className="pagesat-text-30">
                    {selectedItem ? fmt(selectedItem.amount) : "0,00 €"}
                  </span>
                </div>

                <button
                  onClick={handlePay}
                  disabled={!selectedItem || !selectedMethod}
                  className="pagesat-btn-13"
                >
                  {selectedMethod ? <MethodIcon method={selectedMethod} size={18} /> : <CreditCard size={18} />}
                  Paguaj tani
                </button>

                {(!selectedItem || !selectedMethod) && (
                  <p className="pagesat-text-31">
                    {!selectedItem ? "Zgjidhni llojin e pagesës për të vazhduar" : "Zgjidhni metodën e pagesës"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="pagesat-text-32">
        <h2 className="pagesat-title-4">Historiku i Pagesave</h2>
        <div className="pagesat-box-12">

          {/* Desktop table */}
          <div className="pagesat-scroll-2">
            <table className="pagesat-table">
              <thead>
                <tr className="pagesat-row-9">
                  {["Lloji i pagesës", "Data", "Metoda", "Shuma", "Statusi", ""].map((h) => (
                    <th key={h} className="pagesat-th">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr
                    key={h.id}
                    className={`pagesat-row-10 ${i < history.length - 1 ? "pagesat-row-11" : ""}`}
                  >
                    <td className="pagesat-cell">{h.label}</td>
                    <td className="pagesat-cell-2">{h.date}</td>
                    <td className="pagesat-cell-3">
                      <div className="pagesat-row-12">
                        <MethodIcon method={h.method} size={15} />
                        <span className="pagesat-text-33">
                          {paymentMethods.find((m) => m.id === h.method)?.label}
                        </span>
                      </div>
                    </td>
                    <td className="pagesat-cell-4">{fmt(h.amount)}</td>
                    <td className="pagesat-cell-3"><StatusBadge status={h.status} /></td>
                    <td className="pagesat-cell-5">
                      <button className="pagesat-btn-14">
                        <Download size={13} /> Shkarko faturën
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="pagesat-box-16">
            {history.map((h) => (
              <div key={h.id} className="pagesat-row-13">
                <div className="pagesat-icon-box-2">
                  <MethodIcon method={h.method} size={18} />
                </div>
                <div className="pagesat-box-8">
                  <div className="pagesat-row-14">
                    <p className="pagesat-text-14">{h.label}</p>
                    <span className="pagesat-text-34">{fmt(h.amount)}</span>
                  </div>
                  <div className="pagesat-row-15">
                    <span className="pagesat-text-35">{h.date}</span>
                    <StatusBadge status={h.status} />
                  </div>
                  <button className="pagesat-btn-15">
                    <Download size={12} /> Shkarko faturën
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

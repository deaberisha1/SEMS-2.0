import { useState } from "react";
import { CreditCard, CheckCircle2, ChevronDown, AlertCircle, Upload, User, Hash, Phone, Mail, MapPin } from "lucide-react";
import { api } from "../../api";
import "./KerkeseKartele.css";

const reasons = [
  { value: "humbur", label: "Karta e humbur" },
  { value: "demtuar", label: "Karta e dëmtuar / e prishur" },
  { value: "ndryshim_te_dhenave", label: "Ndryshim i të dhënave personale" },
  { value: "skaduar", label: "Karta e skaduar" },
  { value: "tjeter", label: "Arsye tjetër" },
];

export function KerkeseKartele() {
  const [arsyeja, setArsyeja] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pershkrimi, setPershkrimi] = useState("");
  const [adresa, setAdresa] = useState("");
  const [telefoni, setTelefoni] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!arsyeja) return;
    setLoading(true);
    api
      .post("/student/requests", { type: "Kartelë e re", details: { reason: arsyeja, description: pershkrimi, address: adresa, phone: telefoni } })
      .then(() => setSubmitted(true))
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  };

  if (submitted) {
    return (
      <div className="kerkese-kartele-row">
        <div className="kerkese-kartele-card">
          <div className="kerkese-kartele-avatar">
            <CheckCircle2 size={40} className="kerkese-kartele-icon" />
          </div>
          <h2 className="kerkese-kartele-title">Kërkesa u dërgua!</h2>
          <p className="kerkese-kartele-text">
            Kërkesa juaj për kartelë të re u regjistrua me sukses.
          </p>
          <p className="kerkese-kartele-text-2">
            Numri i kërkesës: <span className="kerkese-kartele-text-3">#KRT-2026-00847</span>
          </p>
          <div className="kerkese-kartele-card-2">
            <div className="kerkese-kartele-row-2">
              <span className="kerkese-kartele-text-4">Arsyeja</span>
              <span className="kerkese-kartele-text-5">
                {reasons.find((r) => r.value === arsyeja)?.label}
              </span>
            </div>
            <div className="kerkese-kartele-row-2">
              <span className="kerkese-kartele-text-4">Statusi</span>
              <span className="kerkese-kartele-text-6">Në procesim</span>
            </div>
            <div className="kerkese-kartele-row-2">
              <span className="kerkese-kartele-text-4">Koha e pritjes</span>
              <span className="kerkese-kartele-text-5">3–5 ditë pune</span>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setArsyeja(""); setPershkrimi(""); setAdresa(""); setTelefoni(""); }}
            className="kerkese-kartele-btn"
          >
            Kërko sërisht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kerkese-kartele-box">
      <div className="kerkese-kartele-box-2">

        {/* Header */}
        <div className="kerkese-kartele-text-7">
          <div className="kerkese-kartele-row-3">
            <div className="kerkese-kartele-icon-box">
              <CreditCard size={20} className="kerkese-kartele-icon-2" />
            </div>
            <h1 className="kerkese-kartele-title-2">
              Kërkesë për Kartelë
            </h1>
          </div>
          <p className="kerkese-kartele-text-8">
            Plotësoni formularin për të kërkuar kartelë studentore të re
          </p>
        </div>

        {/* Info banner */}
        <div className="kerkese-kartele-card-3">
          <AlertCircle size={17} className="kerkese-kartele-icon-3" />
          <p className="kerkese-kartele-text-9">
            Kartela e re merret personalisht në Sekretarinë Studentore (Ndërtesa A, Kati 1) me dokument identifikimi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="kerkese-kartele-form">
          {/* Student info (read-only) */}
          <div className="kerkese-kartele-box-3">
            <div className="kerkese-kartele-box-4">
              <span className="kerkese-kartele-text-10">
                Të dhënat tuaja
              </span>
            </div>
            <div className="kerkese-kartele-box-5">
              {[
                { icon: User, label: "Emri i plotë", value: "Arta Berisha" },
                { icon: Hash, label: "Nr. Studentor", value: "202012345678" },
                { icon: Mail, label: "Email", value: "arta.berisha@student.uni-pr.edu" },
                { icon: BookIconPlaceholder, label: "Dega / Programi", value: "Informatikë, Viti 3" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="kerkese-kartele-row-4">
                  <Icon size={16} className="kerkese-kartele-icon-4" />
                  <span className="kerkese-kartele-text-11">{label}</span>
                  <span className="kerkese-kartele-text-12">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Request details */}
          <div className="kerkese-kartele-box-3">
            <div className="kerkese-kartele-box-4">
              <span className="kerkese-kartele-text-10">
                Detajet e kërkesës
              </span>
            </div>
            <div className="kerkese-kartele-box-6">
              {/* Reason dropdown */}
              <div>
                <label className="kerkese-kartele-label">
                  Arsyeja e kërkesës <span className="kerkese-kartele-text-13">*</span>
                </label>
                <div className="kerkese-kartele-box-7">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`kerkese-kartele-btn-2 ${
                      arsyeja
                        ? "kerkese-kartele-btn-3"
                        : "kerkese-kartele-btn-4"
                    }`}
                  >
                    <span>{arsyeja ? reasons.find((r) => r.value === arsyeja)?.label : "Zgjidhni arsyen..."}</span>
                    <ChevronDown size={16} className={`kerkese-kartele-icon-5 ${dropdownOpen ? "kerkese-kartele-icon-6" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="kerkese-kartele-popup">
                      {reasons.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => { setArsyeja(r.value); setDropdownOpen(false); }}
                          className={`kerkese-kartele-btn-5 ${
                            arsyeja === r.value
                              ? "kerkese-kartele-btn-6"
                              : "kerkese-kartele-btn-7"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="kerkese-kartele-label">
                  Përshkrimi (opsional)
                </label>
                <textarea
                  value={pershkrimi}
                  onChange={(e) => setPershkrimi(e.target.value)}
                  placeholder="Shpjegoni shkurtimisht situatën..."
                  rows={3}
                  className="kerkese-kartele-textarea"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="kerkese-kartele-label">
                  Nr. kontaktues
                </label>
                <div className="kerkese-kartele-box-7">
                  <Phone size={15} className="kerkese-kartele-icon-7" />
                  <input
                    type="tel"
                    value={telefoni}
                    onChange={(e) => setTelefoni(e.target.value)}
                    placeholder="+383 4X XXX XXX"
                    className="kerkese-kartele-input"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="kerkese-kartele-label">
                  Adresa e dorëzimit (opsional)
                </label>
                <div className="kerkese-kartele-box-7">
                  <MapPin size={15} className="kerkese-kartele-icon-7" />
                  <input
                    type="text"
                    value={adresa}
                    onChange={(e) => setAdresa(e.target.value)}
                    placeholder="Lini bosh nëse tërhiqni vetë"
                    className="kerkese-kartele-input"
                  />
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="kerkese-kartele-label">
                  Dokumenti mbështetës (opsional)
                </label>
                <label className="kerkese-kartele-label-2">
                  <Upload size={20} className="kerkese-kartele-text-4" />
                  <span className="kerkese-kartele-text-14">
                    Ngarkoni foto ose PDF
                  </span>
                  <input type="file" className="kerkese-kartele-input-2" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!arsyeja || loading}
            className="kerkese-kartele-btn-8"
          >
            {loading ? (
              <svg className="kerkese-kartele-svg" viewBox="0 0 24 24" fill="none">
                <circle className="kerkese-kartele-ring" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="kerkese-kartele-path" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
              </svg>
            ) : (
              <>
                <CreditCard size={18} />
                Dërgo Kërkesën
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Small inline icon placeholder for the book
function BookIconPlaceholder({ size, className }) {
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

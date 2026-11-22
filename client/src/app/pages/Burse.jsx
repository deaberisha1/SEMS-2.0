import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, Clock, XCircle, Download, FileText, Info } from "lucide-react";
import { api } from "../../api";
import "./Burse.css";

const historyData = [
  {
    viti: "2024/25",
    fakulteti: "Fak. i Shkencave Mat. dhe Nat.",
    nota: "8.60",
    dataKerkeses: "15 Tetor 2024",
    statusi: "Aprovuar",
    dataShqyrtimit: "28 Tetor 2024",
    verejtje: "Aprovuar për semestrin vjeshtor",
  },
  {
    viti: "2023/24",
    fakulteti: "Fak. i Shkencave Mat. dhe Nat.",
    nota: "8.45",
    dataKerkeses: "10 Tetor 2023",
    statusi: "Refuzuar",
    dataShqyrtimit: "20 Tetor 2023",
    verejtje: "Kriteret nuk u plotësuan për atë periudhë",
  },
];

const statusConfig = {
  Aprovuar: {
    label: "Aprovuar",
    icon: <CheckCircle2 size={12} />,
    cls: "burse-variant",
  },
  "Në pritje": {
    label: "Në pritje",
    icon: <Clock size={12} />,
    cls: "burse-variant-2",
  },
  Refuzuar: {
    label: "Refuzuar",
    icon: <XCircle size={12} />,
    cls: "burse-variant-3",
  },
};

const kosovarBanks = ["ProCredit Bank", "Raiffeisen Bank", "NLB Bank", "TEB Bank", "BKT", "BPB", "Banka Ekonomike", "Credins Bank"];

export function Burse() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal form state
  const [banka, setBanka] = useState("");
  const [iban, setIban] = useState("");
  const [arsyeja, setArsyeja] = useState("");
  const [docVer, setDocVer] = useState(null);
  const [docTran, setDocTran] = useState(null);
  const [docFam, setDocFam] = useState(null);

  const docVerRef = useRef(null);
  const docTranRef = useRef(null);
  const docFamRef = useRef(null);

  const formatIBAN = (val) => {
    const clean = val.replace(/\s/g, "").toUpperCase();
    const chunks = clean.match(/.{1,4}/g) ?? [];
    return chunks.join(" ").substring(0, 24);
  };

  const canSubmit = banka !== "" && iban.replace(/\s/g, "").length >= 16 && arsyeja.trim().length > 10 && docVer !== null;
  const [sending, setSending] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit() {
    if (sending) return;
    setSending(true);
    try {
      await api.post("/student/requests", {
        type: "Bursë",
        details: {
          banka,
          iban: iban.replace(/\s/g, ""),
          arsyeja,
          dokumentet: [
            docVer?.name,
            docTran?.name,
            docFam?.name,
          ].filter(Boolean),
        },
      });
      setShowModal(false);
      showToast("Aplikimi për bursë u dërgua me sukses. Do të njoftoheni kur të shqyrtohet.");
      setBanka(""); setIban(""); setArsyeja(""); setDocVer(null); setDocTran(null); setDocFam(null);
    } catch (e) {
      showToast(e.message);
    } finally {
      setSending(false);
    }
  }

  function handleReport() {
    showToast("Raporti u gjenerua dhe është shkarkuar.");
  }

  return (
    <div className="burse-box">
      {/* Toast */}
      {toast && (
        <div className="burse-card">
          <CheckCircle2 size={18} className="burse-icon" />
          <span className="burse-text">{toast}</span>
          <button onClick={() => setToast(null)} className="burse-btn">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="burse-stack">
        <h1 className="burse-title">
          Apliko për Bursë
        </h1>
        <p className="burse-text-2">
          Apliko për bursë bazuar në kriteret e Universitetit të Prishtinës.
        </p>
      </div>

      {/* Eligibility card */}
      <div className="burse-card-2">
        <h2 className="burse-title-2">
          Informacioni juaj akademik
        </h2>
        <div className="burse-grid">
          {[
            { label: "Viti akademik", value: "2025/26" },
            { label: "Fakulteti", value: "Fak. Shkencave Mat. dhe Nat." },
            { label: "Programi", value: "Informatikë" },
            { label: "Nota mesatare", value: "8.75" },
            { label: "Statusi", value: "Student i rregullt" },
            { label: "Viti i studimit", value: "Viti 3" },
          ].map((item) => (
            <div key={item.label} className="burse-stack-2">
              <span className="burse-text-3">{item.label}</span>
              <span className="burse-text-4">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="burse-card-3">
        <Info size={18} className="burse-icon-2" />
        <p className="burse-text-5">
          Administrata e UP-së shqyrton aplikimet bazuar në kriteret e brendshme të institucionit.
        </p>
      </div>

      {/* CTA button */}
      <button
        onClick={() => setShowModal(true)}
        className="burse-btn-2"
      >
        Apliko për Bursë
      </button>

      {/* History table */}
      <div className="burse-box-2">
        <div className="burse-row">
          <h2 className="burse-title-3">
            Historiku i Aplikimeve për Bursë
          </h2>
          <button
            onClick={handleReport}
            className="burse-btn-3"
          >
            <Download size={14} />
            Raporti
          </button>
        </div>

        {/* Desktop table */}
        <div className="burse-scroll">
          <table className="burse-table">
            <caption className="sr-only">Historiku i aplikimeve për bursë</caption>
            <thead>
              <tr className="burse-row-2">
                {["Viti akademik", "Fakulteti", "Nota mesatare", "Data e kërkesës", "Statusi", "Data e shqyrtimit", "Vërejtje"].map((h) => (
                  <th scope="col" key={h} className="burse-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, i) => {
                const s = statusConfig[row.statusi];
                return (
                  <tr key={i} className={`burse-row-3 ${i < historyData.length - 1 ? "burse-row-2" : ""}`}>
                    <td className="burse-cell">{row.viti}</td>
                    <td className="burse-cell-2">{row.fakulteti}</td>
                    <td className="burse-cell-3">{row.nota}</td>
                    <td className="burse-cell-4">{row.dataKerkeses}</td>
                    <td className="burse-cell-5">
                      <span className={`burse-badge ${s.cls}`}>
                        {s.icon}
                        {s.label}
                      </span>
                    </td>
                    <td className="burse-cell-4">{row.dataShqyrtimit}</td>
                    <td className="burse-cell-6">{row.verejtje}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="burse-box-3">
          {historyData.map((row, i) => {
            const s = statusConfig[row.statusi];
            return (
              <div key={i} className="burse-box-4">
                <div className="burse-row-4">
                  <span className="burse-text-6">{row.viti}</span>
                  <span className={`burse-badge ${s.cls}`}>
                    {s.icon}{s.label}
                  </span>
                </div>
                <div className="burse-text-7">Nota: <span className="burse-text-8">{row.nota}</span></div>
                <div className="burse-text-3">{row.dataKerkeses} · {row.dataShqyrtimit}</div>
                <div className="burse-text-9">{row.verejtje}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="burse-overlay" onClick={() => setShowModal(false)}>
          <div
            className="burse-scroll-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="burse-row-5">
              <div>
                <h2 className="burse-title-4">Aplikim për Bursë</h2>
                <p className="burse-text-10">Plotëso të dhënat e mëposhtme</p>
              </div>
              <button onClick={() => setShowModal(false)} className="burse-btn-4">
                <X size={18} className="burse-icon-3" />
              </button>
            </div>

            <div className="burse-box-5">
              {/* Të dhënat bankare */}
              <div>
                <h3 className="burse-heading">
                  Të Dhënat Bankare
                </h3>
                <div className="burse-box-6">
                  {/* Banka */}
                  <div>
                    <label className="burse-label">
                      Banka <span className="burse-text-11">*</span>
                    </label>
                    <div className="burse-box-7">
                      <select
                        value={banka}
                        onChange={(e) => setBanka(e.target.value)}
                        className={`burse-select ${
                          banka === "" ? "burse-select-2" : "burse-select-3"
                        }`}
                      >
                        <option value="" disabled>Zgjidhni bankën...</option>
                        {kosovarBanks.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <div className="burse-layer">▾</div>
                    </div>
                  </div>

                  {/* IBAN */}
                  <div>
                    <label className="burse-label">
                      Numri i Llogarisë (IBAN) <span className="burse-text-11">*</span>
                    </label>
                    <input
                      type="text"
                      value={iban}
                      onChange={(e) => setIban(formatIBAN(e.target.value))}
                      placeholder="XK00 0000 0000 0000 0000"
                      maxLength={24}
                      className="burse-input"
                    />
                  </div>

                  {/* Mbajtësi — read only */}
                  <div>
                    <label className="burse-label">
                      Mbajtësi i Llogarisë
                    </label>
                    <input
                      type="text"
                      value="Arta Berisha"
                      readOnly
                      className="burse-input-2"
                    />
                  </div>
                </div>
              </div>

              {/* Dokumente Mbështetëse */}
              <div>
                <h3 className="burse-heading">
                  Dokumente Mbështetëse
                </h3>
                <div className="burse-box-8">
                  {[
                    { label: "Vërtetim Studenti", required: true, file: docVer, setFile: setDocVer, ref: docVerRef },
                    { label: "Transkriptë e notave (opsional)", required: false, file: docTran, setFile: setDocTran, ref: docTranRef },
                    { label: "Dëshmi për të ardhurat familjare (opsional)", required: false, file: docFam, setFile: setDocFam, ref: docFamRef },
                  ].map(({ label, required, file, setFile, ref }) => (
                    <div key={label}>
                      <p className="burse-text-12">
                        {label} {required && <span className="burse-text-11">*</span>}
                      </p>
                      <input
                        ref={ref}
                        type="file"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        className="burse-input-3"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f && f.size <= 10 * 1024 * 1024) setFile(f);
                        }}
                      />
                      {file ? (
                        <div className="burse-card-4">
                          <FileText size={14} className="burse-icon" />
                          <span className="burse-text-13">{file.name}</span>
                          <button type="button" onClick={() => setFile(null)} className="burse-btn-5">
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => ref.current?.click()}
                          className="burse-btn-6"
                        >
                          <Upload size={13} />
                          <span className="burse-text-14">Ngarko skedarin (PDF, DOCX, JPG, PNG)</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arsyeja */}
              <div>
                <label className="burse-label">
                  Arsyeja e Aplikimit <span className="burse-text-11">*</span>
                </label>
                <textarea
                  value={arsyeja}
                  onChange={(e) => setArsyeja(e.target.value)}
                  placeholder="Shpjegoni shkurtimisht arsyet e aplikimit për bursë..."
                  rows={4}
                  className="burse-textarea"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="burse-row-6">
              <button
                onClick={() => setShowModal(false)}
                className="burse-btn-7"
              >
                Anulo
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || sending}
                className="burse-btn-8"
              >
                {sending ? "Duke dërguar…" : "Dërgo Aplikimin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

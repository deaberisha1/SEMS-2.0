import { useState, useRef } from "react";
import { ArrowRightLeft, CheckCircle2, ChevronDown, AlertCircle, Info, Search, Upload, X as XIcon, File } from "lucide-react";
import { api } from "../../api";
import "./TransferimiNotes.css";

const lendetEfituara = [
  { kodi: "CS-101", emri: "Bazat e Programimit", nota: 9, ects: 6, universiteti: "Universiteti i Tetovës", viti: "2022/2023" },
  { kodi: "CS-102", emri: "Matematika për Informatikë", nota: 8, ects: 6, universiteti: "Universiteti i Tetovës", viti: "2022/2023" },
  { kodi: "CS-103", emri: "Hyrje në Rrjeta", nota: 7, ects: 5, universiteti: "Universiteti i Tetovës", viti: "2022/2023" },
  { kodi: "CS-104", emri: "Fizika Kompjuterike", nota: 8, ects: 6, universiteti: "Universiteti i Tetovës", viti: "2022/2023" },
  { kodi: "CS-201", emri: "Strukturat e të Dhënave", nota: 9, ects: 6, universiteti: "Universiteti i Tetovës", viti: "2023/2024" },
  { kodi: "CS-202", emri: "Sistemet Operative Bazike", nota: 6, ects: 5, universiteti: "Universiteti i Tetovës", viti: "2023/2024" },
];

const lendetUP = [
  { kodi: "O-01", emri: "Matematika 1", ects: 7 },
  { kodi: "O-02", emri: "Matematikë Diskrete", ects: 6 },
  { kodi: "O-03", emri: "Qarqet Logjike", ects: 6 },
  { kodi: "O-04", emri: "Fizika 1", ects: 6 },
  { kodi: "O-05", emri: "Arkitektura e Kompjuterëve", ects: 6 },
  { kodi: "O-06", emri: "Bazat e Programimit", ects: 6 },
  { kodi: "O-07", emri: "Programimi Objekt i Orientuar", ects: 6 },
  { kodi: "O-08", emri: "Strukturat e të Dhënave dhe Algoritmet", ects: 6 },
  { kodi: "O-09", emri: "Sistemet Operative", ects: 6 },
  { kodi: "O-10", emri: "Rrjetet Kompjuterike", ects: 6 },
];

function getNotaBg(nota) {
  if (nota >= 9) return "transferimi-notes-nota-bg";
  if (nota >= 7) return "transferimi-notes-nota-bg-2";
  if (nota >= 6) return "transferimi-notes-nota-bg-3";
  return "transferimi-notes-nota-bg-4";
}

export function TransferimiNotes() {
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState(new Set());
  const [mappings, setMappings] = useState({});
  const [syllabi, setSyllabi] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchUP, setSearchUP] = useState({});
  const [arsyeja, setArsyeja] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRefs = useRef({});

  const toggleSource = (kodi) => {
    setSelectedSource((prev) => {
      const next = new Set(prev);
      if (next.has(kodi)) {
        next.delete(kodi);
        const m = { ...mappings };
        delete m[kodi];
        setMappings(m);
      } else {
        next.add(kodi);
      }
      return next;
    });
  };

  const setMapping = (sourceKodi, targetKodi) => {
    setMappings((prev) => ({ ...prev, [sourceKodi]: targetKodi }));
    setOpenDropdown(null);
  };

  const selectedLendet = lendetEfituara.filter((l) => selectedSource.has(l.kodi));
  const allMapped = selectedLendet.length > 0 && selectedLendet.every((l) => mappings[l.kodi] && syllabi[l.kodi]);

  const handleSubmit = () => {
    setLoading(true);
    api
      .post("/student/requests", { type: "Transferim i notave", details: { courses: selectedLendet.map((l) => ({ from: l.kodi, to: mappings[l.kodi] })), reason: arsyeja } })
      .then(() => setSubmitted(true))
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  };

  if (submitted) {
    return (
      <div className="transferimi-notes-row">
        <div className="transferimi-notes-card">
          <div className="transferimi-notes-avatar">
            <CheckCircle2 size={40} className="transferimi-notes-icon" />
          </div>
          <h2 className="transferimi-notes-title">Kërkesa u dërgua!</h2>
          <p className="transferimi-notes-text">
            Transferimi i {selectedLendet.length} lëndëve u dërgua për shqyrtim.
          </p>
          <p className="transferimi-notes-text-2">
            Numri i kërkesës: <span className="transferimi-notes-text-3">#TRF-2026-00213</span>
          </p>
          <div className="transferimi-notes-card-2">
            <div className="transferimi-notes-row-2">
              <span className="transferimi-notes-text-4">Lëndë të transferuara</span>
              <span className="transferimi-notes-text-5">{selectedLendet.length}</span>
            </div>
            <div className="transferimi-notes-row-2">
              <span className="transferimi-notes-text-4">Statusi</span>
              <span className="transferimi-notes-text-6">Në shqyrtim</span>
            </div>
            <div className="transferimi-notes-row-2">
              <span className="transferimi-notes-text-4">Koha e pritjes</span>
              <span className="transferimi-notes-text-7">5–10 ditë pune</span>
            </div>
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setSelectedSource(new Set()); setMappings({}); setArsyeja(""); }}
            className="transferimi-notes-btn"
          >
            Kërko sërisht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transferimi-notes-box">
      <div className="transferimi-notes-box-2">

        {/* Header */}
        <div className="transferimi-notes-text-8">
          <div className="transferimi-notes-row-3">
            <div className="transferimi-notes-icon-box">
              <ArrowRightLeft size={20} className="transferimi-notes-icon-2" />
            </div>
            <h1 className="transferimi-notes-title-2">
              Transferimi i Notës
            </h1>
          </div>
          <p className="transferimi-notes-text-9">
            Kërkoni njohjen e lëndëve të fituara në universitete tjera
          </p>
        </div>

        {/* Step indicator */}
        <div className="transferimi-notes-row-4">
          {[
            { n: 1, label: "Zgjidhni lëndët" },
            { n: 2, label: "Maponi ekuivalentet" },
            { n: 3, label: "Konfirmoni" },
          ].map(({ n, label }, i) => (
            <div key={n} className="transferimi-notes-row-5">
              <div className="transferimi-notes-stack">
                <div className={`transferimi-notes-avatar-2 ${
                  step > n
                    ? "transferimi-notes-box-3"
                    : step === n
                    ? "transferimi-notes-box-4"
                    : "transferimi-notes-box-5"
                }`}>
                  {step > n ? <CheckCircle2 size={16} /> : n}
                </div>
                <span className={`transferimi-notes-text-10 ${
                  step === n ? "transferimi-notes-text-11" : "transferimi-notes-text-4"
                }`}>{label}</span>
              </div>
              {i < 2 && (
                <div className={`transferimi-notes-box-6 ${
                  step > n ? "transferimi-notes-box-7" : "transferimi-notes-box-8"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Select source subjects ── */}
        {step === 1 && (
          <div className="transferimi-notes-box-9">
            <div className="transferimi-notes-card-3">
              <Info size={16} className="transferimi-notes-icon-3" />
              <p className="transferimi-notes-text-12">
                Zgjidhni lëndët nga universiteti juaj i mëparshëm që dëshironi t'i transferoni.
              </p>
            </div>

            <div className="transferimi-notes-box-10">
              <div className="transferimi-notes-row-6">
                <span className="transferimi-notes-text-13">
                  Lëndët e universitetit tjetër
                </span>
                <span className="transferimi-notes-text-14">
                  {selectedSource.size} zgjedhur
                </span>
              </div>
              <div className="transferimi-notes-box-11">
                {lendetEfituara.map((l) => {
                  const sel = selectedSource.has(l.kodi);
                  return (
                    <button
                      key={l.kodi}
                      onClick={() => toggleSource(l.kodi)}
                      className={`transferimi-notes-btn-2 ${
                        sel ? "transferimi-notes-btn-3" : ""
                      }`}
                    >
                      <div className={`transferimi-notes-avatar-3 ${
                        sel
                          ? "transferimi-notes-box-12"
                          : "transferimi-notes-box-13"
                      }`}>
                        {sel && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="transferimi-notes-box-14">
                        <div className="transferimi-notes-text-15">{l.emri}</div>
                        <div className="transferimi-notes-text-16">{l.kodi} · {l.universiteti} · {l.viti}</div>
                      </div>
                      <div className="transferimi-notes-row-7">
                        <span className={`transferimi-notes-dot ${getNotaBg(l.nota)}`}>
                          {l.nota}
                        </span>
                        <span className="transferimi-notes-text-16">{l.ects} ECTS</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={selectedSource.size === 0}
              onClick={() => setStep(2)}
              className="transferimi-notes-btn-4"
            >
              Vazhdo ({selectedSource.size} lëndë)
            </button>
          </div>
        )}

        {/* ── STEP 2: Map to UP subjects ── */}
        {step === 2 && (
          <div className="transferimi-notes-box-9">
            <div className="transferimi-notes-card-4">
              <AlertCircle size={16} className="transferimi-notes-icon-4" />
              <p className="transferimi-notes-text-17">
                Për secilën lëndë zgjidhni ekuivalentin në programin e UP-së. Komisioni do të shqyrtojë kërkesat tuaja.
              </p>
            </div>

            <div className="transferimi-notes-box-15">
              {selectedLendet.map((l) => {
                const isOpen = openDropdown === l.kodi;
                const search = searchUP[l.kodi] ?? "";
                const filtered = lendetUP.filter((u) =>
                  u.emri.toLowerCase().includes(search.toLowerCase()) || u.kodi.toLowerCase().includes(search.toLowerCase())
                );
                const chosen = lendetUP.find((u) => u.kodi === mappings[l.kodi]);

                return (
                  <div key={l.kodi} className="transferimi-notes-card-5">
                    {/* Source */}
                    <div className="transferimi-notes-row-8">
                      <span className={`transferimi-notes-dot-2 ${getNotaBg(l.nota)}`}>
                        {l.nota}
                      </span>
                      <div className="transferimi-notes-box-14">
                        <div className="transferimi-notes-text-18">{l.emri}</div>
                        <div className="transferimi-notes-text-16">{l.kodi} · {l.ects} ECTS · {l.universiteti}</div>
                      </div>
                    </div>

                    <div className="transferimi-notes-row-9">
                      <div className="transferimi-notes-divider" />
                      <ArrowRightLeft size={13} className="transferimi-notes-text-4" />
                      <div className="transferimi-notes-divider" />
                    </div>

                    {/* Target dropdown */}
                    <div className="transferimi-notes-box-16">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(isOpen ? null : l.kodi)}
                        className={`transferimi-notes-btn-5 ${
                          chosen
                            ? "transferimi-notes-btn-6"
                            : "transferimi-notes-btn-7"
                        }`}
                      >
                        <span className="transferimi-notes-text-19">{chosen ? `${chosen.kodi} · ${chosen.emri}` : "Zgjidhni lëndën ekuivalente..."}</span>
                        <ChevronDown size={15} className={`transferimi-notes-icon-5 ${isOpen ? "transferimi-notes-icon-6" : ""}`} />
                      </button>

                      {isOpen && (
                        <div className="transferimi-notes-popup">
                          <div className="transferimi-notes-box-17">
                            <div className="transferimi-notes-card-6">
                              <Search size={13} className="transferimi-notes-text-4" />
                              <input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearchUP({ ...searchUP, [l.kodi]: e.target.value })}
                                placeholder="Kërko lëndën..."
                                className="transferimi-notes-input"
                              />
                            </div>
                          </div>
                          <div className="transferimi-notes-scroll">
                            {filtered.map((u) => (
                              <button
                                key={u.kodi}
                                type="button"
                                onClick={() => setMapping(l.kodi, u.kodi)}
                                className={`transferimi-notes-btn-8 ${
                                  mappings[l.kodi] === u.kodi
                                    ? "transferimi-notes-btn-9"
                                    : "transferimi-notes-btn-10"
                                }`}
                              >
                                <span className="transferimi-notes-text-20">{u.kodi}</span> · {u.emri}
                                <span className="transferimi-notes-text-21">({u.ects} ECTS)</span>
                              </button>
                            ))}
                            {filtered.length === 0 && (
                              <div className="transferimi-notes-box-18">Asnjë lëndë</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Syllabus file upload */}
                    <div className="transferimi-notes-text-22">
                      <label className="transferimi-notes-label">
                        Ngarko Syllabusin e Lëndës <span className="transferimi-notes-text-23">*</span>
                      </label>
                      <input
                        ref={(el) => { fileRefs.current[l.kodi] = el; }}
                        type="file"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        className="transferimi-notes-input-2"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert("Madhësia maksimale e skedarit është 10 MB.");
                              return;
                            }
                            setSyllabi((prev) => ({ ...prev, [l.kodi]: file }));
                          }
                        }}
                      />
                      {syllabi[l.kodi] ? (
                        <div className="transferimi-notes-card-7">
                          <File size={14} className="transferimi-notes-icon-7" />
                          <span className="transferimi-notes-text-24">{syllabi[l.kodi].name}</span>
                          <button
                            type="button"
                            onClick={() => setSyllabi((prev) => { const n = { ...prev }; delete n[l.kodi]; return n; })}
                            className="transferimi-notes-btn-11"
                          >
                            <XIcon size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRefs.current[l.kodi]?.click()}
                          className="transferimi-notes-btn-12"
                        >
                          <Upload size={14} />
                          <span className="transferimi-notes-text-25">Zgjidh skedarin (PDF, DOCX, JPG, PNG · max 10 MB)</span>
                        </button>
                      )}
                      <p className="transferimi-notes-text-26">
                        Komisioni e shqyrton kërkesën më shpejt nëse ngarkoni syllabusin e lëndës nga universiteti i mëparshëm.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="transferimi-notes-row-10">
              <button
                onClick={() => setStep(1)}
                className="transferimi-notes-btn-13"
              >
                Prapa
              </button>
              <button
                disabled={!allMapped}
                onClick={() => setStep(3)}
                className="transferimi-notes-btn-14"
              >
                Vazhdo
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && (
          <div className="transferimi-notes-box-9">
            <div className="transferimi-notes-box-10">
              <div className="transferimi-notes-box-19">
                <span className="transferimi-notes-text-13">
                  Përmbledhja e transferimit
                </span>
              </div>
              <div className="transferimi-notes-box-11">
                {selectedLendet.map((l) => {
                  const target = lendetUP.find((u) => u.kodi === mappings[l.kodi]);
                  return (
                    <div key={l.kodi} className="transferimi-notes-box-20">
                      <div className="transferimi-notes-row-11">
                        <div className="transferimi-notes-box-14">
                          <div className="transferimi-notes-text-27">Nga</div>
                          <div className="transferimi-notes-text-28">{l.emri}</div>
                          <div className="transferimi-notes-text-29">{l.universiteti} · Nota {l.nota} · {l.ects} ECTS</div>
                        </div>
                        <ArrowRightLeft size={16} className="transferimi-notes-icon-8" />
                        <div className="transferimi-notes-box-21">
                          <div className="transferimi-notes-text-27">Tek</div>
                          <div className="transferimi-notes-text-30">{target?.emri}</div>
                          <div className="transferimi-notes-text-29">UP Prishtinë · {target?.ects} ECTS</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note field */}
            <div className="transferimi-notes-card-8">
              <label className="transferimi-notes-label-2">
                Shënim shtesë (opsional)
              </label>
              <textarea
                value={arsyeja}
                onChange={(e) => setArsyeja(e.target.value)}
                placeholder="Shpjegim shtesë për komisionin shqyrtues..."
                rows={3}
                className="transferimi-notes-textarea"
              />
            </div>

            <div className="transferimi-notes-row-10">
              <button
                onClick={() => setStep(2)}
                className="transferimi-notes-btn-13"
              >
                Prapa
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="transferimi-notes-btn-15"
              >
                {loading ? (
                  <svg className="transferimi-notes-svg" viewBox="0 0 24 24" fill="none">
                    <circle className="transferimi-notes-ring" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="transferimi-notes-path" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                ) : (
                  <>
                    <ArrowRightLeft size={16} />
                    Dërgo Kërkesën
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

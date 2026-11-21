import { useState, useEffect } from "react";
import { Download, FileText, ChevronDown, Lock, Printer, Search } from "lucide-react";
import { api } from "../../api";
import "./Vertetimet.css";

function DocumentPreview({ lloji, gjuha }) {
  const isEnglish = gjuha === "Anglisht" || gjuha === "Dygjuhësh (SQ/EN)";
  const isBilingual = gjuha === "Dygjuhësh (SQ/EN)";

  const titleSQ = lloji === "Vërtetim i statusit studentor" ? "VËRTETIM" :
    lloji === "Vërtetim për notat e kaluara" ? "VËRTETIM NOTASH" :
    lloji === "Vërtetim për bursë" ? "VËRTETIM PËR BURSË" :
    lloji === "Vërtetim për vizë" ? "VËRTETIM PËR VIZË" : "VËRTETIM";

  const titleEN = lloji === "Vërtetim i statusit studentor" ? "CERTIFICATE" :
    lloji === "Vërtetim për notat e kaluara" ? "GRADE CERTIFICATE" :
    lloji === "Vërtetim për bursë" ? "SCHOLARSHIP CERTIFICATE" :
    lloji === "Vërtetim për vizë" ? "CERTIFICATE FOR VISA" : "CERTIFICATE";

  const bodySQ = `Vërtetohet se studenti/studentja Arta Berisha, me numër studentor 202012345678, është e regjistruar në vitin akademik 2025/26 në programin Informatikë, viti 3, në Fakultetin e Shkencave Matematike dhe Natyrore, Universiteti i Prishtinës "Hasan Prishtina".`;
  const bodyEN = `This is to certify that the student Arta Berisha, student ID 202012345678, is enrolled in the academic year 2025/26 in the programme Computer Science, year 3, at the Faculty of Mathematical and Natural Sciences, University of Pristina "Hasan Prishtina".`;

  return (
    <div className="vertetimet-stack">
      {/* Header */}
      <div className="vertetimet-row">
        <div className="vertetimet-avatar">
          <span className="vertetimet-text">UP</span>
        </div>
        <div className="vertetimet-box">
          <div className="vertetimet-text-2">UNIVERSITETI I PRISHTINËS</div>
          <div className="vertetimet-text-3">"Hasan Prishtina"</div>
          {isBilingual && <div className="vertetimet-text-4">University of Pristina "Hasan Prishtina"</div>}
          <div className="vertetimet-text-5">Fakulteti i Shkencave Matematike dhe Natyrore</div>
        </div>
        <div className="vertetimet-text-6">
          <div>Nr. Dok: VRT-2026-001</div>
          <div>Data: 20.05.2026</div>
        </div>
      </div>

      {/* Title */}
      <div className="vertetimet-text-7">
        <div className="vertetimet-box-2">
          {isEnglish && !isBilingual ? titleEN : titleSQ}
        </div>
        {isBilingual && (
          <div className="vertetimet-text-8">{titleEN}</div>
        )}
      </div>

      {/* Body */}
      <div className="vertetimet-box-3">
        <p className="vertetimet-text-9">
          {isEnglish && !isBilingual ? bodyEN : bodySQ}
        </p>
        {isBilingual && (
          <p className="vertetimet-text-10">
            {bodyEN}
          </p>
        )}

        <div className="vertetimet-box-4">
          <div className="vertetimet-row-2">
            <span className="vertetimet-text-11">Viti akademik:</span>
            <span className="vertetimet-text-12">2025/26</span>
          </div>
          <div className="vertetimet-row-2">
            <span className="vertetimet-text-11">Programi:</span>
            <span className="vertetimet-text-12">Informatikë</span>
          </div>
          <div className="vertetimet-row-2">
            <span className="vertetimet-text-11">Statusi:</span>
            <span className="vertetimet-text-12">Student i rregullt</span>
          </div>
        </div>

        <p className="vertetimet-text-13">
          Ky vërtetim lëshohet me kërkesë të studentit për qëllime zyrtare dhe është i vlefshëm me kodin unik të verifikimit.
        </p>
      </div>

      {/* Footer */}
      <div className="vertetimet-row-3">
        <div className="vertetimet-text-14">
          <div className="vertetimet-avatar-2">
            <span className="vertetimet-text-15">VULA</span>
          </div>
        </div>
        <div className="vertetimet-box-5">
          <div className="vertetimet-text-16">Prishtinë, {new Date().toLocaleDateString("sq-AL")}</div>
        </div>
        <div className="vertetimet-text-14">
          <div className="vertetimet-box-6" />
          <div className="vertetimet-text-17">Dekani</div>
          <div className="vertetimet-text-18">Nënshkrim / Signature</div>
        </div>
      </div>
    </div>
  );
}

export function Vertetimet() {
  const [activeTab, setActiveTab] = useState("gjenero");
  const [lloji, setLloji] = useState("Vërtetim i statusit studentor");
  const [gjuha, setGjuha] = useState("Shqip");
  const [arsyeja, setArsyeja] = useState("");

  const llojet = [
    "Vërtetim i statusit studentor",
    "Vërtetim për notat e kaluara",
    "Vërtetim për bursë",
    "Vërtetim për vizë",
    "Vërtetim për konvikt",
  ];

  const gjuhet = ["Shqip", "Anglisht", "Dygjuhësh (SQ/EN)"];

  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    api.get("/student/certificates").then(setCertificates).catch(() => {});
  }, []);

  async function handleGenerate() {
    if (sending) return;
    setSending(true);
    setMsg(null);
    try {
      const cert = await api.post("/student/certificates", {
        lloji,
        gjuha,
        arsyeja,
      });
      setCertificates((prev) => [cert, ...prev]);
      setMsg({ type: "ok", text: "Vërtetimi u gjenerua me sukses." });
      setArsyeja("");
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="vertetimet-box-7">
      <div className="">
        {/* Header */}
        <div className="vertetimet-text-19">
          <h1 className="vertetimet-title">
            Vërtetimet
          </h1>
          <p className="vertetimet-text-20">
            Gjenero dhe shkarko vërtetime zyrtare me kod verifikimi
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="vertetimet-card">
          <button
            onClick={() => setActiveTab("gjenero")}
            className={`vertetimet-btn ${
              activeTab === "gjenero"
                ? "vertetimet-btn-2"
                : "vertetimet-btn-3"
            }`}
          >
            Gjenero Vërtetim
          </button>
          <button
            onClick={() => setActiveTab("historiku")}
            className={`vertetimet-btn ${
              activeTab === "historiku"
                ? "vertetimet-btn-2"
                : "vertetimet-btn-3"
            }`}
          >
            Historiku i Vërtetimeve
          </button>
        </div>

        {activeTab === "gjenero" ? (
          <div className="vertetimet-grid">
            {/* Form */}
            <div className="vertetimet-box-8">
              <div className="vertetimet-box-9">
                <div className="vertetimet-box-10">
                  <h3 className="vertetimet-heading">
                    Të dhënat e vërtetimit
                  </h3>
                </div>

                <div className="vertetimet-box-11">
                  <div>
                    <label className="vertetimet-label">
                      Lloji i vërtetimit
                    </label>
                    <div className="vertetimet-box-12">
                      <select
                        value={lloji}
                        onChange={(e) => setLloji(e.target.value)}
                        className="vertetimet-select"
                      >
                        {llojet.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="vertetimet-icon" />
                    </div>
                  </div>

                  <div>
                    <label className="vertetimet-label">
                      Gjuha e dokumentit
                    </label>
                    <div className="vertetimet-row-4">
                      {gjuhet.map((g) => (
                        <button
                          key={g}
                          onClick={() => setGjuha(g)}
                          className={`vertetimet-btn-4 ${
                            gjuha === g
                              ? "vertetimet-btn-5"
                              : "vertetimet-btn-6"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="vertetimet-label">
                      Qëllimi / Destinacioni (opsional)
                    </label>
                    <input
                      type="text"
                      value={arsyeja}
                      onChange={(e) => setArsyeja(e.target.value)}
                      placeholder="psh. Për aplikim për vizë..."
                      className="vertetimet-input"
                    />
                  </div>
                </div>

                <div className="vertetimet-box-13">
                  <button
                    className="vertetimet-btn-7"
                    onClick={handleGenerate}
                    disabled={sending}
                  >
                    <FileText size={18} />
                    {sending ? "Duke gjeneruar..." : "Gjenero Dokumentin"}
                  </button>
                  {msg && (
                    <p style={{ color: msg.type === "ok" ? "#34C759" : "#FF3B30", fontSize: "0.85rem", marginTop: 8 }}>
                      {msg.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="vertetimet-card-2">
                <Lock size={20} className="vertetimet-icon-2" />
                <div>
                  <h4 className="vertetimet-heading-2">
                    Dokument i vlefshëm ligjërisht
                  </h4>
                  <p className="vertetimet-text-21">
                    Vërtetimet e gjeneruara online përmbajnë kodin unik të verifikimit (QR Code)
                    dhe janë të vlefshme pa vulë të njomë apo nënshkrim fizik.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Right Sidebar */}
            <div className="vertetimet-box-14">
              <h3 className="vertetimet-heading-3">
                Pamja Paraprake
              </h3>
              <div className="vertetimet-box-15">
                <DocumentPreview lloji={lloji} gjuha={gjuha} />
              </div>
            </div>
          </div>
        ) : (
          <div className="vertetimet-box-9">
            <div className="vertetimet-row-5">
              <h3 className="vertetimet-heading">
                Vërtetimet e gjeneruara më parë
              </h3>
              <div className="vertetimet-box-12">
                <Search size={14} className="vertetimet-icon-3" />
                <input
                  type="text"
                  placeholder="Kërko..."
                  className="vertetimet-input-2"
                />
              </div>
            </div>

            <div className="vertetimet-box-16">
              {certificates.length === 0 ? (
                <p style={{ textAlign: "center", color: "#8E8E93", padding: "2rem 0" }}>
                  Nuk keni vërtetimë të gjeneruara.
                </p>
              ) : certificates.map((item) => (
                <div key={item.id || item._id} className="vertetimet-stack-2">
                  <div className="vertetimet-row-6">
                    <div className="vertetimet-icon-box">
                      <FileText size={20} className="vertetimet-icon-4" />
                    </div>
                    <div>
                      <div className="vertetimet-heading-2">
                        {item.lloji}
                      </div>
                      <div className="vertetimet-row-7">
                        <span className="vertetimet-badge">
                          {item.id}
                        </span>
                        <span>•</span>
                        <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
                        <span>•</span>
                        <span>{item.gjuha}</span>
                      </div>
                    </div>
                  </div>

                  <div className="vertetimet-row-8">
                    <span className={`vertetimet-badge-2 ${
                      item.statusi === "E vlefshme"
                        ? "vertetimet-text-22"
                        : "vertetimet-text-23"
                    }`}>
                      {item.statusi}
                    </span>
                    <button className="vertetimet-btn-8">
                      <Download size={16} />
                    </button>
                    <button className="vertetimet-btn-9">
                      <Printer size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

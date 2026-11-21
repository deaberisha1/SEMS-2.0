import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Check,
  Upload,
  File,
  X,
  Clock,
  CheckCircle,
  FileSearch,
  BookOpen,
  Award,
} from "lucide-react";
import { api } from "../../api";

import "./RivleresimiRegjistro.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const COURSES = [
  { emri: "Teoria e Gjasës",         profesor: "Prof. Bujar Fejzullahu", color: "#007AFF", darkColor: "#0A84FF" },
  { emri: "UX/UI Design",             profesor: "Prof. Korab Rrmoku",    color: "#FF2D55", darkColor: "#FF375F" },
  { emri: "Siguria e të Dhënave",    profesor: "Prof. Artan Berisha",   color: "#34C759", darkColor: "#32D74B" },
  { emri: "OOP / GUI",                profesor: "Prof. Faton Berisha",   color: "#5856D6", darkColor: "#5E5CE6" },
  { emri: "Inteligjenca Artificiale", profesor: "Prof. Eliot Bytyçi",   color: "#FF9500", darkColor: "#FF9F0A" },
];

const MONTHS = ["Janar","Shkurt","Mars","Prill","Maj","Qershor","Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor"];

function statusMeta(status) {
  switch (status) {
    case "Aprovuar":  return { color: "rivleresimi-regjistro-color", bg: "rivleresimi-regjistro-bg",  Icon: CheckCircle };
    case "Refuzuar":  return { color: "rivleresimi-regjistro-color-2", bg: "rivleresimi-regjistro-bg-2",  Icon: X };
    default:          return { color: "rivleresimi-regjistro-color-3", bg: "rivleresimi-regjistro-bg-3",  Icon: Clock };
  }
}

// ─── Course card ──────────────────────────────────────────────────────────────

function CourseCard({
  course,
  selected,
  onSelect,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rivleresimi-regjistro-btn ${
        selected
          ? "rivleresimi-regjistro-btn-2"
          : "rivleresimi-regjistro-btn-3"
      }`}
    >
      {/* Color bar */}
      <div className="rivleresimi-regjistro-box" style={{ backgroundColor: course.color }} />
      <div className="rivleresimi-regjistro-box-2" style={{ backgroundColor: course.darkColor }} />

      <div className="rivleresimi-regjistro-box-3">
        <div className="rivleresimi-regjistro-row">
          <div
            className="rivleresimi-regjistro-icon-box"
            style={{ backgroundColor: `${course.color}18` }}
          >
            <BookOpen size={16} className="rivleresimi-regjistro-icon" style={{ color: course.color }} />
            <BookOpen size={16} className="rivleresimi-regjistro-icon-2" style={{ color: course.darkColor }} />
          </div>
          <div
            className={`rivleresimi-regjistro-avatar ${
              selected
                ? "rivleresimi-regjistro-box-4"
                : "rivleresimi-regjistro-box-5"
            }`}
          >
            {selected && <Check size={11} className="rivleresimi-regjistro-icon-3" strokeWidth={2.5} />}
          </div>
        </div>

        <div className="rivleresimi-regjistro-box-6">
          {course.emri}
        </div>
        <div className="rivleresimi-regjistro-text">{course.profesor}</div>

        <div className="rivleresimi-regjistro-row-2">
          <Award size={11} />
          6 ECTS
        </div>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RivleresimiRegjistro() {
  const [activeTab, setActiveTab] = useState("regjistro");
  const [formOpen, setFormOpen]   = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [arsyeja, setArsyeja]     = useState("");
  const [detaje, setDetaje]       = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [toast, setToast]         = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    api.get("/student/requests").then((data) => {
      const rivleresime = data
        .filter((r) => r.type === "Rivlerësim")
        .map((r) => ({
          id: r.id,
          lenda: r.details?.lenda || r.type,
          profesor: r.details?.profesor || "",
          data: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("sq-AL")
            : "",
          status: r.status,
        }));
      setSubmissions(rivleresime);
    }).catch(() => {});
  }, []);

  const canSubmit =
    selectedCourse !== null &&
    arsyeja.trim().length > 0 &&
    detaje.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || !selectedCourse || sending) return;
    setSending(true);
    setMsg(null);
    try {
      const res = await api.post("/student/requests", {
        type: "Rivlerësim",
        details: {
          lenda: selectedCourse.emri,
          profesor: selectedCourse.profesor,
          arsyeja,
          detaje,
        },
      });
      setSubmissions((prev) => [
        {
          id: res.id,
          lenda: selectedCourse.emri,
          profesor: selectedCourse.profesor,
          data: new Date().toLocaleDateString("sq-AL"),
          status: res.status || "Në pritje",
        },
        ...prev,
      ]);
      resetForm();
      setToast(true);
      setTimeout(() => setActiveTab("rezultatet"), 1200);
      setTimeout(() => setToast(false), 4500);
    } catch (e) {
      setMsg({ type: "err", text: e.message });
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setFormOpen(false);
    setSelectedCourse(null);
    setArsyeja("");
    setDetaje("");
    setUploadedFile(null);
  }

  return (
    <div className="rivleresimi-regjistro-box-7">
      <div className="">

        {/* Page header */}
        <div className="rivleresimi-regjistro-text-2">
          <h1 className="rivleresimi-regjistro-title">
            Regjistro Kërkesën për Rivlerësim
          </h1>
          <p className="rivleresimi-regjistro-text-3">
            Zgjidhni lëndën dhe jepni arsyetimin për rivlerësim
          </p>
        </div>

        {/* Success toast */}
        {toast && (
          <div className="rivleresimi-regjistro-card">
            <div className="rivleresimi-regjistro-avatar-2">
              <Check size={13} className="rivleresimi-regjistro-icon-3" strokeWidth={2.5} />
            </div>
            <span className="rivleresimi-regjistro-text-4">
              Kërkesa për rivlerësim u dërgua me sukses. Profesori do të njoftohet.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="rivleresimi-regjistro-card-2">
          {(["regjistro", "rezultatet"]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rivleresimi-regjistro-btn-4 ${
                activeTab === tab
                  ? "rivleresimi-regjistro-btn-5"
                  : "rivleresimi-regjistro-btn-6"
              }`}
            >
              {tab === "regjistro"
                ? "Regjistro"
                : `Rezultatet${submissions.length > 0 ? ` (${submissions.length})` : ""}`}
            </button>
          ))}
        </div>

        {/* ── TAB: Regjistro ─────────────────────────────────────────────────── */}
        {activeTab === "regjistro" && (
          <>
            {/* STEP 1 — CTA */}
            {!formOpen && (
              <div className="rivleresimi-regjistro-card-3">
                <div className="rivleresimi-regjistro-icon-box-2">
                  <BookOpen size={28} className="rivleresimi-regjistro-icon-4" />
                </div>
                <h2 className="rivleresimi-regjistro-title-2">
                  Regjistro një kërkesë të re
                </h2>
                <p className="rivleresimi-regjistro-text-5">
                  Zgjidhni lëndën dhe jepni arsyetimin për rivlerësim të notës tuaj
                </p>
                <button
                  onClick={() => setFormOpen(true)}
                  className="rivleresimi-regjistro-btn-7"
                >
                  <Plus size={17} />
                  Regjistro Kërkesë të Re
                </button>
              </div>
            )}

            {/* STEP 2 + 3 — expanded form */}
            {formOpen && (
              <div className="rivleresimi-regjistro-box-8">

                {/* Step 2 header */}
                <div className="rivleresimi-regjistro-row-3">
                  <div>
                    <h2 className="rivleresimi-regjistro-title-3">
                      Zgjidhni Lëndën
                    </h2>
                    <p className="rivleresimi-regjistro-text-6">
                      Klikoni mbi lëndën për të cilën dëshironi rivlerësim
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="rivleresimi-regjistro-btn-8"
                    title="Mbyll"
                  >
                    <X size={18} className="rivleresimi-regjistro-icon-5" />
                  </button>
                </div>

                {/* Step 2 — course cards grid */}
                <div className="rivleresimi-regjistro-grid">
                  {COURSES.map((course) => (
                    <CourseCard
                      key={course.emri}
                      course={course}
                      selected={selectedCourse?.emri === course.emri}
                      onSelect={() =>
                        setSelectedCourse(
                          selectedCourse?.emri === course.emri ? null : course
                        )
                      }
                    />
                  ))}
                </div>

                {/* Step 3 — reason card (only after course selected) */}
                {selectedCourse && (
                  <div className="rivleresimi-regjistro-box-9">

                    {/* Card header */}
                    <div className="rivleresimi-regjistro-row-4">
                      <h3 className="rivleresimi-regjistro-heading">
                        Arsyetimi për Rivlerësim
                      </h3>
                      <span className="rivleresimi-regjistro-badge">
                        <BookOpen size={11} />
                        {selectedCourse.emri}
                      </span>
                    </div>

                    <div className="rivleresimi-regjistro-box-10">

                      {/* Arsyeja */}
                      <div>
                        <label className="rivleresimi-regjistro-label">
                          Arsyeja e kërkesës <span className="rivleresimi-regjistro-text-7">*</span>
                        </label>
                        <input
                          type="text"
                          value={arsyeja}
                          onChange={(e) => setArsyeja(e.target.value)}
                          placeholder="p.sh. Mospajtim me notën, Gabim teknik në vlerësim, Mungesë pikësh..."
                          className="rivleresimi-regjistro-input"
                        />
                      </div>

                      {/* Detaje */}
                      <div>
                        <label className="rivleresimi-regjistro-label">
                          Shpjegim i detajuar <span className="rivleresimi-regjistro-text-7">*</span>
                        </label>
                        <textarea
                          value={detaje}
                          onChange={(e) => setDetaje(e.target.value)}
                          placeholder="Shpjegoni me detaje pse kërkoni rivlerësim. Përshkruani cilat pyetje ose detyra mendoni se janë vlerësuar gabimisht, dhe çfarë rezultati prisni..."
                          style={{ minHeight: 120 }}
                          className="rivleresimi-regjistro-textarea"
                        />
                      </div>

                      {/* File upload */}
                      <div>
                        <label className="rivleresimi-regjistro-label">
                          Dëshmi{" "}
                          <span className="rivleresimi-regjistro-text-8">
                            (opsionale)
                          </span>
                        </label>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="rivleresimi-regjistro-input-2"
                          onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                        />
                        {uploadedFile ? (
                          <div className="rivleresimi-regjistro-card-4">
                            <File size={16} className="rivleresimi-regjistro-icon-6" />
                            <span className="rivleresimi-regjistro-text-9">
                              {uploadedFile.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setUploadedFile(null)}
                              className="rivleresimi-regjistro-btn-9"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="hover-group rivleresimi-regjistro-btn-10"
                          >
                            <Upload size={20} className="rivleresimi-regjistro-icon-7" />
                            <span className="rivleresimi-regjistro-text-10">
                              Ngarko foto ose dokument (PDF, JPG, PNG — max 10MB)
                            </span>
                          </button>
                        )}
                      </div>

                      {msg && <p style={{ color: msg.type === "ok" ? "#34C759" : "#FF3B30", fontSize: "0.85rem" }}>{msg.text}</p>}

                      <div className="rivleresimi-regjistro-row-5">
                        <button
                          onClick={resetForm}
                          className="rivleresimi-regjistro-btn-11"
                        >
                          Anulo
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!canSubmit || sending}
                          className="rivleresimi-regjistro-btn-12"
                        >
                          {sending ? "Duke dërguar…" : "Dërgo Kërkesën"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── TAB: Rezultatet ────────────────────────────────────────────────── */}
        {activeTab === "rezultatet" && (
          <>
            {submissions.length === 0 ? (
              <div className="rivleresimi-regjistro-card-5">
                <div className="rivleresimi-regjistro-icon-box-3">
                  <FileSearch size={24} className="rivleresimi-regjistro-icon-8" />
                </div>
                <p className="rivleresimi-regjistro-text-11">
                  Asnjë kërkesë aktive
                </p>
                <p className="rivleresimi-regjistro-text-12">
                  Nuk keni kërkesa aktive për rivlerësim.
                </p>
              </div>
            ) : (
              <div className="rivleresimi-regjistro-box-9">
                {submissions.map((sub, i) => {
                  const { color, bg, Icon } = statusMeta(sub.status);
                  return (
                    <div
                      key={sub.id}
                      className={`rivleresimi-regjistro-row-6 ${
                        i < submissions.length - 1 ? "rivleresimi-regjistro-box-11" : ""
                      }`}
                    >
                      <div className={`rivleresimi-regjistro-icon-box-4 ${bg}`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div className="rivleresimi-regjistro-box-12">
                        <div className="rivleresimi-regjistro-text-13">
                          {sub.lenda}
                        </div>
                        <div className="rivleresimi-regjistro-row-7">
                          <span className="rivleresimi-regjistro-text-14">{sub.profesor}</span>
                          <span className="rivleresimi-regjistro-text-15">•</span>
                          <span className="rivleresimi-regjistro-text-14">{sub.data}</span>
                        </div>
                      </div>
                      <div className="rivleresimi-regjistro-row-8">
                        <span className={`rivleresimi-regjistro-badge-2 ${bg} ${color}`}>
                          {sub.status}
                        </span>
                        <span className="rivleresimi-regjistro-text-16">
                          {sub.id}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

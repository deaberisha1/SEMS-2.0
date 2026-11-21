import { useState, useRef } from "react";
import {
  Lock,
  Pencil,
  Camera,
  Check,
  Eye,
  EyeOff,
  User,
  Hash,
  BookOpen,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Key,
} from "lucide-react";
import { api } from "../../api";
import { profile } from "../data/student";

import "./Profili.css";

// ─── Read-only field ──────────────────────────────────────────────────────────

function ReadonlyField({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div>
      <label className="profili-label">
        <Icon size={11} className="profili-icon" />
        {label}
        <Lock size={10} className="profili-icon-2" />
      </label>
      <div className="profili-card">
        <span className="profili-text">{value}</span>
      </div>
    </div>
  );
}

// ─── Editable field ───────────────────────────────────────────────────────────

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="profili-label">
        <Icon size={11} className="profili-icon" />
        {label}
        <Pencil size={10} className="profili-icon-3" />
      </label>
      <div className="profili-box">
        <input
          type={isPassword ? (showPw ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="profili-input"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="profili-btn"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Password input (single field with show/hide) ─────────────────────────────

function PwInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="profili-box">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="profili-input-2"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="profili-btn-2"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ─── Password section ─────────────────────────────────────────────────────────

function PasswordSection({ onChange }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);

  function handleChange(setter) {
    return (v) => { setter(v); onChange(); };
  }

  async function handleSave() {
    if (newPw !== confirm) {
      setMsg({ text: "Fjalëkalimi i ri nuk përputhet.", ok: false });
      return;
    }
    setLoading(true);
    setMsg({ text: "", ok: false });
    try {
      await api.post("/auth/change-password", {
        currentPassword: current,
        newPassword: newPw,
      });
      setMsg({ text: "Fjalëkalimi u ndryshua me sukses.", ok: true });
      setCurrent(""); setNewPw(""); setConfirm("");
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    }
    setLoading(false);
  }

  return (
    <div>
      <label className="profili-label">
        <Key size={11} className="profili-icon" />
        Fjalëkalimi
        <Pencil size={10} className="profili-icon-3" />
      </label>
      {!open ? (
        <button onClick={() => setOpen(true)} className="profili-btn-3">
          Ndrysho fjalëkalimin…
        </button>
      ) : (
        <div className="profili-stack">
          <PwInput placeholder="Fjalëkalimi aktual" value={current} onChange={handleChange(setCurrent)} />
          <PwInput placeholder="Fjalëkalimi i ri" value={newPw} onChange={handleChange(setNewPw)} />
          <PwInput placeholder="Konfirmo fjalëkalimin" value={confirm} onChange={handleChange(setConfirm)} />
          {msg.text && (
            <p style={{ color: msg.ok ? "#34C759" : "#FF3B30", fontSize: "0.85rem", margin: "4px 0 0" }}>
              {msg.text}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={loading || !current || !newPw || !confirm}
            className="profili-btn-3"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Duke ruajtur…" : "Ruaj fjalëkalimin"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Profili() {
  const fileRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const INITIAL = {
    emailPersonal: profile.emailPersonal || "",
    telefon: profile.telefon || "",
    adresa: profile.adresa || "",
  };

  const [emailPersonal, setEmailPersonal] = useState(INITIAL.emailPersonal);
  const [telefon, setTelefon] = useState(INITIAL.telefon);
  const [adresa, setAdresa] = useState(INITIAL.adresa);

  function mark(setter) {
    return (v) => { setter(v); setDirty(true); };
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    setDirty(true);
  }

  function handleAnulo() {
    setEmailPersonal(INITIAL.emailPersonal);
    setTelefon(INITIAL.telefon);
    setAdresa(INITIAL.adresa);
    setPhotoUrl(null);
    setDirty(false);
  }

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      await api.patch("/student/profile", {
        emailPersonal,
        telefon,
        adresa,
      });
      profile.emailPersonal = emailPersonal;
      profile.telefon = telefon;
      profile.adresa = adresa;
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="profili-box-2">
      <div className="profili-box-3">

        {/* Header */}
        <div className="profili-text-2">
          <h1 className="profili-title">
            Profili Im
          </h1>
          <p className="profili-text-3">
            Shiko dhe përditëso të dhënat e llogarisë
          </p>
        </div>

        {/* Toast */}
        {saved && (
          <div className="profili-card-2">
            <div className="profili-avatar">
              <Check size={13} className="profili-icon-4" />
            </div>
            <span className="profili-text-4">
              Të dhënat u përditësuan me sukses.
            </span>
          </div>
        )}

        {/* Avatar */}
        <div className="profili-stack-2">
          <div className="profili-box-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Foto profili"
                className="profili-img"
              />
            ) : (
              <div className="profili-avatar-2">
                AB
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="profili-btn-4"
            >
              <Camera size={13} className="profili-icon-4" />
            </button>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="profili-btn-5"
          >
            Ndrysho foton
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="profili-input-3" onChange={handlePhoto} />
          <p className="profili-text-5">Arta Berisha · Student Aktiv</p>
        </div>

        {/* Two-column form */}
        <div className="profili-grid">

          {/* Left — read-only */}
          <div className="profili-card-3">
            <h2 className="profili-title-2">
              <Lock size={14} className="profili-icon" />
              Të dhëna institucionale
            </h2>
            <div className="profili-stack-3">
              <ReadonlyField label="Emri i plotë"         value={profile.name || ""}                                     icon={User}         />
              <ReadonlyField label="Nr. Studentor"        value={profile.studentNumber || ""}                            icon={Hash}         />
              <ReadonlyField label="Fakulteti"            value={profile.faculty || ""}                                  icon={BookOpen}     />
              <ReadonlyField label="Programi"             value={profile.program || ""}                                  icon={GraduationCap}/>
              <ReadonlyField label="Viti"                 value={profile.year || ""}                                     icon={Calendar}     />
              <ReadonlyField label="Email institucional"  value={profile.email || ""}                                    icon={Mail}         />
              <ReadonlyField label="Statusi"              value={profile.status || ""}                                   icon={User}         />
            </div>
          </div>

          {/* Right — editable */}
          <div className="profili-card-3">
            <h2 className="profili-title-2">
              <Pencil size={14} className="profili-icon-5" />
              Të dhëna personale
            </h2>
            <div className="profili-stack-3">
              <EditableField
                label="Email personal"
                value={emailPersonal}
                onChange={mark(setEmailPersonal)}
                type="email"
                icon={Mail}
                placeholder="email@gmail.com"
              />
              <EditableField
                label="Nr. telefonit"
                value={telefon}
                onChange={mark(setTelefon)}
                type="tel"
                icon={Phone}
                placeholder="+383 44 000 000"
              />
              <EditableField
                label="Adresa"
                value={adresa}
                onChange={mark(setAdresa)}
                icon={MapPin}
                placeholder="Rruga, Qyteti"
              />
              <PasswordSection onChange={() => setDirty(true)} />
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="profili-row">
          <button
            onClick={handleAnulo}
            disabled={!dirty}
            className="profili-btn-6"
          >
            Anulo
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="profili-btn-7"
          >
            Ruaj ndryshimet
          </button>
        </div>

      </div>
    </div>
  );
}

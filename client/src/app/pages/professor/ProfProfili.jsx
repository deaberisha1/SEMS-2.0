import { useState } from "react";
import {
  Lock, Pencil, Check, User, Hash, GraduationCap, BookOpen,
  Mail, Phone, MapPin, Clock, Key, Camera,
} from "lucide-react";
import { PROFESSOR } from "../../data/professor";
import { api } from "../../../api";
import "./ProfProfili.css";

function ReadonlyField({ label, value, icon: Icon }) {
  return (
    <div>
      <label className="prof-profili-label">
        <Icon size={11} />
        {label}
        <Lock size={10} className="prof-profili-icon" />
      </label>
      <div className="prof-profili-card">
        <span className="prof-profili-text">{value}</span>
      </div>
    </div>
  );
}

function EditableField({
  label, value, onChange, icon: Icon, type = "text",
}) {
  return (
    <div>
      <label className="prof-profili-label">
        <Icon size={11} />
        {label}
        <Pencil size={10} className="prof-profili-icon-2" />
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="prof-profili-input"
      />
    </div>
  );
}

export function ProfProfili() {
  const [emailPersonal, setEmailPersonal] = useState(PROFESSOR.emailPersonal);
  const [phone, setPhone] = useState(PROFESSOR.phone);
  const [office, setOffice] = useState(PROFESSOR.office);
  const [consultations, setConsultations] = useState(PROFESSOR.consultations);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState({ emailPersonal: PROFESSOR.emailPersonal, phone: PROFESSOR.phone, office: PROFESSOR.office, consultations: PROFESSOR.consultations });

  const changed =
    emailPersonal !== initial.emailPersonal ||
    phone !== initial.phone ||
    office !== initial.office ||
    consultations !== initial.consultations ||
    newPw.length > 0;

  const save = async () => {
    if (!changed || saving) return;
    setSaving(true);
    if (newPw) {
      try {
        await api.post("/auth/change-password", {
          currentPassword: currentPw,
          newPassword: newPw,
        });
        setPwMsg({ text: "Fjalëkalimi u ndryshua.", ok: true });
        setCurrentPw(""); setNewPw("");
      } catch (err) {
        setPwMsg({ text: err.message, ok: false });
        setSaving(false);
        return;
      }
    }
    const profileChanged =
      emailPersonal !== initial.emailPersonal ||
      phone !== initial.phone ||
      office !== initial.office ||
      consultations !== initial.consultations;
    if (profileChanged) {
      try {
        await api.patch("/professor/profile", { emailPersonal, phone, office, consultations });
      } catch (err) {
        setPwMsg({ text: err.message, ok: false });
        setSaving(false);
        return;
      }
    }
    if (profileChanged) {
      Object.assign(PROFESSOR, { emailPersonal, phone, office, consultations });
      setInitial({ emailPersonal, phone, office, consultations });
    }
    setSaving(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="prof-profili-box">
      <div>
        <h1 className="prof-profili-title">Profili</h1>
        <p className="prof-profili-text-2">Të dhënat personale dhe institucionale</p>
      </div>

      <div className="prof-profili-card-2">
        <div className="prof-profili-box-2">
          <div className="prof-profili-avatar">
            {PROFESSOR.initials}
          </div>
          <button className="prof-profili-btn">
            <Camera size={12} />
          </button>
        </div>
        <div>
          <div className="prof-profili-text-3">{PROFESSOR.title} {PROFESSOR.name}</div>
          <div className="prof-profili-text-4">{PROFESSOR.fullFaculty}</div>
        </div>
      </div>

      <div className="prof-profili-card-3">
        <h3 className="prof-profili-heading">Të dhënat institucionale</h3>
        <div className="prof-profili-grid">
          <ReadonlyField label="Emri i plotë" value={PROFESSOR.name} icon={User} />
          <ReadonlyField label="ID Profesori" value={PROFESSOR.id} icon={Hash} />
          <ReadonlyField label="Fakulteti" value={PROFESSOR.fullFaculty} icon={BookOpen} />
          <ReadonlyField label="Titulli akademik" value={PROFESSOR.title} icon={GraduationCap} />
          <ReadonlyField label="Email institucional" value={PROFESSOR.emailInst} icon={Mail} />
          <ReadonlyField label="Statusi" value={PROFESSOR.status} icon={Check} />
        </div>
      </div>

      <div className="prof-profili-card-3">
        <h3 className="prof-profili-heading">Të dhënat personale</h3>
        <div className="prof-profili-grid">
          <EditableField label="Email personal" value={emailPersonal} onChange={setEmailPersonal} icon={Mail} type="email" />
          <EditableField label="Nr. telefonit" value={phone} onChange={setPhone} icon={Phone} type="tel" />
          <EditableField label="Zyra" value={office} onChange={setOffice} icon={MapPin} />
          <EditableField label="Orari i konsultimeve" value={consultations} onChange={setConsultations} icon={Clock} />
          <EditableField label="Fjalëkalimi aktual" value={currentPw} onChange={setCurrentPw} icon={Key} type="password" />
          <EditableField label="Fjalëkalimi i ri" value={newPw} onChange={setNewPw} icon={Key} type="password" />
          {pwMsg.text && (
            <p style={{ color: pwMsg.ok ? "#34C759" : "#FF3B30", fontSize: "0.85rem" }}>
              {pwMsg.text}
            </p>
          )}
        </div>
      </div>

      <div className="prof-profili-row">
        <button
          onClick={save}
          disabled={!changed}
          className={`prof-profili-btn-2 ${
            changed
              ? "prof-profili-btn-3"
              : "prof-profili-btn-4"
          }`}
        >
          <Check size={14} /> Ruaj Ndryshimet
        </button>
      </div>

      {toast && (
        <div className="prof-profili-card-4">
          <Check size={18} />
          <span className="prof-profili-text-5">Të dhënat u ruajtën me sukses.</span>
        </div>
      )}
    </div>
  );
}

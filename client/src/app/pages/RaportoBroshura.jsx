import { useState } from "react";
import { FileText, Shield, Lock, HeartHandshake, AlertTriangle, X, BookOpen, Download, Phone, Mail, ChevronRight } from "lucide-react";
import "./RaportoBroshura.css";

const infoCards = [
  {
    id: 1,
    icon: FileText,
    title: "Raportim",
    text: "Raportimi i rasteve bëhet në mënyrë konfidenciale.",
    color: "raporto-broshura-color",
    bg: "raporto-broshura-bg",
  },
  {
    id: 2,
    icon: Shield,
    title: "Siguri",
    text: "Çdo raportim trajtohet sipas procedurave zyrtare të UP-së.",
    color: "raporto-broshura-color-2",
    bg: "raporto-broshura-bg-2",
  },
  {
    id: 3,
    icon: Lock,
    title: "Privatësi",
    text: "Identiteti i raportuesit mbrohet me rreptësi nga institucionet e UP-së.",
    color: "raporto-broshura-color-3",
    bg: "raporto-broshura-bg-3",
  },
  {
    id: 4,
    icon: HeartHandshake,
    title: "Mbështetje",
    text: "Universiteti ofron mbështetje dhe trajtim të drejtë për çdo rast.",
    color: "raporto-broshura-color-4",
    bg: "raporto-broshura-bg-4",
  },
];

const seksionet = [
  {
    id: 1,
    title: "Çfarë është raportimi?",
    text: "Raportimi është procesi formal nëpërmjet të cilit studentët, stafi dhe personeli akademik mund të njoftojnë autoritetet e UP-së për çdo rast të ngacmimit, diskriminimit apo sjelljes jo etike brenda institucionit.",
  },
  {
    id: 2,
    title: "Si të raportoni?",
    text: "Mund të raportoni duke plotësuar formularin zyrtar të disponueshëm online ose fizikisht pranë sekretarisë. Çdo raportim regjistrohet dhe kalon nëpër procedura standarde të verifikimit dhe hetimit.",
  },
  {
    id: 3,
    title: "Të drejtat dhe mbështetja",
    text: "Çdo person ka të drejtë të raportojë pa pasur frikë nga hakmarrja. UP-ja garanton trajtim të barabartë dhe mbështetje psiko-sociale gjatë gjithë procesit.",
  },
  {
    id: 4,
    title: "Kontaktet zyrtare",
    text: "Për çdo pyetje apo raportim mund të kontaktoni zyrtarin e caktuar pranë rektoratit ose të dërgoni email në adresën zyrtare të njësisë përkatëse.",
  },
];

const kontaktet = [
  { id: 1, icon: Phone, label: "Telefon", value: "+383 38 244 183" },
  { id: 2, icon: Mail,  label: "Email",   value: "info@uni-pr.edu" },
  { id: 3, icon: Phone, label: "Emergjencë", value: "+383 38 244 100" },
];

export function RaportoBroshura() {
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="raporto-broshura-box">
      <div className="raporto-broshura-stack">
        <h1 className="raporto-broshura-title">
          Raporto – Broshura
        </h1>
        <p className="raporto-broshura-text">
          Informacion zyrtar mbi raportimin e rasteve të ngacmimit dhe diskriminimit në UP.
        </p>
      </div>

      {/* Emergency alert */}
      {!alertDismissed && (
        <div className="raporto-broshura-card">
          <AlertTriangle className="raporto-broshura-icon" />
          <span className="raporto-broshura-text-2">
            Në rast emergjence kontaktoni menjëherë administratën ose organet kompetente.
          </span>
          <button
            type="button"
            onClick={() => setAlertDismissed(true)}
            aria-label="Mbyll"
            className="raporto-broshura-btn"
          >
            <X className="raporto-broshura-icon-2" />
          </button>
        </div>
      )}

      {/* Info cards */}
      <div className="raporto-broshura-grid">
        {infoCards.map((card) => (
          <div
            key={card.id}
            className="raporto-broshura-card-2"
          >
            <div className={`raporto-broshura-icon-box ${card.bg}`}>
              <card.icon className={`raporto-broshura-box-2 ${card.color}`} />
            </div>
            <div>
              <p className="raporto-broshura-text-3">{card.title}</p>
              <p className="raporto-broshura-text-4">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main content card */}
      <div className="raporto-broshura-box-3">
        {/* Actions bar */}
        <div className="raporto-broshura-stack-2">
          <p className="raporto-broshura-text-5">
            Broshura zyrtare e UP-së mbi raportimin e rasteve të ngacmimit seksual dhe diskriminimit.
          </p>
          <div className="raporto-broshura-row">
            <button
              type="button"
              className="raporto-broshura-btn-2"
            >
              <BookOpen className="raporto-broshura-icon-2" />
              Lexo Broshurën
            </button>
            <button
              type="button"
              className="raporto-broshura-btn-3"
            >
              <Download className="raporto-broshura-icon-2" />
              Shkarko PDF
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="raporto-broshura-box-4">
          {seksionet.map((s) => (
            <div
              key={s.id}
              className="hover-group raporto-broshura-row-2"
            >
              <div className="raporto-broshura-avatar">
                <span className="raporto-broshura-text-6">{s.id}</span>
              </div>
              <div className="raporto-broshura-box-5">
                <p className="raporto-broshura-text-3">{s.title}</p>
                <p className="raporto-broshura-text-4">{s.text}</p>
              </div>
              <ChevronRight className="raporto-broshura-icon-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact card */}
      <div className="raporto-broshura-card-3">
        <p className="raporto-broshura-text-7">Kontaktet zyrtare</p>
        <div className="raporto-broshura-grid-2">
          {kontaktet.map((k) => (
            <div
              key={k.id}
              className="raporto-broshura-card-4"
            >
              <div className="raporto-broshura-icon-box-2">
                <k.icon className="raporto-broshura-box-6" />
              </div>
              <div>
                <p className="raporto-broshura-text-8">{k.label}</p>
                <p className="raporto-broshura-text-9">{k.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

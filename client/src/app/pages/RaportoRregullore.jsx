import { useState } from "react";
import { BookOpen, Download, AlertTriangle, X, ScrollText, ClipboardList, GraduationCap, ShieldCheck, Phone, ChevronRight } from "lucide-react";
import "./RaportoRregullore.css";

const seksionet = [
  {
    id: 1,
    icon: ScrollText,
    title: "Rregullorja",
    color: "raporto-rregullore-color",
    bg: "raporto-rregullore-bg",
    text: "Universiteti i Prishtinës ndalon çdo formë të ngacmimit dhe diskriminimit. Rregullorja e brendshme përcakton standardet e sjelljes për të gjithë anëtarët e komunitetit akademik.",
  },
  {
    id: 2,
    icon: ClipboardList,
    title: "Procedurat e raportimit",
    color: "raporto-rregullore-color-2",
    bg: "raporto-rregullore-bg-2",
    text: "Raportimi mund të bëhet përmes kanaleve zyrtare të universitetit. Çdo raportim regjistrohet, shqyrtohet dhe trajtohet sipas procedurave standarde brenda afateve të përcaktuara.",
  },
  {
    id: 3,
    icon: GraduationCap,
    title: "Të drejtat e studentëve",
    color: "raporto-rregullore-color-3",
    bg: "raporto-rregullore-bg-3",
    text: "Studentët kanë të drejtë për mbrojtje dhe trajtim të drejtë. Askush nuk mund të penalizohet për raportimin e rasteve të ngacmimit apo diskriminimit.",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Masat mbrojtëse",
    color: "raporto-rregullore-color-4",
    bg: "raporto-rregullore-bg-4",
    text: "Çdo raportim trajtohet në mënyrë konfidenciale. Universiteti merr masa të menjëhershme mbrojtëse për personat e prekur deri në përfundimin e hetimit.",
  },
  {
    id: 5,
    icon: Phone,
    title: "Kontaktet dhe mbështetja",
    color: "raporto-rregullore-color-5",
    bg: "raporto-rregullore-bg-5",
    text: "Njësia e mbështetjes psiko-sociale është e disponueshme gjatë gjithë vitit akademik. Kontaktoni zyrën përkatëse pranë rektoratit për çdo nevojë apo pyetje.",
  },
];

const pikat = [
  "Universiteti i Prishtinës ndalon çdo formë të ngacmimit dhe diskriminimit.",
  "Çdo raportim trajtohet në mënyrë konfidenciale.",
  "Studentët kanë të drejtë për mbrojtje dhe trajtim të drejtë.",
  "Raportimi mund të bëhet përmes kanaleve zyrtare të universitetit.",
];

export function RaportoRregullore() {
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <article className="raporto-rregullore-box">
      <header className="raporto-rregullore-stack">
        <h1 className="raporto-rregullore-title">
          Rregullore
        </h1>
        <p className="raporto-rregullore-text">
          Parandalimi dhe mbrojtja nga ngacmimi dhe ngacmimi seksual në UP.
        </p>
      </header>

      {/* Alert */}
      {!alertDismissed && (
        <section className="raporto-rregullore-card">
          <AlertTriangle className="raporto-rregullore-icon" />
          <span className="raporto-rregullore-text-2">
            Në rast emergjence kontaktoni menjëherë organet kompetente ose administratën.
          </span>
          <button
            type="button"
            onClick={() => setAlertDismissed(true)}
            aria-label="Mbyll"
            className="raporto-rregullore-btn"
          >
            <X className="raporto-rregullore-icon-2" />
          </button>
        </section>
      )}

      {/* Actions card */}
      <section className="raporto-rregullore-card-2">
        <div className="raporto-rregullore-box-2">
          <p className="raporto-rregullore-text-3">
            Rregullorja për parandalimin dhe mbrojtjen nga ngacmimi seksual
          </p>
          <ul className="raporto-rregullore-list">
            {pikat.map((p, i) => (
              <li key={i} className="raporto-rregullore-item">
                <span className="raporto-rregullore-dot" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="raporto-rregullore-stack-2">
          <button
            type="button"
            className="raporto-rregullore-btn-2"
          >
            <BookOpen className="raporto-rregullore-icon-2" />
            Lexo Rregulloren
          </button>
          <button
            type="button"
            className="raporto-rregullore-btn-3"
          >
            <Download className="raporto-rregullore-icon-2" />
            Shkarko PDF
          </button>
        </div>
      </section>

      {/* Sections */}
      <section className="raporto-rregullore-box-3">
        <div className="raporto-rregullore-box-4">
          <p className="raporto-rregullore-text-4">Përmbajtja e rregullores</p>
        </div>
        <div className="raporto-rregullore-box-5">
          {seksionet.map((s) => (
            <div
              key={s.id}
              className="hover-group raporto-rregullore-row"
            >
              <div className={`raporto-rregullore-icon-box ${s.bg}`}>
                <s.icon className={`raporto-rregullore-box-6 ${s.color}`} style={{ width: 18, height: 18 }} />
              </div>
              <div className="raporto-rregullore-box-7">
                <p className="raporto-rregullore-text-4">{s.title}</p>
                <p className="raporto-rregullore-text-5">{s.text}</p>
              </div>
              <ChevronRight className="raporto-rregullore-icon-3" />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

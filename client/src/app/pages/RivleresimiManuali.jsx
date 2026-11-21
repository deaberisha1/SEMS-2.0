import { useState } from "react";
import {
  AlertTriangle, X, BookOpen, Download, Star, BarChart2,
  FileText, ClipboardCheck, Info, ChevronRight, CheckCircle2,
} from "lucide-react";

import "./RivleresimiManuali.css";

const seksionet = [
  {
    id: 1,
    icon: Info,
    color: "rivleresimi-manuali-color",
    bg: "rivleresimi-manuali-bg",
    title: "Hyrje",
    text: "Ky manual shpjegon mënyrën e përdorimit të modulit të vlerësimeve të vazhdueshme dhe rivlerësimit në sistemin SEMS për studentët e Universitetit të Prishtinës.",
  },
  {
    id: 2,
    icon: BarChart2,
    color: "rivleresimi-manuali-color-2",
    bg: "rivleresimi-manuali-bg-2",
    title: "Vlerësimet e vazhdueshme",
    text: "Studenti mund të shikojë pikët për secilin vlerësim të lëndës. Profesori mund të ndajë vlerësimin në kolokfiume, teste, projekte dhe vijueshmëri.",
  },
  {
    id: 3,
    icon: Star,
    color: "rivleresimi-manuali-color-3",
    bg: "rivleresimi-manuali-bg-3",
    title: "Rezultatet e vlerësimit",
    text: "Pasi profesori të finalizojë vlerësimet, studenti mund të shikojë notën përfundimtare të propozuar për lëndën përkatëse.",
  },
  {
    id: 4,
    icon: ClipboardCheck,
    color: "rivleresimi-manuali-color-4",
    bg: "rivleresimi-manuali-bg-4",
    title: "Pranimi dhe refuzimi i notës",
    text: "Studenti mund ta pranojë ose refuzojë notën. Nëse nota refuzohet, studenti mund të hyjë në provim. Nëse studenti nuk e pranon apo refuzon notën, profesori nuk mund ta finalizojë notën.",
  },
  {
    id: 5,
    icon: FileText,
    color: "rivleresimi-manuali-color-5",
    bg: "rivleresimi-manuali-bg-5",
    title: "Regjistrimi i kërkesës",
    text: "Kërkesa për rivlerësim bëhet vetëm për lëndët e vitit paraprak. Studenti plotëson formularin e kërkesës dhe e dërgon përmes sistemit SEMS.",
  },
];

const hapat = [
  { nr: 1, tekst: "Kyçu në SEMS" },
  { nr: 2, tekst: 'Hap menynë "Vlerësimet e vazhdueshme"' },
  { nr: 3, tekst: "Zgjedh vitin akademik dhe lëndën" },
  { nr: 4, tekst: 'Kliko "Kërko"' },
  { nr: 5, tekst: "Shiko rezultatet dhe pikët" },
  { nr: 6, tekst: "Prano ose refuzo notën" },
  { nr: 7, tekst: "Regjistro kërkesë për rivlerësim" },
];

export function RivleresimiManuali() {
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="rivleresimi-manuali-box">
      <div className="rivleresimi-manuali-stack">
        <h1 className="rivleresimi-manuali-title">
          Manuali – Rivlerësimi
        </h1>
        <p className="rivleresimi-manuali-text">
          Udhëzues për modulin e vlerësimeve të vazhdueshme dhe rivlerësimit.
        </p>
      </div>

      {/* Alert */}
      {!alertDismissed && (
        <div className="rivleresimi-manuali-card">
          <AlertTriangle className="rivleresimi-manuali-icon" />
          <span className="rivleresimi-manuali-text-2">
            Kujdes! Pranimi i notës nuk e vendos automatikisht notën në transkript.
          </span>
          <button
            type="button"
            onClick={() => setAlertDismissed(true)}
            aria-label="Mbyll"
            className="rivleresimi-manuali-btn"
          >
            <X className="rivleresimi-manuali-icon-2" />
          </button>
        </div>
      )}

      {/* Actions card */}
      <div className="rivleresimi-manuali-card-2">
        <div className="rivleresimi-manuali-box-2">
          <p className="rivleresimi-manuali-text-3">
            Manual i përdorimit për vlerësim të vazhdueshëm – Student v1
          </p>
          <p className="rivleresimi-manuali-text-4">
            Dokumenti zyrtar i UP-së për modulin e vlerësimeve dhe rivlerësimit në SEMS.
          </p>
        </div>
        <div className="rivleresimi-manuali-row">
          <button
            type="button"
            className="rivleresimi-manuali-btn-2"
          >
            <BookOpen className="rivleresimi-manuali-icon-2" />
            Lexo Manualin
          </button>
          <button
            type="button"
            className="rivleresimi-manuali-btn-3"
          >
            <Download className="rivleresimi-manuali-icon-2" />
            Shkarko PDF
          </button>
        </div>
      </div>

      <div className="rivleresimi-manuali-grid">
        {/* Sections list */}
        <div className="rivleresimi-manuali-box-3">
          <div className="rivleresimi-manuali-box-4">
            <p className="rivleresimi-manuali-text-3">Përmbajtja e manualit</p>
          </div>
          <div className="rivleresimi-manuali-box-5">
            {seksionet.map((s) => (
              <div
                key={s.id}
                className="hover-group rivleresimi-manuali-row-2"
              >
                <div className={`rivleresimi-manuali-icon-box ${s.bg}`}>
                  <s.icon className={`rivleresimi-manuali-box-6 ${s.color}`} />
                </div>
                <div className="rivleresimi-manuali-box-7">
                  <p className="rivleresimi-manuali-text-3">{s.title}</p>
                  <p className="rivleresimi-manuali-text-5">{s.text}</p>
                </div>
                <ChevronRight className="rivleresimi-manuali-icon-3" />
              </div>
            ))}
          </div>
        </div>

        {/* Steps card */}
        <div className="rivleresimi-manuali-box-8">
          <div className="rivleresimi-manuali-box-4">
            <p className="rivleresimi-manuali-text-3">Hapat e procesit</p>
          </div>
          <div className="rivleresimi-manuali-box-9">
            {hapat.map((h, i) => (
              <div
                key={h.nr}
                className="hover-group rivleresimi-manuali-row-3"
              >
                <div className="rivleresimi-manuali-avatar">
                  <span className="rivleresimi-manuali-text-6">{h.nr}</span>
                </div>
                <p className="rivleresimi-manuali-text-7">{h.tekst}</p>
                {i === hapat.length - 1 && (
                  <CheckCircle2 className="rivleresimi-manuali-icon-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

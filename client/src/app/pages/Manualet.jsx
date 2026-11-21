import { useNavigate } from "react-router";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  UserX,
  ChevronRight,
  Smartphone,
  Tablet,
  BookOpen,
} from "lucide-react";

import "./Manualet.css";

const manuals = [
  {
    icon: QrCode,
    iconBg: "manualet-icon-bg",
    iconColor: "manualet-icon-color",
    category: "Vijueshmëria",
    title: "QR Code Android",
    description: "Si të skanoni QR Code me pajisje Android për të regjistruar prezencën në ligjëratë.",
    path: "/vijueshmeria/qr-android",
  },
  {
    icon: QrCode,
    iconBg: "manualet-icon-bg-2",
    iconColor: "manualet-icon-color-2",
    category: "Vijueshmëria",
    title: "QR Code iPhone",
    description: "Si të konfiguroni lokacionin dhe kamerën në iPhone dhe të skanoni QR Code në SEMS.",
    path: "/vijueshmeria/qr-ios",
  },
  {
    icon: CheckCircle2,
    iconBg: "manualet-icon-bg-3",
    iconColor: "manualet-icon-color-3",
    category: "Prezenca",
    title: "Vijueshmëria",
    description: "Si të shikoni vijueshmërinë tuaj për çdo lëndë, të filtroni sipas semestrit dhe të kontrolloni statusin.",
    path: "/vijueshmeria/manuali",
  },
  {
    icon: AlertCircle,
    iconBg: "manualet-icon-bg-4",
    iconColor: "manualet-icon-color-4",
    category: "Kërkesat",
    title: "Ankesat",
    description: "Si të paraqisni një ankesë ose kërkesë zyrtare ndaj vendimeve akademike nëpërmjet SEMS.",
    path: "/kerkesat/ankese",
  },
  {
    icon: UserX,
    iconBg: "manualet-icon-bg-5",
    iconColor: "manualet-icon-color-5",
    category: "Kërkesat",
    title: "Çregjistrimi",
    description: "Si të dorëzoni kërkesë për ç'regjistrim nga universiteti dhe cilat dokumente kërkohen.",
    path: "/kerkesat/cregjistrim",
  },
];

export function Manualet() {
  const navigate = useNavigate();

  return (
    <div className="manualet-box">
      <div className="manualet-box-2">

        {/* Header */}
        <div className="manualet-text">
          <h1 className="manualet-title">
            Manualet e SEMS
          </h1>
          <p className="manualet-text-2">
            Këtu mund të gjeni manualet e përdorimit për modulet e SEMS.
          </p>
        </div>

        {/* Category groups */}
        {[
          { label: "Vijueshmëria & QR Code", icon: Smartphone, items: manuals.filter(m => m.category === "Vijueshmëria") },
          { label: "Prezenca", icon: CheckCircle2, items: manuals.filter(m => m.category === "Prezenca") },
          { label: "Kërkesat", icon: BookOpen, items: manuals.filter(m => m.category === "Kërkesat") },
        ].map((group) => (
          <div key={group.label} className="manualet-text-3">
            {/* Group header */}
            <div className="manualet-row">
              <group.icon size={14} className="manualet-text-4" />
              <span className="manualet-text-5">
                {group.label}
              </span>
            </div>

            {/* Cards grid */}
            <div className="manualet-grid">
              {group.items.map((manual) => {
                const Icon = manual.icon;
                return (
                  <div
                    key={manual.path}
                    onClick={() => navigate(manual.path)}
                    className="hover-group manualet-card"
                  >
                    {/* Icon */}
                    <div className={`manualet-icon-box ${manual.iconBg}`}>
                      <Icon size={20} className={manual.iconColor} />
                    </div>

                    {/* Text */}
                    <div className="manualet-text-6">
                      <h3 className="manualet-heading">
                        {manual.title}
                      </h3>
                      <p className="manualet-text-7">
                        {manual.description}
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(manual.path); }}
                      className="manualet-btn"
                    >
                      Shiko Manualin
                      <ChevronRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div className="manualet-card-2">
          <Tablet size={16} className="manualet-icon" />
          <p className="manualet-text-8">
            Nëse keni nevojë për ndihmë shtesë, kontaktoni administratën e universitetit ose pedagogun tuaj përgjegjës.
          </p>
        </div>

      </div>
    </div>
  );
}

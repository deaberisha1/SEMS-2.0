import { useLocation, useNavigate } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import "./Breadcrumb.css";

const routeMap = {
  "/": { label: "Ballina" },
  "/orari": { label: "Orari", section: "Kryesore", sectionPath: "/" },
  "/pagesat": { label: "Pagesat", section: "Kryesore", sectionPath: "/" },
  "/konsultime": { label: "Konsultime", section: "Kryesore", sectionPath: "/" },
  "/lendet": { label: "Të Regjistruara", section: "Lëndët", sectionPath: "/lendet" },
  "/lendet/regjistro": { label: "Regjistro Lëndë", section: "Lëndët", sectionPath: "/lendet" },
  "/lendet/paraqit": { label: "Paraqit Provimet", section: "Lëndët", sectionPath: "/lendet" },
  "/tjera/literatura": { label: "Literatura e lëndëve", section: "Lëndët", sectionPath: "/lendet" },
  "/transkripta": { label: "Transkriptë", section: "Akademike", sectionPath: "/transkripta" },
  "/kerkesat/kartele": { label: "Kërkesë për kartelë", section: "Kërkesat", sectionPath: "/kerkesat/kartele" },
  "/kerkesat/transferimi": { label: "Transferimi i notës", section: "Kërkesat", sectionPath: "/kerkesat/kartele" },
  "/kerkesat/cregjistrim": { label: "Kërkesë për ç'regjistrim", section: "Kërkesat", sectionPath: "/kerkesat/kartele" },
  "/kerkesat/ankese": { label: "Kërkesë / Ankesë", section: "Kërkesat", sectionPath: "/kerkesat/kartele" },
  "/rivleresimi": { label: "Vlerësimi i Vazhdueshëm", section: "Vlerësimi", sectionPath: "/rivleresimi" },
  "/rivleresimi/regjistro": { label: "Regjistro kërkesën", section: "Vlerësimi", sectionPath: "/rivleresimi" },
  "/rivleresimi/manuali": { label: "Manuali i përdorimit", section: "Vlerësimi", sectionPath: "/rivleresimi" },
  "/vijueshmeria": { label: "Vijueshmëria në lëndë", section: "Vijueshmëria", sectionPath: "/vijueshmeria" },
  "/tjera/scan-qr": { label: "Scan QR Code", section: "Vijueshmëria", sectionPath: "/vijueshmeria" },
  "/vijueshmeria/manuali": { label: "Manuali i përdorimit", section: "Vijueshmëria", sectionPath: "/vijueshmeria" },
  "/vertetimet": { label: "Vërtetimi online", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/qeq/aplikimi": { label: "QEQ Aplikimi", section: "Të Tjera", sectionPath: "/qeq/aplikimi" },
  "/qeq/lendet": { label: "QEQ Lëndët", section: "Të Tjera", sectionPath: "/qeq/lendet" },
  "/qeq/transkripta": { label: "QEQ Transkriptë", section: "Të Tjera", sectionPath: "/qeq/aplikimi" },
  "/tjera/diploma": { label: "Kërkesë për titull të diplomës", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/tjera/kthimi-mjeteve": { label: "Kthimi i mjeteve", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/tjera/burse": { label: "Apliko për bursë", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/praktika/apliko": { label: "Praktika Apliko", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/praktika/aplikimet": { label: "Praktika Aplikimet", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/tjera/administrata": { label: "Administrata", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/raporto/broshura": { label: "Raporto Broshura", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/raporto/rregullore": { label: "Raporto Rregullore", section: "Të Tjera", sectionPath: "/vertetimet" },
  "/profili": { label: "Profili", section: "Kryesore", sectionPath: "/" },
  // Professor pages
  "/prof/lendet": { label: "Lëndët e Mia", section: "Kryesore", sectionPath: "/" },
  "/prof/studentet": { label: "Studentët", section: "Kryesore", sectionPath: "/" },
  "/prof/vleresimi": { label: "Vlerësimi i Vazhdueshëm", section: "Mësimdhënia", sectionPath: "/prof/lendet" },
  "/prof/notat": { label: "Notat Përfundimtare", section: "Mësimdhënia", sectionPath: "/prof/lendet" },
  "/prof/vijueshmeria": { label: "Vijueshmëria", section: "Mësimdhënia", sectionPath: "/prof/lendet" },
  "/prof/materialet": { label: "Materialet", section: "Mësimdhënia", sectionPath: "/prof/lendet" },
  "/prof/kerkesat": { label: "Kërkesat e Studentëve", section: "Kërkesat", sectionPath: "/prof/kerkesat" },
};

export function Breadcrumb() {
  const location = useLocation();
  const navigate = useNavigate();

  const current = routeMap[location.pathname];
  if (!current || location.pathname === "/") return null;

  const crumbs = [{ label: "Ballina", path: "/" }];

  if (current.section && current.section !== "Kryesore") {
    crumbs.push({ label: current.section, path: current.sectionPath });
  }

  crumbs.push({ label: current.label, path: location.pathname });

  return (
    <div className="breadcrumb-row">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <div key={crumb.path + i} className="breadcrumb-row-2">
            {i === 0 && (
              <Home size={11} className="breadcrumb-icon" />
            )}
            {isLast ? (
              <span className="breadcrumb-text">
                {crumb.label}
              </span>
            ) : (
              <button
                onPointerDown={() => navigate(crumb.path)}
                className="breadcrumb-btn"
              >
                {crumb.label}
              </button>
            )}
            {!isLast && (
              <ChevronRight size={11} className="breadcrumb-icon-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}

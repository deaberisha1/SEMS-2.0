import { createBrowserRouter, useLocation, Navigate } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { useRole } from "./context/RoleContext";
import { Dashboard } from "./pages/Dashboard";
import { Transkripta } from "./pages/Transkripta";
import { Rivleresimi } from "./pages/Rivleresimi";
import { Profili } from "./pages/Profili";
import { Orari } from "./pages/Orari";
import { Lendet } from "./pages/Lendet";
import { Vertetimet } from "./pages/Vertetimet";
import { Pagesat } from "./pages/Pagesat";
import { Konsultime } from "./pages/Konsultime";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { Cregjistrim } from "./pages/Cregjistrim";
import { KerkeseKartele } from "./pages/KerkeseKartele";
import { TransferimiNotes } from "./pages/TransferimiNotes";
import { KerkeseAnkese } from "./pages/KerkeseAnkese";
import { Vijueshmeria } from "./pages/Vijueshmeria";
import { VijueshmeriaManuali } from "./pages/VijueshmeriaManuali";
import { Manualet } from "./pages/Manualet";
import { Literatura } from "./pages/Literatura";
import { QeqAplikimi } from "./pages/QeqAplikimi";
import { QeqLendet } from "./pages/QeqLendet";
import { QeqTranskripta } from "./pages/QeqTranskripta";
import { TjeraDiploma } from "./pages/TjeraDiploma";
import { ScanQR } from "./pages/ScanQR";
import { KthimiMjeteve } from "./pages/KthimiMjeteve";
import { Burse } from "./pages/Burse";
import { PraktikaApliko } from "./pages/PraktikaApliko";
import { PraktikaAplikimet } from "./pages/PraktikaAplikimet";
import { TjeraAdministrata } from "./pages/TjeraAdministrata";
import { RaportoBroshura } from "./pages/RaportoBroshura";
import { RaportoRregullore } from "./pages/RaportoRregullore";
import { RivleresimiRegjistro } from "./pages/RivleresimiRegjistro";
import { RivleresimiManuali } from "./pages/RivleresimiManuali";
import { ProfDashboard } from "./pages/professor/ProfDashboard";
import { ProfOrari } from "./pages/professor/ProfOrari";
import { ProfLendet } from "./pages/professor/ProfLendet";
import { ProfStudentet } from "./pages/professor/ProfStudentet";
import { ProfVleresimi } from "./pages/professor/ProfVleresimi";
import { ProfNotat } from "./pages/professor/ProfNotat";
import { ProfVijueshmeria } from "./pages/professor/ProfVijueshmeria";
import { ProfMaterialet } from "./pages/professor/ProfMaterialet";
import { ProfKerkesat } from "./pages/professor/ProfKerkesat";
import { ProfKonsultime } from "./pages/professor/ProfKonsultime";
import { ProfProfili } from "./pages/professor/ProfProfili";

function RequireRole({ allowed, children }) {
  const { role } = useRole();
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function RouteError() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Diçka shkoi keq.</h2>
      <p>Provoni të rifreskoni faqen.</p>
    </div>
  );
}

function RoleSwitch({ student, professor }) {
  const { role } = useRole();
  return <>{role === "professor" ? professor : student}</>;
}

function FallbackRoute() {
  const location = useLocation();
  const title = location.pathname
    .substring(1)
    .replace(/\//g, " - ")
    .replace(/-/g, " ")
    .toUpperCase();
  return <PlaceholderPage title={title} />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <RoleSwitch student={<Dashboard />} professor={<ProfDashboard />} /> },

      // Kryesore (role-aware)
      { path: "orari", element: <RoleSwitch student={<Orari />} professor={<ProfOrari />} /> },
      { path: "pagesat", Component: Pagesat },
      { path: "konsultime", element: <RoleSwitch student={<Konsultime />} professor={<ProfKonsultime />} /> },

      // Professor routes
      { path: "prof/lendet", element: <RequireRole allowed={["professor"]}><ProfLendet /></RequireRole> },
      { path: "prof/studentet", element: <RequireRole allowed={["professor"]}><ProfStudentet /></RequireRole> },
      { path: "prof/vleresimi", element: <RequireRole allowed={["professor"]}><ProfVleresimi /></RequireRole> },
      { path: "prof/notat", element: <RequireRole allowed={["professor"]}><ProfNotat /></RequireRole> },
      { path: "prof/vijueshmeria", element: <RequireRole allowed={["professor"]}><ProfVijueshmeria /></RequireRole> },
      { path: "prof/materialet", element: <RequireRole allowed={["professor"]}><ProfMaterialet /></RequireRole> },
      { path: "prof/kerkesat", element: <RequireRole allowed={["professor"]}><ProfKerkesat /></RequireRole> },

      // Lëndët
      { path: "lendet", element: <RequireRole allowed={["student"]}><Lendet /></RequireRole> },
      { path: "lendet/regjistro", element: <RequireRole allowed={["student"]}><Lendet /></RequireRole> },
      { path: "lendet/paraqit", element: <RequireRole allowed={["student"]}><Lendet /></RequireRole> },

      // Akademike
      { path: "transkripta", element: <RequireRole allowed={["student"]}><Transkripta /></RequireRole> },

      // Kërkesat
      { path: "kerkesat/kartele", element: <RequireRole allowed={["student"]}><KerkeseKartele /></RequireRole> },
      { path: "kerkesat/transferimi", element: <RequireRole allowed={["student"]}><TransferimiNotes /></RequireRole> },
      { path: "kerkesat/cregjistrim", element: <RequireRole allowed={["student"]}><Cregjistrim /></RequireRole> },
      { path: "kerkesat/ankese", element: <RequireRole allowed={["student"]}><KerkeseAnkese /></RequireRole> },

      // Rivlerësimi
      { path: "rivleresimi", element: <RequireRole allowed={["student"]}><Rivleresimi /></RequireRole> },
      { path: "rivleresimi/regjistro", element: <RequireRole allowed={["student"]}><RivleresimiRegjistro /></RequireRole> },
      { path: "rivleresimi/manuali", element: <RequireRole allowed={["student"]}><RivleresimiManuali /></RequireRole> },

      // Vijueshmëria
      { path: "vijueshmeria", element: <RequireRole allowed={["student"]}><Vijueshmeria /></RequireRole> },
      { path: "vijueshmeria/manuali", element: <RequireRole allowed={["student"]}><VijueshmeriaManuali /></RequireRole> },
      { path: "vijueshmeria/qr-ios", element: <RequireRole allowed={["student"]}><Manualet /></RequireRole> },
      { path: "vijueshmeria/qr-android", element: <RequireRole allowed={["student"]}><Manualet /></RequireRole> },

      // Manualet
      { path: "manualet", element: <RequireRole allowed={["student"]}><Manualet /></RequireRole> },

      // Të Tjera
      { path: "tjera/literatura", element: <RequireRole allowed={["student"]}><Literatura /></RequireRole> },
      { path: "vertetimet", element: <RequireRole allowed={["student"]}><Vertetimet /></RequireRole> },
      { path: "qeq/aplikimi", element: <RequireRole allowed={["student"]}><QeqAplikimi /></RequireRole> },
      { path: "qeq/lendet", element: <RequireRole allowed={["student"]}><QeqLendet /></RequireRole> },
      { path: "qeq/transkripta", element: <RequireRole allowed={["student"]}><QeqTranskripta /></RequireRole> },
      { path: "tjera/diploma", element: <RequireRole allowed={["student"]}><TjeraDiploma /></RequireRole> },
      { path: "tjera/kthimi-mjeteve", element: <RequireRole allowed={["student"]}><KthimiMjeteve /></RequireRole> },
      { path: "tjera/burse", element: <RequireRole allowed={["student"]}><Burse /></RequireRole> },
      { path: "praktika/apliko", element: <RequireRole allowed={["student"]}><PraktikaApliko /></RequireRole> },
      { path: "praktika/aplikimet", element: <RequireRole allowed={["student"]}><PraktikaAplikimet /></RequireRole> },
      { path: "tjera/administrata", element: <RequireRole allowed={["student"]}><TjeraAdministrata /></RequireRole> },
      { path: "raporto/broshura", element: <RequireRole allowed={["student"]}><RaportoBroshura /></RequireRole> },
      { path: "raporto/rregullore", element: <RequireRole allowed={["student"]}><RaportoRregullore /></RequireRole> },
      { path: "tjera/scan-qr", element: <RequireRole allowed={["student"]}><ScanQR /></RequireRole> },

      // Profile & fallback
      { path: "profili", element: <RoleSwitch student={<Profili />} professor={<ProfProfili />} /> },
      { path: "*", Component: FallbackRoute },
    ],
  },
]);

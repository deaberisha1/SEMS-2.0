import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";
import { ProfTopBar } from "./ProfTopBar";
import { AccessibilityPanel } from "./AccessibilityPanel";
import { useRole } from "../context/RoleContext";
import { Menu, Home, Calendar, BookOpen, CreditCard, MessageCircle, ClipboardCheck, Inbox } from "lucide-react";
import "./MainLayout.css";

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useRole();

  const studentBottomNav = [
    { icon: Home, label: "Ballina", path: "/" },
    { icon: Calendar, label: "Orari", path: "/orari" },
    { icon: BookOpen, label: "Lëndët", path: "/lendet" },
    { icon: CreditCard, label: "Pagesat", path: "/pagesat" },
    { icon: MessageCircle, label: "Konsultime", path: "/konsultime" },
  ];

  const profBottomNav = [
    { icon: Home, label: "Ballina", path: "/" },
    { icon: Calendar, label: "Orari", path: "/orari" },
    { icon: ClipboardCheck, label: "Vlerësimi", path: "/prof/vleresimi" },
    { icon: Inbox, label: "Kërkesat", path: "/prof/kerkesat" },
  ];

  const bottomNav = role === "professor" ? profBottomNav : studentBottomNav;

  return (
    <div
      className="main-layout-row"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Desktop Sidebar */}
      <div
        className="main-layout-box"
        style={{ width: "240px" }}
      >
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="main-layout-overlay">
          <div
            className="main-layout-layer"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="main-layout-stack"
          >
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="main-layout-stack-2">
        {/* Mobile top bar */}
        <div
          className="main-layout-row-2"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="main-layout-btn"
          >
            <Menu size={20} className="main-layout-icon" />
          </button>
          <div className="main-layout-row-3">
            <div
              className="main-layout-icon-box"
            >
              <span className="main-layout-text">S</span>
            </div>
            <span className="main-layout-text-2">SEMS</span>
          </div>
          <div className="main-layout-box-2" />
        </div>

        {/* Page content */}
        <div className="main-layout-scroll">
          {role === "professor" && <ProfTopBar />}
          <Breadcrumb />
          <Outlet />
        </div>

        {/* Mobile bottom nav */}
        <div
          className="main-layout-row-4"
        >
          {bottomNav.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className="main-layout-link"
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? "main-layout-text-3" : "main-layout-text-4"} />
                  <span className={`main-layout-text-5 ${isActive ? "main-layout-text-6" : "main-layout-text-7"}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <AccessibilityPanel />
    </div>
  );
}

import { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext({
  panelOpen: false,
  setPanelOpen: () => {},
  activeProfile: null,
  setActiveProfile: () => {},
});

export function AccessibilityProvider({ children }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  return (
    <AccessibilityContext.Provider value={{ panelOpen, setPanelOpen, activeProfile, setActiveProfile }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

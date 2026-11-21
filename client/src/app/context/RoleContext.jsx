import { createContext, useContext, useState } from "react";

const RoleContext = createContext({
  role: "student",
  setRole: () => {},
});

export function RoleProvider({
  children,
  initialRole = "student",
}) {
  const [role, setRole] = useState(initialRole);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

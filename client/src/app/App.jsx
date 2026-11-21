import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { router } from "./routes";
import { Login } from "./pages/Login";
import { RoleProvider } from "./context/RoleContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { getCurrentUser } from "../api";
import { loadStudentData } from "./data/student";
import { loadProfessorData } from "./data/professor";
import "./App.css";

// Download everything the pages need for this role from the server
function loadDataFor(role) {
  return role === "professor" ? loadProfessorData() : loadStudentData();
}

export default function App() {
  const [user, setUser] = useState(null);
  // "checking" -> looking for a saved session, "ready" -> show the app
  const [status, setStatus] = useState("checking");
  const [loadError, setLoadError] = useState("");

  // On page load: if a session token is saved, log the user back in
  useEffect(() => {
    getCurrentUser()
      .then(async (savedUser) => {
        if (savedUser) {
          await loadDataFor(savedUser.role);
          setUser(savedUser);
        }
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setStatus("ready"));
  }, []);

  const handleLogin = async (loggedInUser) => {
    await loadDataFor(loggedInUser.role);
    setUser(loggedInUser);
  };

  if (status === "checking") {
    return (
      <ThemeProvider defaultTheme="system">
        <div className="app-loading">Duke u ngarkuar…</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="system">
      {!user ? (
        <Login onLogin={handleLogin} initialError={loadError} />
      ) : (
        <RoleProvider initialRole={user.role}>
          <AccessibilityProvider>
            <RouterProvider router={router} />
          </AccessibilityProvider>
        </RoleProvider>
      )}
    </ThemeProvider>
  );
}

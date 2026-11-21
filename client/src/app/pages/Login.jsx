import { useState } from "react";
import { ArrowRight, AlertCircle, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { login } from "../../api";
import { ImageWithFallback } from "../components/ImageWithFallback";
import logoLight from "../../assets/logo-light.png";
import logoDark from "../../assets/logo-dark.png";
import "./Login.css";

const translations = {
  sq: {
    title: "Hyr në SEMS",
    subtitle: "Universiteti i Prishtinës",
    idLabel: "ID",
    idPlaceholder: "psh. 111",
    passLabel: "Fjalëkalimi",
    passPlaceholder: "••••••••",
    submit: "Hyr",
    forgot: "Keni harruar fjalëkalimin?",
    error: "Ju lutemi plotësoni ID-në dhe fjalëkalimin.",
    loading: "Duke hyrë…",
    langLabel: "English",
  },
  en: {
    title: "Sign in to SEMS",
    subtitle: "University of Pristina",
    idLabel: "ID",
    idPlaceholder: "e.g. 111",
    passLabel: "Password",
    passPlaceholder: "••••••••",
    submit: "Sign in",
    forgot: "Forgot your password?",
    error: "Please enter your ID and password.",
    loading: "Signing in…",
    langLabel: "Shqip",
  },
};

export function Login({ onLogin, initialError = "" }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("sq");
  const { resolvedTheme, setTheme } = useTheme();

  const t = translations[lang];

  const toggleLang = () => {
    setLang((l) => (l === "sq" ? "en" : "sq"));
    setError("");
  };

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setError(t.error);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // the server checks the ID + password and tells us the role
      const user = await login(userId.trim(), password);
      await onLogin(user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-row">
      <div className="login-row-2">
        <button
          onClick={toggleLang}
          className="login-btn"
          aria-label="Ndrysho gjuhën"
        >
          <Globe size={14} className="login-icon" />
          {t.langLabel}
        </button>

        <button
          onClick={toggleTheme}
          className="login-btn-2"
          aria-label="Ndrysho temën"
        >
          {resolvedTheme === "dark"
            ? <Sun size={16} className="login-icon-2" />
            : <Moon size={16} className="login-icon-3" />}
        </button>
      </div>

      <div className="login-box">
        <div className="login-stack">
          <div className="login-box-2">
            <div className="login-popup" />
            <ImageWithFallback
              src={resolvedTheme === "dark" ? logoDark : logoLight}
              alt="University Logo"
              className="login-image-with-fallback"
            />
          </div>
          <h1 className="login-title">
            {t.title}
          </h1>
          <p className="login-text">
            {t.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          {error && (
            <div className="login-card">
              <AlertCircle size={18} className="login-icon-4" />
              <p className="login-text-2">{error}</p>
            </div>
          )}

          <div className="login-box-3">
            <div>
              <label className="login-label" htmlFor="login-id">
                {t.idLabel}
              </label>
              <input
                id="login-id"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t.idPlaceholder}
                className="login-input"
                required
              />
            </div>

            <div>
              <label className="login-label" htmlFor="login-pass">
                {t.passLabel}
              </label>
              <input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passPlaceholder}
                className="login-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-3"
            disabled={loading}
          >
            {loading ? t.loading : t.submit}
            <ArrowRight size={18} />
          </button>

          <div className="login-text-3">
            <a href="#" className="login-link">
              {t.forgot}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

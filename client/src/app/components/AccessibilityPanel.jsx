import { useState } from "react";
import {
  X,
  Eye,
  Globe,
  ChevronDown,
  Search,
  Brain,
  Zap,
  Target,
  Type,
  MousePointer2,
  BookOpen,
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";
import "./AccessibilityPanel.css";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`accessibility-panel-btn ${
        checked ? "accessibility-panel-btn-2" : "accessibility-panel-btn-3"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`accessibility-panel-dot ${
          checked ? "accessibility-panel-text" : "accessibility-panel-text-2"
        }`}
      />
    </button>
  );
}

function Slider({ value, onChange, min = 80, max = 200 }) {
  return (
    <div className="accessibility-panel-row">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="accessibility-panel-input"
        style={{
          background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${
            ((value - min) / (max - min)) * 100
          }%, #FECACA ${((value - min) / (max - min)) * 100}%, #FECACA 100%)`,
        }}
      />
      <span className="accessibility-panel-text-3">
        {value}%
      </span>
    </div>
  );
}

function AccordionSection({ title, children, open, onToggle }) {
  return (
    <div className="accessibility-panel-box">
      <button
        onClick={onToggle}
        className="accessibility-panel-btn-4"
      >
        <span className="accessibility-panel-text-4">{title}</span>
        <ChevronDown
          size={16}
          className={`accessibility-panel-icon ${open ? "accessibility-panel-icon-2" : "accessibility-panel-icon-3"}`}
        />
      </button>
      {open && <div className="accessibility-panel-box-2">{children}</div>}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}) {
  return (
    <div className="accessibility-panel-row-2">
      <span className="accessibility-panel-text-5">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <div className="accessibility-panel-text-6">{label}</div>
      <Slider value={value} onChange={onChange} />
    </div>
  );
}

const colorSwatches = [
  { name: "blue", value: "#3B82F6" },
  { name: "red", value: "#EF4444" },
  { name: "amber", value: "#F59E0B" },
  { name: "yellow", value: "#FACC15" },
  { name: "teal", value: "#14B8A6" },
  { name: "green", value: "#22C55E" },
  { name: "black", value: "#111827" },
];

function ColorRow({
  label,
  selected,
  onSelect,
}) {
  return (
    <div>
      <div className="accessibility-panel-text-6">{label}</div>
      <div className="accessibility-panel-row-3">
        {colorSwatches.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelect(selected === c.value ? null : c.value)}
            className={`accessibility-panel-btn-5 ${
              selected === c.value ? "accessibility-panel-btn-6" : ""
            }`}
            style={{ backgroundColor: c.value }}
            aria-label={c.name}
          />
        ))}
      </div>
    </div>
  );
}

const profiles = [
  { id: "vizioni", name: "Vizioni", subtitle: "Kontrast i lartë dhe tekst i madh", icon: Eye },
  { id: "njohes", name: "Njohës", subtitle: "Udhëzues leximi + fonte disleksie", icon: Brain },
  { id: "epileptik", name: "I sigurt për kriza epileptike", subtitle: "Çaktivizon animacionet + grayscale", icon: Zap },
  { id: "adhd", name: "ADHD", subtitle: "Maska e leximit + modaliteti i leximit", icon: Target },
  { id: "disleksia", name: "Disleksia", subtitle: "Font disleksie + hapësirë 130%", icon: Type },
  { id: "font-disleksi", name: "Fontet e disleksisë", subtitle: "OpenDyslexic për të gjithë tekstin", icon: Type },
  { id: "kursor", name: "Kursori i madh", subtitle: "Kursor 2x + unaza fokusimi", icon: MousePointer2 },
  { id: "lexim", name: "Modaliteti i leximit", subtitle: "Heq elementet dekorative", icon: BookOpen },
];

export function AccessibilityPanel() {
  const { panelOpen, setPanelOpen, activeProfile, setActiveProfile } = useAccessibility();
  const [tab, setTab] = useState("cilesimet");
  const [openSection, setOpenSection] = useState("permbajtja");

  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [underlineTitles, setUnderlineTitles] = useState(false);
  const [textSize, setTextSize] = useState(100);
  const [spacing, setSpacing] = useState(100);
  const [readableFont, setReadableFont] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [disableAnim, setDisableAnim] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [readingMask, setReadingMask] = useState(false);

  const [invertContrast, setInvertContrast] = useState(false);
  const [boostContrast, setBoostContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [darkContrast, setDarkContrast] = useState(false);
  const [highSat, setHighSat] = useState(false);
  const [textColor, setTextColor] = useState(null);
  const [cursorColor, setCursorColor] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [titleColor, setTitleColor] = useState(null);

  const [bigCursor, setBigCursor] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [dictQ, setDictQ] = useState("");

  const toggleSection = (id) => setOpenSection((p) => (p === id ? null : id));

  const resetAll = () => {
    setUnderlineLinks(false);
    setUnderlineTitles(false);
    setTextSize(100);
    setSpacing(100);
    setReadableFont(false);
    setReadingGuide(false);
    setReadingMode(false);
    setDisableAnim(false);
    setDyslexiaFont(false);
    setReadingMask(false);
    setInvertContrast(false);
    setBoostContrast(false);
    setGrayscale(false);
    setDarkContrast(false);
    setHighSat(false);
    setTextColor(null);
    setCursorColor(null);
    setBgColor(null);
    setTitleColor(null);
    setBigCursor(false);
    setKeyboardFocus(true);
    setZoom(100);
    setActiveProfile(null);
  };

  const activateProfile = (id) => {
    if (activeProfile === id) {
      setActiveProfile(null);
      return;
    }
    setActiveProfile(id);
    // Apply preset combinations
    switch (id) {
      case "vizioni":
        setBoostContrast(true); setTextSize(130); setReadableFont(true); break;
      case "njohes":
        setReadingGuide(true); setUnderlineLinks(true); setDyslexiaFont(true); break;
      case "epileptik":
        setDisableAnim(true); setGrayscale(true); break;
      case "adhd":
        setReadingMask(true); setReadingMode(true); setDisableAnim(true); break;
      case "disleksia":
        setDyslexiaFont(true); setSpacing(130); setReadableFont(true); break;
      case "font-disleksi":
        setDyslexiaFont(true); break;
      case "kursor":
        setBigCursor(true); setKeyboardFocus(true); break;
      case "lexim":
        setReadingMode(true); setUnderlineTitles(true); setSpacing(120); break;
    }
  };

  if (!panelOpen) return null;

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="accessibility-panel-overlay"
        onClick={() => setPanelOpen(false)}
      />
      <aside
        className="accessibility-panel-aside"
      >
        {/* Header */}
        <div className="accessibility-panel-row-4">
          <button
            onClick={() => setPanelOpen(false)}
            className="accessibility-panel-btn-7"
          >
            <X size={24} />
          </button>
          <h2 className="accessibility-panel-title">
            Asistenti i Aksesueshmërisë
          </h2>
          <div className="accessibility-panel-row-5">
            <button className="accessibility-panel-btn-8">
              <Eye size={18} />
            </button>
            <button className="accessibility-panel-btn-8">
              <Globe size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="accessibility-panel-row-6">
          {([
            { key: "cilesimet", label: "Cilësimet" },
            { key: "profilet", label: "Profilet" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`accessibility-panel-btn-9 ${
                tab === t.key
                  ? "accessibility-panel-btn-10"
                  : "accessibility-panel-btn-11"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="accessibility-panel-text-7" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="accessibility-panel-scroll">
          {tab === "cilesimet" && (
            <div>
              <AccordionSection
                title="Përmbajtja"
                open={openSection === "permbajtja"}
                onToggle={() => toggleSection("permbajtja")}
              >
                <ToggleRow label="Nënvizoni lidhjet" checked={underlineLinks} onChange={setUnderlineLinks} />
                <ToggleRow label="Nënvizoni titujt" checked={underlineTitles} onChange={setUnderlineTitles} />
                <SliderRow label="Madhësia e tekstit" value={textSize} onChange={setTextSize} />
                <SliderRow label="Hapësira" value={spacing} onChange={setSpacing} />
                <ToggleRow label="Fonte të lexueshme" checked={readableFont} onChange={setReadableFont} />
                <ToggleRow label="Udhëzues leximi" checked={readingGuide} onChange={setReadingGuide} />
                <ToggleRow label="Modaliteti i leximit" checked={readingMode} onChange={setReadingMode} />
                <ToggleRow label="Çaktivizo animacionet" checked={disableAnim} onChange={setDisableAnim} />
                <ToggleRow label="Fontet e disleksisë" checked={dyslexiaFont} onChange={setDyslexiaFont} />
                <ToggleRow label="Maska e leximit" checked={readingMask} onChange={setReadingMask} />
              </AccordionSection>

              <AccordionSection
                title="Ngjyrë"
                open={openSection === "ngjyre"}
                onToggle={() => toggleSection("ngjyre")}
              >
                <ToggleRow label="Kontrasti i kundërt" checked={invertContrast} onChange={setInvertContrast} />
                <ToggleRow label="Ndriçoni kontrastin" checked={boostContrast} onChange={setBoostContrast} />
                <ToggleRow label="Ekran pa ngjyrë" checked={grayscale} onChange={setGrayscale} />
                <ToggleRow label="Kontrasti i errët" checked={darkContrast} onChange={setDarkContrast} />
                <ToggleRow label="Saturim i lartë" checked={highSat} onChange={setHighSat} />
                <ColorRow label="Ngjyra e tekstit" selected={textColor} onSelect={setTextColor} />
                <ColorRow label="Ngjyra e treguesit" selected={cursorColor} onSelect={setCursorColor} />
                <ColorRow label="Ngjyra e sfondit" selected={bgColor} onSelect={setBgColor} />
                <ColorRow label="Ngjyra e titullit" selected={titleColor} onSelect={setTitleColor} />
              </AccordionSection>

              <AccordionSection
                title="Navigimi"
                open={openSection === "navigimi"}
                onToggle={() => toggleSection("navigimi")}
              >
                <ToggleRow label="Kursori i madh" checked={bigCursor} onChange={setBigCursor} />
                <ToggleRow label="Fokusimi i tastierës" checked={keyboardFocus} onChange={setKeyboardFocus} />
                <SliderRow label="Ekrani i zmadhimit" value={zoom} onChange={setZoom} />
                <button className="accessibility-panel-btn-12">
                  Struktura e faqes →
                </button>
              </AccordionSection>

              <div className="accessibility-panel-box-3">
                <div className="accessibility-panel-text-8">
                  Kërko Fjalor
                </div>
                <div className="accessibility-panel-card">
                  <Search size={14} className="accessibility-panel-icon-4" />
                  <input
                    value={dictQ}
                    onChange={(e) => setDictQ(e.target.value)}
                    placeholder="Kërko fjalë..."
                    className="accessibility-panel-input-2"
                  />
                </div>
                {dictQ && (
                  <div className="accessibility-panel-card-2">
                    <span className="accessibility-panel-text-9">{dictQ}</span>: Fjalë e kërkuar — definicioni do të shfaqet këtu.
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "profilet" && (
            <div className="accessibility-panel-box-4">
              {profiles.map((p) => {
                const active = activeProfile === p.id;
                return (
                  <div
                    key={p.id}
                    className={`accessibility-panel-row-7 ${
                      active ? "accessibility-panel-box-5" : ""
                    }`}
                  >
                    <div
                      className={`accessibility-panel-icon-box ${
                        active
                          ? "accessibility-panel-box-6"
                          : "accessibility-panel-box-7"
                      }`}
                    >
                      <p.icon size={18} />
                    </div>
                    <div className="accessibility-panel-box-8">
                      <div className="accessibility-panel-text-10">
                        {p.name}
                      </div>
                      <div className="accessibility-panel-text-11">
                        {p.subtitle}
                      </div>
                    </div>
                    <Toggle checked={active} onChange={() => activateProfile(p.id)} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="accessibility-panel-box-9">
          <div className="accessibility-panel-row-3">
            <button className="accessibility-panel-btn-13">
              Deklarata
            </button>
            <button
              onClick={resetAll}
              className="accessibility-panel-btn-14"
            >
              Rivendosur
            </button>
          </div>
          <div className="accessibility-panel-text-12">
            Mundësuar nga AccessWay
          </div>
        </div>
      </aside>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { Search, X, History } from "lucide-react";
import "./SmartSearch.css";

export function SmartSearch({
  value,
  onChange,
  suggestions,
  placeholder = "Kërko...",
  headerLabel = "Sugjerime",
  size = "md",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState(suggestions);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const q = value.trim().toLowerCase();
      if (!q) setFiltered(suggestions);
      else
        setFiltered(
          suggestions.filter((s) => s.label.toLowerCase().includes(q))
        );
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value, suggestions]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const h = size === "sm" ? "smart-search-h" : "smart-search-h-2";
  const textSize = size === "sm" ? "smart-search-text-size" : "smart-search-text-size-2";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <div ref={wrapRef} className={`smart-search-box ${className}`}>
      <div
        className={`smart-search-card ${h} ${
          open
            ? "smart-search-box-2"
            : "smart-search-box-3"
        }`}
      >
        <Search
          size={iconSize}
          className="smart-search-icon"
        />
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          placeholder={placeholder}
          className={`smart-search-input ${textSize}`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="smart-search-btn"
            aria-label="Pastro"
          >
            <X size={iconSize} />
          </button>
        )}
      </div>

      {open && (
        <div className="smart-search-popup">
          <div className="smart-search-box-4">
            {value.trim() ? "Rezultate" : headerLabel}
          </div>
          <div className="smart-search-scroll">
            {filtered.length === 0 ? (
              <div className="smart-search-box-5">
                Nuk u gjet asnjë sugjerim
              </div>
            ) : (
              filtered.map((s) => {
                const Icon = s.icon ?? History;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onChange(s.label);
                      setOpen(false);
                    }}
                    className="smart-search-btn-2"
                  >
                    <Icon
                      size={15}
                      className="smart-search-icon"
                    />
                    <span className="smart-search-text">{s.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import "./TjeraAdministrata.css";

const stafi = [
  { id: 1, emri: "Almira Dizdari",   pozita: "Referent", email: "almira.dizdari@uni-pr.edu" },
  { id: 2, emri: "Artan Alidema",    pozita: "Referent", email: "artan.alidema@uni-pr.edu" },
  { id: 3, emri: "Besiana Bashota",  pozita: "Referent", email: "besiana.bashota@uni-pr.edu" },
  { id: 4, emri: "Donika Krasniqi",  pozita: "Referent", email: "donika.krasniqi@uni-pr.edu" },
  { id: 5, emri: "Endrit Morina",    pozita: "Referent", email: "endrit.morina@uni-pr.edu" },
  { id: 6, emri: "Fatmire Gashi",    pozita: "Referent", email: "fatmire.gashi@uni-pr.edu" },
];

function AvatarPlaceholder() {
  return (
    <div className="tjera-administrata-avatar">
      <svg viewBox="0 0 96 96" fill="none" className="tjera-administrata-svg">
        <circle cx="48" cy="38" r="18" fill="#fff" fillOpacity="0.55" />
        <ellipse cx="48" cy="82" rx="28" ry="20" fill="#fff" fillOpacity="0.55" />
      </svg>
    </div>
  );
}

function StafiCard({ s }) {
  return (
    <div className="tjera-administrata-card">
      <AvatarPlaceholder />
      <div className="tjera-administrata-stack">
        <p className="tjera-administrata-text">
          {s.emri.toUpperCase()}
        </p>
        <p className="tjera-administrata-text-2">
          {s.pozita}
        </p>
        <a
          href={`mailto:${s.email}`}
          className="tjera-administrata-link"
        >
          {s.email}
        </a>
      </div>
    </div>
  );
}

export function TjeraAdministrata() {
  return (
    <div className="tjera-administrata-box">
      <div className="tjera-administrata-stack-2">
        <h1 className="tjera-administrata-title">
          Administrata
        </h1>
        <p className="tjera-administrata-text-3">
          Stafi administrativ i fakultetit.
        </p>
      </div>

      <div className="tjera-administrata-card-2">
        <div className="tjera-administrata-grid">
          {stafi.map((s) => (
            <StafiCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

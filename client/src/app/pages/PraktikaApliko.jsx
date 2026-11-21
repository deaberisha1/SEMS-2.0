import { useState } from "react";
import { MapPin, Clock, Calendar, Eye, Send, Briefcase } from "lucide-react";
import "./PraktikaApliko.css";

const praktikat = [
  {
    id: 1,
    kompania: "Raiffeisen Bank Kosovo",
    pozita: "Praktikant Financiar",
    lokacioni: "Prishtinë",
    kohezgjatja: "3 muaj",
    afati: "30 Qershor 2025",
    statusi: "Aktiv",
  },
  {
    id: 2,
    kompania: "Telekomi i Kosovës",
    pozita: "Praktikant IT",
    lokacioni: "Prishtinë",
    kohezgjatja: "6 muaj",
    afati: "15 Korrik 2025",
    statusi: "Aktiv",
  },
  {
    id: 3,
    kompania: "ProCredit Bank",
    pozita: "Praktikant Marketingu",
    lokacioni: "Prizren",
    kohezgjatja: "2 muaj",
    afati: "10 Maj 2025",
    statusi: "Mbyllur",
  },
  {
    id: 4,
    kompania: "ICK – Innovation Centre Kosovo",
    pozita: "Praktikant Zhvillues Web",
    lokacioni: "Prishtinë",
    kohezgjatja: "4 muaj",
    afati: "20 Gusht 2025",
    statusi: "Në pritje",
  },
];

const statusConfig = {
  "Aktiv": {
    bg: "praktika-apliko-bg",
    text: "praktika-apliko-text",
    dot: "praktika-apliko-dot",
  },
  "Në pritje": {
    bg: "praktika-apliko-bg-2",
    text: "praktika-apliko-text-2",
    dot: "praktika-apliko-dot-2",
  },
  "Mbyllur": {
    bg: "praktika-apliko-bg-3",
    text: "praktika-apliko-text-3",
    dot: "praktika-apliko-dot-3",
  },
};

function StatusBadge({ statusi }) {
  const cfg = statusConfig[statusi];
  return (
    <span
      className={`praktika-apliko-badge ${cfg.bg} ${cfg.text}`}
    >
      <span className={`praktika-apliko-dot-4 ${cfg.dot}`} />
      {statusi}
    </span>
  );
}

function PraktikaCard({ p }) {
  const isClosed = p.statusi === "Mbyllur";
  return (
    <div className="praktika-apliko-card">
      <div className="praktika-apliko-stack">
        <div className="praktika-apliko-row">
          <div className="praktika-apliko-icon-box">
            <Briefcase className="praktika-apliko-icon" />
          </div>
          <div>
            <p className="praktika-apliko-text-4">
              {p.kompania}
            </p>
            <p className="praktika-apliko-text-5">
              {p.pozita}
            </p>
          </div>
        </div>
        <StatusBadge statusi={p.statusi} />
      </div>

      <div className="praktika-apliko-grid">
        <div className="praktika-apliko-row-2">
          <MapPin className="praktika-apliko-icon-2" />
          <span>{p.lokacioni}</span>
        </div>
        <div className="praktika-apliko-row-2">
          <Clock className="praktika-apliko-icon-2" />
          <span>{p.kohezgjatja}</span>
        </div>
        <div className="praktika-apliko-row-2">
          <Calendar className="praktika-apliko-icon-2" />
          <span>Afati: {p.afati}</span>
        </div>
      </div>

      <div className="praktika-apliko-row-3">
        <button
          type="button"
          className="praktika-apliko-btn"
        >
          <Eye className="praktika-apliko-icon-3" />
          Shiko
        </button>
        <button
          type="button"
          disabled={isClosed}
          className={`praktika-apliko-btn-2 ${
            isClosed
              ? "praktika-apliko-btn-3"
              : "praktika-apliko-btn-4"
          }`}
        >
          <Send className="praktika-apliko-icon-3" />
          Apliko
        </button>
      </div>
    </div>
  );
}

export function PraktikaApliko() {
  const [kerkimi, setKerkimi] = useState("");

  const filtered = praktikat.filter(
    (p) =>
      p.kompania.toLowerCase().includes(kerkimi.toLowerCase()) ||
      p.pozita.toLowerCase().includes(kerkimi.toLowerCase()) ||
      p.lokacioni.toLowerCase().includes(kerkimi.toLowerCase())
  );

  return (
    <div className="praktika-apliko-box">
      <div className="praktika-apliko-stack-2">
        <h1 className="praktika-apliko-title">
          Praktika
        </h1>
        <p className="praktika-apliko-text-6">
          Apliko për praktikë profesionale përmes SEMS.
        </p>
      </div>

      <div className="praktika-apliko-card-2">
        <div className="praktika-apliko-stack-3">
          <input
            type="text"
            placeholder="Kërko kompani, pozitë ose lokacion..."
            value={kerkimi}
            onChange={(e) => setKerkimi(e.target.value)}
            className="praktika-apliko-input"
          />
          <button
            type="button"
            className="praktika-apliko-btn-5"
          >
            <Send className="praktika-apliko-icon-4" />
            Apliko
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="praktika-apliko-stack-4">
            <div className="praktika-apliko-icon-box-2">
              <Briefcase className="praktika-apliko-icon-5" />
            </div>
            <p className="praktika-apliko-text-7">
              Aktualisht nuk ka praktika të disponueshme.
            </p>
            <p className="praktika-apliko-text-8">
              Provoni me terma të tjerë kërkimi.
            </p>
          </div>
        ) : (
          <div className="praktika-apliko-grid-2">
            {filtered.map((p) => (
              <PraktikaCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

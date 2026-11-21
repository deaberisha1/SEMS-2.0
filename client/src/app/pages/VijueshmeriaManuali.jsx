import { useState } from "react";
import {
  Camera,
  QrCode,
  CheckCircle2,
  Smartphone,
  Info,
  RotateCcw,
  ExternalLink,
  ScanLine,
} from "lucide-react";

import "./VijueshmeriaManuali.css";

const sharedSteps = [
  { icon: QrCode, title: 'Hapni menynë "Vijueshmëria" dhe zgjidhni "Scan QR Code".' },
  { icon: Camera, title: "Lejoni aplikacionit qasjen në Kamerë dhe Lokacion (Precise Location) kur t'ju kërkohet." },
  { icon: ScanLine, title: "Drejtojeni kamerën drejt kodit QR të shfaqur nga profesori në sallë." },
  { icon: CheckCircle2, title: 'Prisni mesazhin e gjelbër të konfirmimit ("Evidenca u ruajt me sukses").' },
  { icon: RotateCcw, title: "Për dalje, përsëriteni skanimin në fund të ligjëratës." },
];

const androidSteps = sharedSteps;
const iphoneSteps = sharedSteps;

function StepList({ steps }) {
  return (
    <ol className="vijueshmeria-manuali-list">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isSuccess = step.icon === CheckCircle2;
        return (
          <li key={i} className="hover-group vijueshmeria-manuali-item">
            {/* Step number + connector */}
            <div className="vijueshmeria-manuali-stack">
              <div
                className={`vijueshmeria-manuali-avatar ${
                  isSuccess
                    ? "vijueshmeria-manuali-box"
                    : "vijueshmeria-manuali-box-2"
                }`}
              >
                <Icon
                  size={15}
                  className={isSuccess ? "vijueshmeria-manuali-icon" : "vijueshmeria-manuali-icon-2"}
                />
              </div>
              {i < steps.length - 1 && (
                <div className="vijueshmeria-manuali-box-3" />
              )}
            </div>

            {/* Content */}
            <div className="vijueshmeria-manuali-box-4">
              <div className="vijueshmeria-manuali-row">
                <span className="vijueshmeria-manuali-text">
                  {i + 1}.
                </span>
                <span
                  className={`vijueshmeria-manuali-text-2 ${
                    isSuccess ? "vijueshmeria-manuali-text-3" : "vijueshmeria-manuali-text-4"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {step.note && (
                <p className="vijueshmeria-manuali-text-5">{step.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function VijueshmeriaManuali() {
  const [activeTab, setActiveTab] = useState("android");

  return (
    <div className="vijueshmeria-manuali-box-5">
      <div className="vijueshmeria-manuali-box-6">

        {/* Header */}
        <div className="vijueshmeria-manuali-text-6">
          <h1 className="vijueshmeria-manuali-title">
            Manuali i Vijueshmërisë
          </h1>
          <p className="vijueshmeria-manuali-text-7">
            Si të skanoni QR Code për të regjistruar prezencën
          </p>
        </div>

        {/* Info alert */}
        <div className="vijueshmeria-manuali-card">
          <Info size={16} className="vijueshmeria-manuali-icon-3" />
          <p className="vijueshmeria-manuali-text-8">
            <span className="vijueshmeria-manuali-text-9">Kujdes:</span> QR Code duhet të skanohet vetëm brenda sallës së ligjëratës.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="vijueshmeria-manuali-box-7">
          <div className="vijueshmeria-manuali-row-2">
            {(["android", "iphone"]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`vijueshmeria-manuali-btn ${
                  activeTab === tab
                    ? "vijueshmeria-manuali-btn-2"
                    : "vijueshmeria-manuali-btn-3"
                }`}
              >
                <Smartphone size={15} />
                {tab === "android" ? "Android" : "iPhone"}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="vijueshmeria-manuali-box-8">
            <StepList steps={activeTab === "android" ? androidSteps : iphoneSteps} />
          </div>
        </div>

        {/* Success example */}
        <div className="vijueshmeria-manuali-card-2">
          <CheckCircle2 size={16} className="vijueshmeria-manuali-icon-4" />
          <div>
            <p className="vijueshmeria-manuali-text-10">
              Shembull mesazhi i suksesshëm
            </p>
            <p className="vijueshmeria-manuali-text-11">
              "Evidenca juaj është ruajtur me sukses."
            </p>
          </div>
        </div>

        {/* Full manual button */}
        <div className="vijueshmeria-manuali-card-3">
          <div>
            <p className="vijueshmeria-manuali-text-12">
              Keni nevojë për ndihmë të mëtejshme?
            </p>
            <p className="vijueshmeria-manuali-text-13">
              Lexoni udhëzimet e plota të vijueshmërisë me QR Code.
            </p>
          </div>
          <button className="vijueshmeria-manuali-btn-4">
            Shiko Manualin e Plotë
            <ExternalLink size={13} />
          </button>
        </div>

      </div>
    </div>
  );
}

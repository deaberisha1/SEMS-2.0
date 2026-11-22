import { useState } from "react";
import { Search } from "lucide-react";
import FormField from "../components/FormField";
import "./KthimiMjeteve.css";

export function KthimiMjeteve() {
  const [regjistri, setRegjistri] = useState("240204100009");

  return (
    <div className="kthimi-mjeteve-box">
      <div className="kthimi-mjeteve-stack">
        <h1 className="kthimi-mjeteve-title">
          Kthimi i mjeteve
        </h1>
        <p className="kthimi-mjeteve-text">
          Kërkoni sipas numrit të regjistrit.
        </p>
      </div>

      <div className="kthimi-mjeteve-card">
        <FormField id="regjistri" label="Numri i regjistrit" error="Test">
          <div className="kthimi-mjeteve-row">
            <input
              id="regjistri"
              type="text"
              value={regjistri}
              onChange={(e) => setRegjistri(e.target.value)}
              className="kthimi-mjeteve-input"
              placeholder="Shkruani numrin e regjistrit"
              aria-invalid={true}
              aria-describedby="regjistri-error"
            />
            <button type="button" className="kthimi-mjeteve-btn">
              <Search className="kthimi-mjeteve-icon" />
              Kërko
            </button>
          </div>
        </FormField>
      </div>
    </div>
  );
}

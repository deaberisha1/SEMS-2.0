import "./PlaceholderPage.css";

export function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page-box">
      <div className="placeholder-page-stack">
        <h1 className="placeholder-page-title">
          {title}
        </h1>
        <p className="placeholder-page-text">
          Kjo faqe është në ndërtim e sipër.
        </p>
      </div>
      <div className="placeholder-page-card">
        <div className="placeholder-page-text-2">
          <svg className="placeholder-page-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="placeholder-page-text-3">Së shpejti</p>
      </div>
    </div>
  );
}
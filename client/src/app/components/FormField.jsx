import "./FormField.css";

export default function FormField({ id, label, error, hint, required, children }) {
  return (
    <div className={"form-field" + (error ? " form-field--error" : "")}>
      <label htmlFor={id} className="form-field-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={id + "-error"} className="form-field-error" role="alert">{error}</p>
      ) : (
        hint && <p id={id + "-hint"} className="form-field-hint">{hint}</p>
      )}
    </div>
  );
}

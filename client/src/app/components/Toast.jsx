import { CheckCircle2, AlertCircle, X } from "lucide-react";
import "./Toast.css";

export default function Toast({ type = "success", message, onClose }) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={"toast toast--" + type} role={type === "error" ? "alert" : "status"}>
      <Icon size={20} />
      <span>{message}</span>
      <button type="button" aria-label="Mbyll njoftimin" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

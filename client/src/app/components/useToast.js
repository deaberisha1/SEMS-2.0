import { useState, useEffect, useCallback } from "react";

export function useToast(duration = 3500) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(id);
  }, [toast, duration]);

  return { toast, showToast, hideToast };
}

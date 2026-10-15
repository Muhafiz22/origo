import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);
const MAX_TOASTS = 3;
const DURATION_MS = 4000;
const ALERT_CLASS = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, type, message }].slice(-MAX_TOASTS));
      setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
      info: (m) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast toast-top toast-center z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`alert ${ALERT_CLASS[t.type]}`}
          >
            <span>{t.message}</span>
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

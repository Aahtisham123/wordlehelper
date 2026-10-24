"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; title: string; message?: string };
type ToastFn = (t: Omit<Toast, "id">) => void;

const ToastContext = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastContext);

const ICON: Record<ToastType, string> = { success: "CircleCheckBig", error: "CircleAlert", info: "Info" };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const dismiss = useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);
  const push = useCallback<ToastFn>((t) => {
    const id = nextId.current++;
    setToasts((all) => [...all.slice(-2), { ...t, id }]);
    setTimeout(() => dismiss(id), t.type === "error" ? 6000 : 3500);
  }, [dismiss]);

  // Let non-React code (e.g. inline scripts) raise toasts too.
  useEffect(() => {
    const onEvent = (e: Event) => push((e as CustomEvent).detail);
    window.addEventListener("wh:toast", onEvent);
    return () => window.removeEventListener("wh:toast", onEvent);
  }, [push]);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon name={ICON[t.type]} size={20} />
            <div>
              <strong>{t.title}</strong>
              {t.message && <p>{t.message}</p>}
            </div>
            <button type="button" className="icon-btn" onClick={() => dismiss(t.id)} aria-label="Dismiss message">
              <Icon name="X" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

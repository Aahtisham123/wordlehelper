import type { ReactNode } from "react";
import { Icon } from "./Icon";

const ICON = { success: "CircleCheckBig", error: "CircleAlert", warning: "TriangleAlert", info: "Info", tip: "Lightbulb" } as const;

/** Inline message box for success, error, warning, info and tip states. */
export function Alert({ type = "info", title, children }: { type?: keyof typeof ICON; title?: string; children?: ReactNode }) {
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : undefined}>
      <Icon name={ICON[type]} size={20} />
      <div>
        {title && <strong>{title}</strong>}
        {children && <div className="alert-body">{children}</div>}
      </div>
    </div>
  );
}

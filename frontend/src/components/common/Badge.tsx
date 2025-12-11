import type { ReactNode } from "react";

interface Props {
  variant?: "success" | "warning" | "danger" | "info";
  children: ReactNode;
}

export function Badge({ variant = "info", children }: Props) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}

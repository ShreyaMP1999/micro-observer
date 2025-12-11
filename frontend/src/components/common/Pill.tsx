import type { ReactNode } from "react";

interface Props {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Pill({ active, onClick, children }: Props) {
  return (
    <button
      type="button"
      className={`pill ${active ? "pill--active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

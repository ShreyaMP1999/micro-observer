import { useEffect } from "react";

export function usePolling(callback: () => void, intervalMs: number) {
  useEffect(() => {
    callback(); // initial call
    const id = setInterval(callback, intervalMs);
    return () => clearInterval(id);
  }, [callback, intervalMs]);
}

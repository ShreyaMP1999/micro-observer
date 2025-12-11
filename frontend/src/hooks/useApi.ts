import { useCallback, useEffect, useState } from "react";

export function useApi<T>(
  fn: () => Promise<T>,
  deps: any[] = [],
  auto = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (auto) {
      execute();
    }
  }, [execute, auto]);

  return { data, loading, error, refetch: execute };
}

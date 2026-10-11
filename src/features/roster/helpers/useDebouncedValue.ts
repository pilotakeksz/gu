import { useEffect, useState } from "react";
export function useDebouncedValue(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return (): void => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

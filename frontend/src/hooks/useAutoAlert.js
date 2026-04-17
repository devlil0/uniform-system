import { useEffect } from 'react';

export function useAutoAlert(value, setter, ms = 3000) {
  useEffect(() => {
    if (!value) return;
    const id = setTimeout(() => setter(''), ms);
    return () => clearTimeout(id);
  }, [value, setter, ms]);
}

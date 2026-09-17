import { useCallback, useState } from "react";

const STORAGE_KEY = "english-practice.geminiApiKey.v1";

/** The key stays in this browser only; it is never sent anywhere but Google's API. */
export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  const save = useCallback((key: string) => {
    const trimmed = key.trim();
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // localStorage unavailable — the key still works for this session
    }
    setApiKey(trimmed);
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing to clean up
    }
    setApiKey("");
  }, []);

  return { apiKey, save, clear };
}

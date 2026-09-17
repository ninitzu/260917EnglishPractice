import type { Word } from "./types";
import { createSeedWords } from "./data/seedWords";

const STORAGE_KEY = "english-practice.words.v1";

export function loadWords(): Word[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createSeedWords();
      saveWords(seeded);
      return seeded;
    }
    return JSON.parse(raw) as Word[];
  } catch {
    return createSeedWords();
  }
}

export function saveWords(words: Word[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — silently skip persistence
  }
}

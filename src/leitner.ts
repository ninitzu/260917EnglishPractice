import type { Word } from "./types";

const BOX_INTERVAL_DAYS = [0, 0, 1, 2, 4, 7]; // index = box (1..5)
export const MAX_BOX = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

export function applyReview(word: Word, wasCorrect: boolean): Word {
  const now = Date.now();
  const nextBox = wasCorrect ? Math.min(word.box + 1, MAX_BOX) : 1;
  const intervalDays = BOX_INTERVAL_DAYS[nextBox];
  return {
    ...word,
    box: nextBox,
    nextReviewAt: now + intervalDays * DAY_MS,
    correctCount: word.correctCount + (wasCorrect ? 1 : 0),
    wrongCount: word.wrongCount + (wasCorrect ? 0 : 1),
  };
}

export function isDue(word: Word, now: number = Date.now()): boolean {
  return word.nextReviewAt <= now;
}

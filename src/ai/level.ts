import type { Word } from "../types";
import { MAX_BOX } from "../leitner";

export interface LevelSummary {
  /** CEFR band used to steer the model's word choice. */
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  /** Share of correct answers, or null when nothing has been reviewed yet. */
  accuracy: number | null;
  reviews: number;
  avgBox: number;
  hasData: boolean;
}

const BANDS: { max: number; level: LevelSummary["level"] }[] = [
  { max: 1.6, level: "A1" },
  { max: 2.4, level: "A2" },
  { max: 3.2, level: "B1" },
  { max: 4.0, level: "B2" },
  { max: Infinity, level: "C1" },
];

export function estimateLevel(words: Word[]): LevelSummary {
  const reviews = words.reduce((n, w) => n + w.correctCount + w.wrongCount, 0);
  const correct = words.reduce((n, w) => n + w.correctCount, 0);
  const avgBox = words.length
    ? words.reduce((n, w) => n + w.box, 0) / words.length
    : 1;

  if (reviews === 0) {
    return { level: "A2", accuracy: null, reviews, avgBox, hasData: false };
  }

  const accuracy = correct / reviews;
  // Mastery carries the estimate; accuracy nudges it up or down by up to one band.
  const score = Math.min(avgBox, MAX_BOX) + (accuracy - 0.5) * 2;
  const level = BANDS.find((b) => score < b.max)!.level;

  return { level, accuracy, reviews, avgBox, hasData: true };
}

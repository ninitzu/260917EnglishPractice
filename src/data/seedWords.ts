import type { Word } from "../types";

const seedTerms: { term: string; meaning: string; example?: string }[] = [
  { term: "apple", meaning: "사과", example: "I eat an apple every morning." },
  {
    term: "journey",
    meaning: "여행, 여정",
    example: "Life is a journey, not a destination.",
  },
  {
    term: "achieve",
    meaning: "성취하다, 달성하다",
    example: "She achieved her goal.",
  },
  {
    term: "brave",
    meaning: "용감한",
    example: "The brave firefighter saved the cat.",
  },
  {
    term: "curious",
    meaning: "호기심 많은",
    example: "Curious children ask many questions.",
  },
  {
    term: "diligent",
    meaning: "근면한, 성실한",
    example: "He is a diligent student.",
  },
  {
    term: "efficient",
    meaning: "효율적인",
    example: "This is an efficient way to work.",
  },
  {
    term: "fascinate",
    meaning: "매혹하다",
    example: "The story fascinated the audience.",
  },
];

export function createSeedWords(): Word[] {
  const now = Date.now();
  return seedTerms.map((w, i) => ({
    id: `seed-${i}-${now}`,
    term: w.term,
    meaning: w.meaning,
    example: w.example,
    box: 1,
    nextReviewAt: now,
    createdAt: now,
    correctCount: 0,
    wrongCount: 0,
  }));
}

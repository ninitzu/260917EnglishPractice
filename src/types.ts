export interface Word {
  id: string;
  term: string;
  meaning: string;
  example?: string;
  box: number; // Leitner box, 1 (new) to 5 (mastered)
  nextReviewAt: number; // epoch ms
  createdAt: number;
  correctCount: number;
  wrongCount: number;
}

export type NewWord = Pick<Word, "term" | "meaning" | "example">;

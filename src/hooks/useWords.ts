import { useCallback, useEffect, useState } from "react";
import type { NewWord, Word } from "../types";
import { loadWords, saveWords } from "../storage";
import { applyReview } from "../leitner";

export function useWords() {
  const [words, setWords] = useState<Word[]>(() => loadWords());

  useEffect(() => {
    saveWords(words);
  }, [words]);

  const addWord = useCallback((input: NewWord) => {
    const now = Date.now();
    const word: Word = {
      id: `${now}-${Math.random().toString(36).slice(2, 9)}`,
      term: input.term.trim(),
      meaning: input.meaning.trim(),
      example: input.example?.trim() || undefined,
      box: 1,
      nextReviewAt: now,
      createdAt: now,
      correctCount: 0,
      wrongCount: 0,
    };
    setWords((prev) => [word, ...prev]);
  }, []);

  const updateWord = useCallback((id: string, input: NewWord) => {
    setWords((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              term: input.term.trim(),
              meaning: input.meaning.trim(),
              example: input.example?.trim() || undefined,
            }
          : w,
      ),
    );
  }, []);

  const deleteWord = useCallback((id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const reviewWord = useCallback((id: string, wasCorrect: boolean) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? applyReview(w, wasCorrect) : w)),
    );
  }, []);

  return { words, addWord, updateWord, deleteWord, reviewWord };
}

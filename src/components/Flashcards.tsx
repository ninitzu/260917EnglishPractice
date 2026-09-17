import { useMemo, useState } from "react";
import type { Word } from "../types";
import { isDue } from "../leitner";

interface FlashcardsProps {
  words: Word[];
  onReview: (id: string, wasCorrect: boolean) => void;
}

export function Flashcards({ words, onReview }: FlashcardsProps) {
  const dueWords = useMemo(() => words.filter((w) => isDue(w)), [words]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  const current = dueWords[index];

  if (words.length === 0) {
    return <p className="empty-state">먼저 단어장에서 단어를 추가해주세요.</p>;
  }

  if (!current) {
    return (
      <div className="session-complete">
        <p className="empty-state">
          {sessionDone > 0
            ? `오늘 복습할 단어를 모두 마쳤어요! (${sessionDone}개 학습)`
            : "오늘 복습할 단어가 없어요. 잘하고 있어요!"}
        </p>
      </div>
    );
  }

  const goNext = (wasCorrect: boolean) => {
    onReview(current.id, wasCorrect);
    setSessionDone((n) => n + 1);
    setFlipped(false);
    setIndex((i) => (i + 1 < dueWords.length ? i + 1 : 0));
  };

  return (
    <div className="flashcards">
      <p className="flashcards__progress">
        오늘 복습: {index + 1} / {dueWords.length}
      </p>
      <div
        className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
      >
        <div className="flashcard__face">
          {!flipped ? (
            <span className="flashcard__term">{current.term}</span>
          ) : (
            <div className="flashcard__back">
              <span className="flashcard__meaning">{current.meaning}</span>
              {current.example && <span className="flashcard__example">{current.example}</span>}
            </div>
          )}
        </div>
      </div>
      <p className="flashcards__hint">카드를 클릭하면 뜻이 보여요</p>
      {flipped && (
        <div className="flashcards__actions">
          <button className="danger" onClick={() => goNext(false)}>
            몰랐어요
          </button>
          <button className="primary" onClick={() => goNext(true)}>
            알았어요
          </button>
        </div>
      )}
    </div>
  );
}

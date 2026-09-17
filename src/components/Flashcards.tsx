import { useMemo, useState } from "react";
import type { Word } from "../types";
import { isDue } from "../leitner";
import { MasteryDots } from "./MasteryDots";

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
    return <p className="notice">먼저 단어장에서 단어를 추가해주세요.</p>;
  }

  if (!current) {
    return (
      <div className="notice">
        <span className="notice__sticker">All done!</span>
        <p>
          {sessionDone > 0
            ? `오늘 복습할 단어를 모두 마쳤어요. ${sessionDone}개 학습 완료.`
            : "오늘 복습할 단어가 없어요. 잘하고 있어요."}
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
    <section className="stage">
      <p className="stage__progress">
        카드 {index + 1} / {dueWords.length}
      </p>

      <div className="card-wrap">
        <span className="sticker">Keep going</span>
        <button
          type="button"
          className="card card--tap"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "단어 보기" : "뜻 보기"}
        >
          {!flipped ? (
            <span className="card__term">{current.term}</span>
          ) : (
            <span className="card__back">
              <span className="card__meaning">{current.meaning}</span>
              {current.example && (
                <span className="quote">{current.example}</span>
              )}
            </span>
          )}
          <span className="card__meter">
            <MasteryDots box={current.box} />
          </span>
        </button>
      </div>

      {flipped ? (
        <div className="stage__actions">
          <button className="btn btn--primary" onClick={() => goNext(true)}>
            알았어요
          </button>
          <button className="btn btn--ghost" onClick={() => goNext(false)}>
            아직 모르겠어요
          </button>
        </div>
      ) : (
        <p className="stage__hint">카드를 누르면 뜻이 보여요</p>
      )}
    </section>
  );
}

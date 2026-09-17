import { useMemo, useState } from "react";
import type { Word } from "../types";

interface QuizProps {
  words: Word[];
  onReview: (id: string, wasCorrect: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestion(words: Word[], target: Word) {
  const distractors = shuffle(words.filter((w) => w.id !== target.id)).slice(
    0,
    3,
  );
  return shuffle([target, ...distractors]);
}

export function Quiz({ words, onReview }: QuizProps) {
  const [order] = useState(() => shuffle(words).map((w) => w.id));
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = words.find((w) => w.id === order[index]);
  const options = useMemo(
    () => (current ? buildQuestion(words, current) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id, words.length],
  );

  if (words.length < 4) {
    return <p className="notice">퀴즈를 풀려면 단어가 4개 이상 필요해요.</p>;
  }

  if (!current) {
    return (
      <div className="notice">
        <span className="notice__sticker">Nice work</span>
        <p>
          퀴즈 완료. {score.total}문제 중 {score.correct}개 정답.
        </p>
      </div>
    );
  }

  const handleSelect = (optionId: string) => {
    if (selectedId) return;
    const wasCorrect = optionId === current.id;
    setSelectedId(optionId);
    setScore((s) => ({
      correct: s.correct + (wasCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    onReview(current.id, wasCorrect);
  };

  return (
    <section className="stage">
      <p className="stage__progress">
        {index + 1} / {order.length} · 정답 {score.correct}개
      </p>

      <h2 className="display">{current.term}</h2>
      <p className="stage__hint">알맞은 뜻을 고르세요</p>

      <div className="choices">
        {options.map((opt) => {
          const answered = selectedId !== null;
          const isAnswer = opt.id === current.id;
          const className = [
            "choice",
            answered && isAnswer ? "is-correct" : "",
            answered && selectedId === opt.id && !isAnswer ? "is-wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={opt.id}
              className={className}
              onClick={() => handleSelect(opt.id)}
            >
              {opt.meaning}
            </button>
          );
        })}
      </div>

      {selectedId && (
        <div className="stage__actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              setSelectedId(null);
              setIndex((i) => i + 1);
            }}
          >
            다음 문제
          </button>
        </div>
      )}
    </section>
  );
}

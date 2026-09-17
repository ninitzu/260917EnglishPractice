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
  const distractors = shuffle(words.filter((w) => w.id !== target.id)).slice(0, 3);
  const options = shuffle([target, ...distractors]);
  return options;
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
    [current?.id, words.length]
  );

  if (words.length < 4) {
    return (
      <p className="empty-state">퀴즈를 풀려면 단어가 4개 이상 필요해요. 단어를 더 추가해주세요!</p>
    );
  }

  if (!current) {
    return (
      <div className="session-complete">
        <p className="empty-state">
          퀴즈 완료! {score.total}문제 중 {score.correct}개 맞혔어요.
        </p>
      </div>
    );
  }

  const handleSelect = (optionId: string) => {
    if (selectedId) return;
    const wasCorrect = optionId === current.id;
    setSelectedId(optionId);
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    onReview(current.id, wasCorrect);
  };

  const handleNext = () => {
    setSelectedId(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="quiz">
      <p className="quiz__progress">
        문제 {index + 1} / {order.length} · 점수 {score.correct}/{score.total}
      </p>
      <h2 className="quiz__term">{current.term}</h2>
      <p className="quiz__instruction">알맞은 뜻을 고르세요</p>
      <div className="quiz__options">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isAnswer = opt.id === current.id;
          const showResult = selectedId !== null;
          const className = [
            "quiz__option",
            showResult && isAnswer ? "quiz__option--correct" : "",
            showResult && isSelected && !isAnswer ? "quiz__option--wrong" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button key={opt.id} className={className} onClick={() => handleSelect(opt.id)}>
              {opt.meaning}
            </button>
          );
        })}
      </div>
      {selectedId && (
        <button className="primary quiz__next" onClick={handleNext}>
          다음 문제
        </button>
      )}
    </div>
  );
}

import { useState } from "react";
import type { NewWord, Word } from "../types";
import { WordForm } from "./WordForm";
import { MasteryDots } from "./MasteryDots";

interface WordListProps {
  words: Word[];
  onAdd: (word: NewWord) => void;
  onUpdate: (id: string, word: NewWord) => void;
  onDelete: (id: string) => void;
}

export function WordList({ words, onAdd, onUpdate, onDelete }: WordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="stage stage--list">
      <WordForm onSubmit={onAdd} />

      <div className="list-block">
        <div className="list-head">
          <h2>내 단어장</h2>
          <span>{words.length}개</span>
        </div>

        {words.length === 0 ? (
          <p className="notice">
            아직 등록된 단어가 없어요. 위에서 추가해보세요.
          </p>
        ) : (
          <ul className="list">
            {words.map((w) => (
              <li key={w.id} className="list__row">
                {editingId === w.id ? (
                  <WordForm
                    initial={{
                      term: w.term,
                      meaning: w.meaning,
                      example: w.example,
                    }}
                    submitLabel="저장"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(updated) => {
                      onUpdate(w.id, updated);
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <>
                    <div className="list__body">
                      <div className="list__title">
                        <span className="list__term">{w.term}</span>
                        <MasteryDots box={w.box} />
                      </div>
                      <div className="list__meaning">{w.meaning}</div>
                      {w.example && <p className="quote">{w.example}</p>}
                    </div>
                    <div className="list__actions">
                      <button
                        className="btn btn--quiet"
                        onClick={() => setEditingId(w.id)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn--quiet btn--quiet-danger"
                        onClick={() => onDelete(w.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

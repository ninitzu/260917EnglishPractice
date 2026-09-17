import { useState } from "react";
import type { NewWord, Word } from "../types";
import { WordForm } from "./WordForm";
import { MAX_BOX } from "../leitner";

interface WordListProps {
  words: Word[];
  onAdd: (word: NewWord) => void;
  onUpdate: (id: string, word: NewWord) => void;
  onDelete: (id: string) => void;
}

export function WordList({ words, onAdd, onUpdate, onDelete }: WordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="word-list">
      <h2>단어 추가</h2>
      <WordForm onSubmit={onAdd} />

      <h2>내 단어장 ({words.length})</h2>
      {words.length === 0 ? (
        <p className="empty-state">아직 등록된 단어가 없어요. 위에서 추가해보세요!</p>
      ) : (
        <ul className="word-list__items">
          {words.map((w) => (
            <li key={w.id} className="word-list__item">
              {editingId === w.id ? (
                <WordForm
                  initial={{ term: w.term, meaning: w.meaning, example: w.example }}
                  submitLabel="저장"
                  onCancel={() => setEditingId(null)}
                  onSubmit={(updated) => {
                    onUpdate(w.id, updated);
                    setEditingId(null);
                  }}
                />
              ) : (
                <>
                  <div className="word-list__info">
                    <div className="word-list__term">
                      {w.term}
                      <span className="badge" title="Leitner 박스 (숙련도)">
                        {w.box}/{MAX_BOX}
                      </span>
                    </div>
                    <div className="word-list__meaning">{w.meaning}</div>
                    {w.example && <div className="word-list__example">{w.example}</div>}
                  </div>
                  <div className="word-list__actions">
                    <button className="secondary" onClick={() => setEditingId(w.id)}>
                      수정
                    </button>
                    <button className="danger" onClick={() => onDelete(w.id)}>
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
  );
}

import { useState, type FormEvent } from "react";
import type { NewWord } from "../types";

interface WordFormProps {
  onSubmit: (word: NewWord) => void;
  initial?: NewWord;
  submitLabel?: string;
  onCancel?: () => void;
}

export function WordForm({ onSubmit, initial, submitLabel = "추가", onCancel }: WordFormProps) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [meaning, setMeaning] = useState(initial?.meaning ?? "");
  const [example, setExample] = useState(initial?.example ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !meaning.trim()) return;
    onSubmit({ term, meaning, example });
    if (!initial) {
      setTerm("");
      setMeaning("");
      setExample("");
    }
  };

  return (
    <form className="word-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="단어 (예: apple)"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="뜻 (예: 사과)"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="예문 (선택)"
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />
      <div className="word-form__actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </form>
  );
}

import { useState, type FormEvent } from "react";
import type { NewWord } from "../types";

interface WordFormProps {
  onSubmit: (word: NewWord) => void;
  initial?: NewWord;
  submitLabel?: string;
  onCancel?: () => void;
}

export function WordForm({
  onSubmit,
  initial,
  submitLabel = "단어 추가",
  onCancel,
}: WordFormProps) {
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
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__grid">
        <input
          type="text"
          placeholder="단어"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="뜻"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          required
        />
      </div>
      <input
        type="text"
        placeholder="예문 (선택)"
        value={example}
        onChange={(e) => setExample(e.target.value)}
      />
      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </form>
  );
}

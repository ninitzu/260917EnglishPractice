import { useState, type FormEvent } from "react";

interface ApiKeyFormProps {
  onSave: (key: string) => void;
  onCancel?: () => void;
}

export function ApiKeyForm({ onSave, onCancel }: ApiKeyFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSave(value);
    setValue("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form__label" htmlFor="gemini-key">
        Gemini API 키
      </label>
      <input
        id="gemini-key"
        type="password"
        autoComplete="off"
        spellCheck={false}
        placeholder="AIza..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <p className="form__note">
        키는 이 브라우저에만 저장되고, 요청은 브라우저에서 Google API로 직접
        전송됩니다. 키는 Google AI Studio에서 발급할 수 있습니다.
      </p>
      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          저장
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

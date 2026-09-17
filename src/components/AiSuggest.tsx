import { useMemo, useState } from "react";
import type { NewWord, Word } from "../types";
import { estimateLevel } from "../ai/level";
import { suggestWords, type Suggestion } from "../ai/gemini";
import { useApiKey } from "../hooks/useApiKey";
import { ApiKeyForm } from "./ApiKeyForm";

interface AiSuggestProps {
  words: Word[];
  onAdd: (word: NewWord) => void;
}

const SUGGEST_COUNT = 6;

export function AiSuggest({ words, onAdd }: AiSuggestProps) {
  const { apiKey, save, clear } = useApiKey();
  const [editingKey, setEditingKey] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [added, setAdded] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => estimateLevel(words), [words]);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const fresh = await suggestWords({
        apiKey,
        level: summary.level,
        known: words.map((w) => w.term),
        count: SUGGEST_COUNT,
      });
      // Drop words already in the list, and any term the model repeated.
      const seen = new Set(words.map((w) => w.term.toLowerCase()));
      setSuggestions(
        fresh.filter((s) => {
          const key = s.term.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }),
      );
      setAdded([]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  };

  const addSuggestion = (s: Suggestion) => {
    onAdd({ term: s.term, meaning: s.meaning, example: s.example });
    setAdded((prev) => [...prev, s.term]);
  };

  return (
    <section className="stage stage--list">
      <div className="level-card">
        <p className="level-card__eyebrow">예상 실력</p>
        <p className="level-card__level">{summary.level}</p>
        <p className="level-card__detail">
          {summary.hasData ? (
            <>
              정답률 {Math.round((summary.accuracy ?? 0) * 100)}% · 복습{" "}
              {summary.reviews}회 · 평균 숙련도 {summary.avgBox.toFixed(1)}
            </>
          ) : (
            <>학습 기록이 쌓이면 실력에 맞춰 난이도가 조정됩니다</>
          )}
        </p>
      </div>

      {!apiKey || editingKey ? (
        <ApiKeyForm
          onSave={(key) => {
            save(key);
            setEditingKey(false);
          }}
          onCancel={editingKey ? () => setEditingKey(false) : undefined}
        />
      ) : (
        <div className="key-row">
          <span>API 키가 저장되어 있어요</span>
          <div className="key-row__actions">
            <button
              className="btn btn--quiet"
              onClick={() => setEditingKey(true)}
            >
              변경
            </button>
            <button
              className="btn btn--quiet btn--quiet-danger"
              onClick={clear}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {apiKey && !editingKey && (
        <div className="stage__actions">
          <button
            className="btn btn--primary"
            onClick={generate}
            disabled={loading}
          >
            {loading ? "추천 중..." : `${summary.level} 수준 단어 추천받기`}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {suggestions.length > 0 && (
        <div className="list-block">
          <div className="list-head">
            <h2>추천 단어</h2>
            <span>{summary.level} 수준</span>
          </div>
          <ul className="list">
            {suggestions.map((s) => {
              const isAdded = added.includes(s.term);
              return (
                <li key={s.term} className="list__row">
                  <div className="list__body">
                    <div className="list__title">
                      <span className="list__term">{s.term}</span>
                    </div>
                    <div className="list__meaning">{s.meaning}</div>
                    {s.example && <p className="quote">{s.example}</p>}
                  </div>
                  <div className="list__actions">
                    {isAdded ? (
                      <span className="added-tag">추가됨</span>
                    ) : (
                      <button
                        className="btn btn--quiet"
                        onClick={() => addSuggestion(s)}
                      >
                        단어장에 추가
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

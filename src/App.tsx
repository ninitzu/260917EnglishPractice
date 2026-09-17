import { useMemo, useState } from "react";
import "./App.css";
import { useWords } from "./hooks/useWords";
import { WordList } from "./components/WordList";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { Backdrop } from "./components/Backdrop";
import { isDue, MAX_BOX } from "./leitner";

type Tab = "flashcards" | "quiz" | "words";

const TABS: { id: Tab; label: string }[] = [
  { id: "flashcards", label: "플래시카드" },
  { id: "quiz", label: "퀴즈" },
  { id: "words", label: "단어장" },
];

function App() {
  const { words, addWord, updateWord, deleteWord, reviewWord } = useWords();
  const [tab, setTab] = useState<Tab>("flashcards");

  const stats = useMemo(() => {
    const due = words.filter((w) => isDue(w)).length;
    const mastered = words.filter((w) => w.box >= MAX_BOX).length;
    return { total: words.length, due, mastered };
  }, [words]);

  return (
    <div className="app">
      <Backdrop />

      <header className="topbar">
        <span className="wordmark">
          English <em>Practice</em>
        </span>
        <nav className="topbar__nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "is-active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="app__main">
        <p className="meta-pill">
          <span className="meta-pill__dot" />
          단어 {stats.total} · 복습 대기 {stats.due} · 암기 완료{" "}
          {stats.mastered}
        </p>

        {tab === "flashcards" && (
          <Flashcards words={words} onReview={reviewWord} />
        )}
        {tab === "quiz" && (
          <Quiz key={words.length} words={words} onReview={reviewWord} />
        )}
        {tab === "words" && (
          <WordList
            words={words}
            onAdd={addWord}
            onUpdate={updateWord}
            onDelete={deleteWord}
          />
        )}
      </main>
    </div>
  );
}

export default App;

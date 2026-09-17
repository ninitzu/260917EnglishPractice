import { useMemo, useState } from "react";
import "./App.css";
import { useWords } from "./hooks/useWords";
import { WordList } from "./components/WordList";
import { Flashcards } from "./components/Flashcards";
import { Quiz } from "./components/Quiz";
import { isDue, MAX_BOX } from "./leitner";

type Tab = "flashcards" | "quiz" | "words";

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
      <header className="app__header">
        <h1>English Practice</h1>
        <div className="app__stats">
          <span>전체 {stats.total}</span>
          <span>오늘 복습 {stats.due}</span>
          <span>완전 암기 {stats.mastered}</span>
        </div>
      </header>

      <nav className="app__nav">
        <button className={tab === "flashcards" ? "active" : ""} onClick={() => setTab("flashcards")}>
          플래시카드
        </button>
        <button className={tab === "quiz" ? "active" : ""} onClick={() => setTab("quiz")}>
          퀴즈
        </button>
        <button className={tab === "words" ? "active" : ""} onClick={() => setTab("words")}>
          단어장
        </button>
      </nav>

      <main className="app__main">
        {tab === "flashcards" && <Flashcards words={words} onReview={reviewWord} />}
        {tab === "quiz" && (
          <Quiz key={words.length} words={words} onReview={reviewWord} />
        )}
        {tab === "words" && (
          <WordList words={words} onAdd={addWord} onUpdate={updateWord} onDelete={deleteWord} />
        )}
      </main>
    </div>
  );
}

export default App;

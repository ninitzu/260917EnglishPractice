import type { LevelSummary } from "./level";

export const GEMINI_MODEL = "gemini-3.1-flash-lite";

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/** Keeps the prompt bounded when the word list grows large. */
const MAX_KNOWN_TERMS = 120;

export interface Suggestion {
  term: string;
  meaning: string;
  example: string;
}

function buildPrompt(
  level: LevelSummary["level"],
  known: string[],
  count: number,
) {
  const knownList = known.slice(0, MAX_KNOWN_TERMS).join(", ") || "(없음)";
  return [
    "한국인 영어 학습자에게 새로 외울 영어 단어를 추천해주세요.",
    "",
    `학습자 수준: CEFR ${level}`,
    `이미 학습 중인 단어: ${knownList}`,
    "",
    "조건:",
    `- ${level} 수준에 맞는 난이도의 영어 단어 ${count}개를 고르세요.`,
    "- 이미 학습 중인 단어와 그 단어의 활용형은 제외하세요.",
    "- term: 영어 단어 하나 (소문자, 기본형)",
    "- meaning: 한국어 뜻 (쉼표로 구분, 간결하게)",
    `- example: 그 단어를 쓴 영어 예문 한 문장 (${level} 수준으로 쉽게)`,
  ].join("\n");
}

const RESPONSE_SCHEMA = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      term: { type: "STRING" },
      meaning: { type: "STRING" },
      example: { type: "STRING" },
    },
    required: ["term", "meaning", "example"],
  },
};

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const message = body?.error?.message;
    if (typeof message === "string" && message) return message;
  } catch {
    // fall through to the status line
  }
  return `요청이 실패했습니다 (HTTP ${res.status})`;
}

function parseSuggestions(raw: unknown): Suggestion[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const { term, meaning, example } = item as Record<string, unknown>;
    if (typeof term !== "string" || typeof meaning !== "string") return [];
    if (!term.trim() || !meaning.trim()) return [];
    return [
      {
        term: term.trim(),
        meaning: meaning.trim(),
        example: typeof example === "string" ? example.trim() : "",
      },
    ];
  });
}

export async function suggestWords(opts: {
  apiKey: string;
  level: LevelSummary["level"];
  known: string[];
  count: number;
}): Promise<Suggestion[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": opts.apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: buildPrompt(opts.level, opts.known, opts.count) }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 1.1,
      },
    }),
  });

  if (!res.ok) throw new Error(await readError(res));

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("모델이 단어를 반환하지 않았습니다. 다시 시도해주세요.");
  }

  let parsed: Suggestion[];
  try {
    parsed = parseSuggestions(JSON.parse(text));
  } catch {
    throw new Error("모델 응답을 해석할 수 없습니다. 다시 시도해주세요.");
  }

  if (parsed.length === 0) {
    throw new Error("추천할 단어를 받지 못했습니다. 다시 시도해주세요.");
  }
  return parsed;
}

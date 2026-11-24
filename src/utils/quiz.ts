export const MINIMUM_QUIZ_QUESTIONS = 20;

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
};

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (
    typeof value !== "object" ||
    value === null ||
    !("q" in value) ||
    !("options" in value) ||
    !("answer" in value) ||
    !("explanation" in value)
  ) {
    return false;
  }
  const { q, options, answer, explanation } = value;
  return (
    typeof q === "string" &&
    q.trim().length > 0 &&
    Array.isArray(options) &&
    options.length === 4 &&
    options.every((option) => typeof option === "string" && option.trim().length > 0) &&
    typeof answer === "number" &&
    Number.isInteger(answer) &&
    answer >= 0 &&
    answer < options.length &&
    typeof explanation === "string" &&
    explanation.trim().length > 0
  );
}

export function parseQuizQuestions(value: unknown): QuizQuestion[] | null {
  if (!Array.isArray(value)) return null;

  const uniqueQuestions = new Map<string, QuizQuestion>();
  for (const item of value) {
    if (!isQuizQuestion(item)) return null;
    const key = item.q.trim().toLowerCase();
    if (!uniqueQuestions.has(key)) uniqueQuestions.set(key, item);
  }

  const questions = Array.from(uniqueQuestions.values());
  return questions.length >= MINIMUM_QUIZ_QUESTIONS
    ? questions.slice(0, MINIMUM_QUIZ_QUESTIONS)
    : null;
}

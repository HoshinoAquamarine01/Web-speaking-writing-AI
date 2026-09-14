import type { Question } from '../types';

export function getSubQuestions(question: Question): string[] {
  if (question.subQuestions && question.subQuestions.length > 0) {
    return question.subQuestions;
  }

  const prompt = question.prompt || '';
  const lines = prompt.split('\n').map((l) => l.trim()).filter(Boolean);

  // Match numbered lines like "1. ...", "2. ...", "3. ..." or "Question 1: ...", "Question 2: ..."
  const subQPattern = /^(?:\d+[\.\)]|Question\s+\d+:?)\s*(.+)/i;
  const matches: string[] = [];

  for (const line of lines) {
    const match = line.match(subQPattern);
    if (match) {
      matches.push(line);
    }
  }

  if (matches.length >= 2) {
    return matches;
  }

  // Fallback: single main question
  return [prompt];
}

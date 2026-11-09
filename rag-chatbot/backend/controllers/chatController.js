import { answerQuestion } from "../services/ragService.js";

const MAX_QUESTION_LENGTH = 1000;

export async function chat(req, res, next) {
  try {
    const { question, history } = req.body ?? {};

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ success: false, message: "A non-empty 'question' string is required." });
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return res
        .status(400)
        .json({ success: false, message: `Question is too long (max ${MAX_QUESTION_LENGTH} characters).` });
    }

    // history is optional: [{ role: "user" | "assistant", content: "..." }]
    const cleanHistory = Array.isArray(history)
      ? history
          .filter((m) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
          .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      : [];

    const { answer, sources } = await answerQuestion(question.trim(), cleanHistory);
    return res.json({ success: true, answer, sources });
  } catch (error) {
    next(error);
  }
}

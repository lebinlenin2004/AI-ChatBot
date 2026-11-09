import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = () => {
    const question = text.trim();
    if (!question || disabled) return;
    onSend(question);
    setText("");
  };

  // Enter sends, Shift+Enter adds a new line.
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
        <textarea
          rows={1}
          value={text}
          maxLength={1000}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your documents..."
          className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] outline-none"
        />
        <button
          onClick={submit}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}

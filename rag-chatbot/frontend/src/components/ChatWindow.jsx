import { useEffect, useRef } from "react";
import { FiCpu } from "react-icons/fi";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatWindow({ messages, loading, onSend, hasDocuments }) {
  const bottomRef = useRef(null);

  // Scroll to the newest message whenever messages change or loading starts.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
          {messages.length === 0 && (
            <div className="mt-24 text-center text-slate-500">
              <h2 className="text-xl font-semibold text-slate-800">
                {hasDocuments ? "Ask anything about your documents" : "Upload a PDF to get started"}
              </h2>
              <p className="mt-2 text-sm">
                {hasDocuments
                  ? "Answers come only from the PDFs you uploaded, with page references."
                  : "Use the sidebar to add a PDF, then ask questions about it here."}
              </p>
            </div>
          )}

          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                <FiCpu />
              </div>
              <div className="flex gap-1 rounded-2xl bg-slate-100 px-4 py-3" aria-label="Thinking">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}

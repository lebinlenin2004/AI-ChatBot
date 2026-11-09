import { FiUser, FiCpu, FiFileText } from "react-icons/fi";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-slate-700 text-white" : "bg-emerald-600 text-white"
        }`}
      >
        {isUser ? <FiUser /> : <FiCpu />}
      </div>

      <div className={`max-w-[85%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-left text-[15px] leading-relaxed ${
            isUser
              ? "bg-slate-700 text-white"
              : message.isError
                ? "border border-red-200 bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-800"
          }`}
        >
          {message.content}
        </div>

        {message.sources?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources.map((s) => (
              <span
                key={`${s.documentName}-${s.pageNumber}`}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-600"
              >
                <FiFileText className="text-slate-400" />
                {s.documentName}, p. {s.pageNumber}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

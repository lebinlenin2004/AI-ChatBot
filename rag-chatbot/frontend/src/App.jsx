import { useCallback, useEffect, useState } from "react";
import { FiFileText, FiMenu, FiX } from "react-icons/fi";
import ChatWindow from "./components/ChatWindow.jsx";
import UploadDocument from "./components/UploadDocument.jsx";
import { fetchDocuments, sendQuestion, getErrorMessage } from "./services/api.js";

let nextId = 1;
const newId = () => nextId++;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadDocuments = useCallback(async () => {
    try {
      setDocuments(await fetchDocuments());
    } catch {
      /* the sidebar list is optional; chat errors are shown elsewhere */
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleSend = async (question) => {
    // Last few turns give the model context for follow-ups like "tell me more".
    const history = messages.filter((m) => !m.isError).map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { id: newId(), role: "user", content: question }]);
    setLoading(true);

    try {
      const data = await sendQuestion(question, history);
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", content: getErrorMessage(error), isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-white text-slate-900">
      {/* Sidebar: title + documents. Slides in on small screens. */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-72 flex-col gap-6 bg-slate-900 p-4 text-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Document Chat</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <FiX />
          </button>
        </div>

        <UploadDocument onUploaded={loadDocuments} />

        <div className="min-h-0 flex-1 overflow-y-auto">
          <h2 className="mb-2 text-sm font-medium text-slate-300">Knowledge base</h2>
          {documents.length === 0 ? (
            <p className="text-xs text-slate-500">No documents yet.</p>
          ) : (
            <ul className="space-y-1.5">
              {documents.map((d) => (
                <li key={d.id} className="flex items-start gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm">
                  <FiFileText className="mt-0.5 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="truncate">{d.name}</p>
                    <p className="text-xs text-slate-400">
                      {d.pageCount} pages, {d.chunkCount} chunks
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-10 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <FiMenu />
          </button>
          <span className="font-medium">Document Chat</span>
        </header>
        <div className="min-h-0 flex-1">
          <ChatWindow
            messages={messages}
            loading={loading}
            onSend={handleSend}
            hasDocuments={documents.length > 0}
          />
        </div>
      </main>
    </div>
  );
}

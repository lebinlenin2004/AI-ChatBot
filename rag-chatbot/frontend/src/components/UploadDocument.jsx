import { useRef, useState } from "react";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";
import { uploadDocument, getErrorMessage } from "../services/api.js";

export default function UploadDocument({ onUploaded }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow selecting the same file again later
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus("error");
      setMessage("Please choose a PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setMessage("File is larger than 10 MB.");
      return;
    }

    setFileName(file.name);
    setStatus("processing");
    setMessage("Reading, chunking and embedding your PDF...");

    try {
      const result = await uploadDocument(file);
      setStatus("success");
      setMessage(result.message);
      onUploaded();
    } catch (error) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  };

  const busy = status === "processing";

  return (
    <div>
      <input ref={inputRef} type="file" accept="application/pdf" onChange={handleChange} className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? <FiLoader className="animate-spin" /> : <FiUploadCloud />}
        {busy ? "Processing..." : "Upload PDF"}
      </button>

      {fileName && <p className="mt-2 truncate text-xs text-slate-400">Selected: {fileName}</p>}

      {status !== "idle" && (
        <p
          className={`mt-2 flex items-start gap-1.5 text-xs ${
            status === "success" ? "text-emerald-400" : status === "error" ? "text-red-400" : "text-slate-300"
          }`}
        >
          {status === "success" && <FiCheckCircle className="mt-0.5 shrink-0" />}
          {status === "error" && <FiAlertCircle className="mt-0.5 shrink-0" />}
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}

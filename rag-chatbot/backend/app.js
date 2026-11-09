import express from "express";
import cors from "cors";
import documentRoutes from "./routes/documentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));

// Central error handler: log details on the server, send a safe message to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌", err);
  const status = err.statusCode || err.status || 500;
  let message = status < 500 ? err.message : "Something went wrong on the server.";
  if (err.status === 401 || /incorrect api key/i.test(err.message || "")) {
    message = "OpenAI rejected the API key. Check OPENAI_API_KEY in backend/.env.";
  } else if (err.status === 429) {
    message = "OpenAI rate limit or quota reached. Check your OpenAI billing/usage.";
  }
  res.status(status >= 400 && status < 600 ? status : 500).json({ success: false, message });
});

export default app;

import "dotenv/config";
import app from "./app.js";
import { connectDatabase, ensureSetup, closeDatabase } from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing. Copy .env.example to .env and fill it in.");
  }
  await connectDatabase();
  await ensureSetup();

  const server = app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));

  const shutdown = async () => {
    server.close();
    await closeDatabase();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});

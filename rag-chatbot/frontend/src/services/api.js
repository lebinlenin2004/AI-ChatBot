// All HTTP calls live here. The browser only talks to our backend,
// never to OpenAI or MongoDB, so no secrets exist in the frontend.
import axios from "axios";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });

// Turn any axios error into a short, readable message.
export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ERR_NETWORK") return "Cannot reach the server. Is the backend running on port 5000?";
  return "Something went wrong. Please try again.";
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file); // field name must match upload.single("file")
  const { data } = await client.post("/documents/upload", formData, { timeout: 120000 });
  return data;
}

export async function fetchDocuments() {
  const { data } = await client.get("/documents");
  return data.documents;
}

export async function sendQuestion(question, history) {
  const { data } = await client.post("/chat", { question, history }, { timeout: 60000 });
  return data;
}

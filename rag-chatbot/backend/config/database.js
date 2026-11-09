// MongoDB connection + collection helpers.
// We use the official `mongodb` driver (LangChain's vector store needs a raw Collection).
import { MongoClient } from "mongodb";

export const DB_NAME = "rag_chatbot";
export const CHUNKS_COLLECTION = "document_chunks"; // text chunks + embeddings
export const DOCUMENTS_COLLECTION = "documents"; // one record per uploaded PDF

// Must match the embedding model: text-embedding-3-small returns 1536 numbers.
export const EMBEDDING_DIMENSIONS = 1536;

let client = null;

export async function connectDatabase() {
  if (client) return client;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Copy .env.example to .env and fill it in.");
  }
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas");
  return client;
}

function getDb() {
  if (!client) throw new Error("Database not connected. Call connectDatabase() first.");
  return client.db(DB_NAME);
}

export const getChunksCollection = () => getDb().collection(CHUNKS_COLLECTION);
export const getDocumentsCollection = () => getDb().collection(DOCUMENTS_COLLECTION);

export async function closeDatabase() {
  if (client) await client.close();
  client = null;
}

// Convenience: create the collections, a unique index (blocks duplicate PDFs)
// and the Atlas Vector Search index if they do not exist yet.
// If this fails (e.g. free-tier limits), create the index manually - see README.
export async function ensureSetup() {
  const db = getDb();
  const existing = (await db.listCollections().toArray()).map((c) => c.name);
  for (const name of [CHUNKS_COLLECTION, DOCUMENTS_COLLECTION]) {
    if (!existing.includes(name)) await db.createCollection(name);
  }

  await getDocumentsCollection().createIndex({ fileHash: 1 }, { unique: true });
  await getChunksCollection().createIndex({ documentId: 1 });

  const indexName = process.env.VECTOR_INDEX_NAME || "vector_index";
  try {
    const indexes = await getChunksCollection().listSearchIndexes().toArray();
    if (indexes.some((i) => i.name === indexName)) return;

    await getChunksCollection().createSearchIndex({
      name: indexName,
      type: "vectorSearch",
      definition: {
        fields: [
          { type: "vector", path: "embedding", numDimensions: EMBEDDING_DIMENSIONS, similarity: "cosine" },
        ],
      },
    });
    console.log(`✅ Created vector search index "${indexName}" (it may take ~1 minute to become active)`);
  } catch (err) {
    console.warn(`⚠️  Could not auto-create the vector index: ${err.message}`);
    console.warn("   Create it manually in the Atlas UI (see README, section 7).");
  }
}

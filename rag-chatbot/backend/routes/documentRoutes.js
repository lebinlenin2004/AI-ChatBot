import { Router } from "express";
import { uploadPdf } from "../middleware/uploadMiddleware.js";
import { uploadDocument, getDocuments } from "../controllers/documentController.js";

const router = Router();
router.post("/upload", uploadPdf, uploadDocument); // POST /api/documents/upload
router.get("/", getDocuments); // GET  /api/documents
export default router;

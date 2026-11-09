import { ingestPdf, listDocuments } from "../services/documentService.js";

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF uploaded. Send it in the 'file' field." });
    }
    const { document, duplicate } = await ingestPdf({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
    });
    return res.status(duplicate ? 200 : 201).json({
      success: true,
      duplicate,
      message: duplicate ? "This document was already uploaded." : "Document processed successfully.",
      document: {
        id: document._id,
        name: document.name,
        status: document.status,
        pageCount: document.pageCount,
        chunkCount: document.chunkCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocuments(req, res, next) {
  try {
    const docs = await listDocuments();
    res.json({
      success: true,
      documents: docs.map((d) => ({
        id: d._id,
        name: d.name,
        pageCount: d.pageCount,
        chunkCount: d.chunkCount,
      })),
    });
  } catch (error) {
    next(error);
  }
}

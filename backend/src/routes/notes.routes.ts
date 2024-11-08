import express from "express";
import {
  createNote,
  deleteNote,
  editNote,
  getNote,
  getNotes,
  searchNote,
} from "../controllers/notes.controller";
import { authenticateToken } from "../utils";

const router = express.Router();

router.get("/", authenticateToken, getNotes);
router.get("/:noteId", authenticateToken, getNote);
router.post("/", authenticateToken, createNote);
router.patch("/:noteId", authenticateToken, editNote);
router.get("/search/note", authenticateToken, searchNote);
// router.patch("/:noteId", authenticateToken, pinNote);
router.delete("/:noteId", authenticateToken, deleteNote);

export default router;

import express from "express";
import Note from "../models/note.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Note
router.post("/create", authMiddleware, async (req, res) => {
  const { title, content, audioUrl } = req.body;
  try {
    const note = new Note({ user: req.user.id, title, content, audioUrl });
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Notes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

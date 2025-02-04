import express from "express";
import Note from "../models/note.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// Create Note
router.post("/create", authMiddleware, async (req, res) => {
  const { title, content, audioUrl, isFavorite } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    
    const note = new Note({
      user: userId,
      title,
      content,
      audioUrl,
      isFavorite: isFavorite || false
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Notes
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const notes = await Note.find({ user: userId })
      .select('title content audioUrl isFavorite createdAt updatedAt user')
      .sort({ createdAt: -1 });
    
    if (!notes.length) {
      return res.status(404).json({ message: "No notes found" });
    }

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Favorite Notes
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const notes = await Note.find({ 
      user: userId,
      isFavorite: true 
    })
      .select('title content audioUrl isFavorite createdAt updatedAt user')
      .sort({ createdAt: -1 });
    
    if (!notes.length) {
      return res.status(404).json({ message: "No favorite notes found" });
    }

    res.json(notes);
  } catch (error) {
    console.error("Error fetching favorite notes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Note
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, isFavorite } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this note" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { 
        title, 
        content, 
        isFavorite,
        updatedAt: new Date()
      },
      { 
        new: true,
        timestamps: true
      }
    );

    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle Favorite Status
router.patch("/:id/toggle-favorite", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this note" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { isFavorite: !note.isFavorite },
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
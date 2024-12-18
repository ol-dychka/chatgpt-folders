import express from "express";
const router = express.Router();
import { chatSchema } from "../models/Data.js";

// create
router.post("/chats/create", async (req, res) => {
  const { name, href, folderId } = req.body;

  if (!name || !href || !folderId) {
    return res.status(400).json({ error: "params are required" });
  }

  try {
    const newChat = new chatSchema({ name, href, folderId });
    await newChat.save();
    res
      .status(200)
      .json({ message: "Data saved successfully", data: newFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update
router.post("/chat/:id", async (req, res) => {
  const { id } = req.params;
  const { name, folderId } = req.body;

  if (!name || !folderId) {
    return res.status(400).json({ error: "params are required" });
  }

  try {
    const oldChat = chatSchema.findById(id);
    oldChat.name = name;
    oldChat.folderId = folderId;
    await oldChat.save();
    res
      .status(200)
      .json({ message: "Data saved successfully", data: newFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete chat by id
router.delete("/chat/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await chatSchema.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get all chats from folder
router.get("/chats", async (req, res) => {
  const { folderId } = req.body;
  try {
    const data = await chatSchema.find({ folderId: folderId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

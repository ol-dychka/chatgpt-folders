import express from "express";
const router = express.Router();
import { folderSchema } from "../models/Data.js";

// create folder
router.post("/folders/create", async (req, res) => {
  const { name, color, open } = req.body;

  if (!name || !color) {
    return res.status(400).json({ error: "Name and color are required" });
  }

  try {
    const newFolder = new folderSchema({ name, color, open });
    await newFolder.save();
    res
      .status(200)
      .json({ message: "Data saved successfully", data: newFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update folder
router.post("/folder/:id", async (req, res) => {
  const { id } = req.params;
  const { name, color, open } = req.body;

  if (!name || !color) {
    return res.status(400).json({ error: "Name and color are required" });
  }

  try {
    const oldFolder = await folderSchema.findById(id);
    oldFolder.name = name;
    oldFolder.color = color;
    oldFolder.open = open;
    await oldFolder.save();
    res
      .status(200)
      .json({ message: "Data saved successfully", data: oldFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get folder by id
router.get("/folder/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await folderSchema.findById(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete folder by id
router.delete("/folder/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await folderSchema.findByIdAndDelete(id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get all folders
router.get("/folders", async (req, res) => {
  try {
    const data = await folderSchema.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import express from "express";
const folderRouter = express.Router();
import { folderModel } from "../schemas/Folder.js";
import { userModel } from "../schemas/User.js";
import mongoose from "mongoose";

// create folder
folderRouter.post("/create", async (req, res) => {
  const { name, color, isOpen } = req.body;
  const userId = req.headers["user-id"];

  if (!name || !color) {
    return res.status(400).json({ error: "Name and color are required" });
  }

  // saving to folders collection
  try {
    const newFolder = new folderModel({
      mimeType: "folder",
      name,
      color,
      isOpen,
      userId,
    });
    await newFolder.save();

    // saving to users folders
    let user = await userModel.findById(userId);
    user.folders.push(newFolder._id);
    await user.save();

    res
      .status(200)
      .json({ message: "Data saved successfully", data: newFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// update folder
folderRouter.post("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { name, color, isOpen } = req.body;

  if (!name && !color && isOpen === undefined) {
    return res.status(400).json({ error: "a change is required" });
  }

  try {
    const folder = await folderModel.findById(id);
    if (name) folder.name = name;
    if (color) folder.color = color;
    if (isOpen !== undefined) folder.isOpen = isOpen;
    await folder.save();
    res.status(200).json({ message: "Data saved successfully", data: folder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//move folder
folderRouter.post("/:id/move", async (req, res) => {
  const { id } = req.params;
  const { destinationFolderId } = req.body;
  const userId = req.headers["user-id"];

  try {
    const user = await userModel.findById(userId);
    const index = user.folders.findIndex(
      (folderId) => folderId.toString() === id
    );
    const folder = user.folders.splice(index, 1)[0];
    console.log(folder);

    const destinationIndex = destinationFolderId
      ? user.folders.findIndex(
          (folderId) => folderId.toString() === destinationFolderId
        )
      : user.folders.length;

    user.folders.splice(destinationIndex, 0, folder);
    await user.save();

    res.status(200).json({ message: "Data saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get folder by id
folderRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const folder = await folderModel.findById(id);
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete folder by id
folderRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.headers["user-id"];
  try {
    // removing folder
    const folder = await folderModel.findByIdAndDelete(id);

    //updating users folders
    const user = await userModel.findById(userId);
    user.folders = user.folders.filter(
      (folderId) => folderId.toString() !== id
    );
    await user.save();

    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get all folders
folderRouter.get("/", async (req, res) => {
  try {
    const userId = req.headers["user-id"];

    const user = await userModel.findById(userId).populate("folders").exec();
    res.status(200).json(user.folders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default folderRouter;

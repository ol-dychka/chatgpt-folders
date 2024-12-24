import express from "express";
const folderRouter = express.Router();
import { folderModel } from "../schemas/Folder.js";
import { userModel } from "../schemas/User.js";

// create folder
folderRouter.post("/create", async (req, res) => {
  const { mime_type, folder_name, folder_color, is_open, user_id } = req.body;

  if (!folder_name || !folder_color) {
    return res.status(400).json({ error: "Name and color are required" });
  }

  // saving to folders collection
  try {
    const newFolder = new folderModel({
      mime_type,
      folder_name,
      folder_color,
      is_open,
      user_id,
    });
    await newFolder.save();

    // saving to users folders
    let user = await userModel.findById(user_id);
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
  const { folder_name, folder_color, is_open } = req.body;

  if (!folder_name || !folder_color) {
    return res.status(400).json({ error: "Name and color are required" });
  }

  try {
    const folder = await folderModel.findById(id);
    folder.folder_name = folder_name;
    folder.folder_color = folder_color;
    folder.is_open = is_open;
    await folder.save();
    res.status(200).json({ message: "Data saved successfully", data: folder });
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
  const { user_id } = req.body;
  try {
    // removing folder
    const folder = await folderModel.findByIdAndDelete(id);

    //updating users folders
    const user = await userModel.findById(user_id);
    user.folders = user.folders.filter((folderId) => folderId !== id);
    await user.save();

    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get all folders
folderRouter.get("/", async (req, res) => {
  try {
    const { user_id } = req.body;

    const user = await userModel.findById(user_id).populate("Folder").exec();
    res.status(200).json(user.folders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default folderRouter;

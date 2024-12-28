import express from "express";
const conversationRouter = express.Router();
import { conversationModel } from "../schemas/Conversation.js";
import { folderModel } from "../schemas/Folder.js";

// create
conversationRouter.post("/create", async (req, res) => {
  console.log(req.body);
  const { name, conversationId, folderId } = req.body;

  if (!name || !conversationId || !folderId) {
    return res.status(400).json({ error: "params are required" });
  }

  try {
    const conversation = new conversationModel({
      mimeType: "conversation",
      name,
      conversationId,
    });
    const folder = await folderModel.findById(folderId);
    folder.conversations.push(conversation);
    await folder.save();

    res.status(200).json({ message: "Data saved successfully", data: folder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// change folder
conversationRouter.post("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { oldFolderId, newFolderId } = req.body;

  if (!oldFolderId || !newFolderId)
    return res.status(400).json({ error: "params are required" });

  if (oldFolderId === newFolderId)
    return res.status(400).json({ error: "ids should be different" });

  try {
    const oldFolder = await folderModel.findById(oldFolderId);
    const newFolder = await folderModel.findById(newFolderId);

    const targetIndex = oldFolder.conversations.findIndex(
      (conversation) => conversation.conversationId === conversationId
    );
    const conversation = oldFolder.splice(targetIndex, 1)[0];
    await oldFolder.save();

    newFolder.conversations.push(conversation);
    await newFolder.save();

    res
      .status(200)
      .json({ message: "Data saved successfully", data: newFolder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete chat by id
conversationRouter.delete("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { folderId } = req.body;
  try {
    const folder = await folderModel.findById(folderId);
    folder.conversations = folder.conversations.filter(
      (conversation) => conversation.conversationId !== conversationId
    );
    await folder.save();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default conversationRouter;

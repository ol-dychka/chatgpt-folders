import express from "express";
const conversationRouter = express.Router();
import { conversationModel } from "../schemas/Conversation.js";
import { folderModel } from "../schemas/Folder.js";

// create
conversationRouter.post("/create", async (req, res) => {
  const { conversation_name, conversation_id, folder_id } = req.body;

  if (!conversation_name || !conversation_id || !folder_id) {
    return res.status(400).json({ error: "params are required" });
  }

  try {
    const conversation = new conversationModel({
      mime_type: "conversation",
      conversation_name,
      conversation_id,
    });
    const folder = folderModel.findById(folder_id);
    folder.conversations.push(conversation);
    await folder.save();

    res.status(200).json({ message: "Data saved successfully", data: folder });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// change folder
conversationRouter.post("/:conversation_id", async (req, res) => {
  const { conversation_id } = req.params;
  const { old_folder_id, new_folder_id } = req.body;

  if (!old_folder_id || !new_folder_id)
    return res.status(400).json({ error: "params are required" });

  if (old_folder_id === new_folder_id)
    return res.status(400).json({ error: "ids should be different" });

  try {
    const oldFolder = await folderModel.findById(old_folder_id);
    const newFolder = await folderModel.findById(new_folder_id);

    const targetIndex = oldFolder.conversations.findIndex(
      (conversation) => conversation.conversation_id === conversation_id
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
conversationRouter.delete("/:conversation_id", async (req, res) => {
  const { conversation_id } = req.params;
  const { folder_id } = req.body;
  try {
    const folder = await folderModel.findById(folder_id);
    folder.conversations = folder.conversations.filter(
      (conversation) => conversation.conversation_id !== conversation_id
    );
    await folder.save();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// get all chats from folder
conversationRouter.get("/", async (req, res) => {
  const { folder_id } = req.body;
  try {
    const folder = await folderModel.findById(folder_id);
    res.status(200).json(folder.conversations);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default conversationRouter;

import express from "express";
import { conversationModel } from "../schemas/Conversation.js";
import { folderModel } from "../schemas/Folder.js";

const conversationRouter = express.Router();

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
conversationRouter.post("/:draggedConversationId", async (req, res) => {
  const { draggedConversationId } = req.params;
  const { sourceFolderId, destinationFolderId, destinationConversationId } =
    req.body;

  if (!sourceFolderId)
    return res.status(400).json({ error: "params are required" });

  try {
    if (sourceFolderId === destinationFolderId) {
      const folder = await folderModel.findById(sourceFolderId);

      // removing from folder
      const draggedIndex = folder.conversations.findIndex(
        (conversation) => conversation.conversationId === draggedConversationId
      );
      const draggedConversation = folder.conversations.splice(
        draggedIndex,
        1
      )[0];

      // adding to folder
      const destinationIndex = destinationConversationId
        ? folder.conversations.findIndex(
            (conversation) =>
              conversation.conversationId === destinationConversationId
          )
        : folder.conversations.length;
      folder.conversations.splice(destinationIndex, 0, draggedConversation);

      await folder.save();
    } else {
      // removing from source folder
      const sourceFolder = await folderModel.findById(sourceFolderId);
      const draggedIndex = sourceFolder.conversations.findIndex(
        (conversation) => conversation.conversationId === draggedConversationId
      );
      const draggedConversation = sourceFolder.conversations.splice(
        draggedIndex,
        1
      )[0];
      await sourceFolder.save();

      // adding to destination folder
      const destinationFolder = await folderModel.findById(destinationFolderId);
      const destinationIndex = destinationConversationId
        ? destinationFolder.conversations.findIndex(
            (conversation) =>
              conversation.conversationId === destinationConversationId
          )
        : destinationFolder.conversations.length;
      destinationFolder.conversations.splice(
        destinationIndex,
        0,
        draggedConversation
      );
      await destinationFolder.save();
    }
    res.status(200).json({ message: "Data saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// delete conversation by id
conversationRouter.delete("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  console.log(req.body);
  const { folderId } = req.body;
  try {
    const folder = await folderModel.findById(folderId);
    folder.conversations = folder.conversations.filter(
      (conversation) => conversation.conversationId !== conversationId
    );
    await folder.save();

    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default conversationRouter;

import mongoose from "mongoose";
import { conversationSchema } from "./Conversation.js";

const folderSchema = new mongoose.Schema(
  {
    mimeType: { type: String, required: true, immutable: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    isOpen: { type: Boolean, required: true },
    conversations: { type: [conversationSchema], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true }
);

const folderModel = mongoose.model("Folder", folderSchema);

export { folderModel, folderSchema };

import mongoose from "mongoose";
import { conversationSchema } from "./Conversation.js";

const folderSchema = new mongoose.Schema(
  {
    mime_type: { type: String, required: true, immutable: true },
    folder_name: { type: String, required: true },
    folder_color: { type: String, required: true },
    is_open: { type: Boolean, required: true },
    conversations: { type: [conversationSchema], required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  { timestamps: true }
);

const folderModel = mongoose.model("Folder", folderSchema);

export { folderModel, folderSchema };

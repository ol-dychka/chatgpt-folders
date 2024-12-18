import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: String,
    color: String,
    open: Boolean,
  },
  { timestamps: true }
);

const ChatSchema = new mongoose.Schema(
  {
    href: String,
    name: String,
    folderId: String,
  },
  { timestamps: true }
);

const folderSchema = mongoose.model("Folder", FolderSchema);
const chatSchema = mongoose.model("Chat", ChatSchema);

export { folderSchema, chatSchema };

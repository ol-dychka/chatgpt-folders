import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    mimeType: { type: String, required: true, immutable: true },
    conversationId: { type: String, required: true, immutable: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

export { conversationModel, conversationSchema };

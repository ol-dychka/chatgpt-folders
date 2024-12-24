import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    mime_type: { type: String, required: true, immutable: true },
    conversation_id: { type: String, required: true, immutable: true },
    conversation_name: { type: String, required: true },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model("Conversation", conversationSchema);

export { conversationModel, conversationSchema };

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    mimeType: { type: String, required: true, immutable: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      immutable: true,
    },
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export { userModel };

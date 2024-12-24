import mongoose from "mongoose";
import { folderSchema } from "./Folder.js";

const userSchema = mongoose.Schema(
  {
    mime_type: { type: String, required: true, immutable: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      immutable: true,
      // validate: {
      //   vaidator: (email) => {
      //     return String(email)
      //       .toLowerCase()
      //       .match(
      //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //       );
      //   },
      //   message: "email is not correct",
      // },
    },
    password: { type: String, required: true },
    folders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Folder",
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export { userModel };

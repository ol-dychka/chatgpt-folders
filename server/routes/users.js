import express from "express";
const userRouter = express.Router();
import { userModel } from "../schemas/User.js";

userRouter.post("/create", async (req, res) => {
  const { name, email, password, folders } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "params are required" });
  }

  try {
    const newUser = new userModel({
      mimeType: "user",
      name,
      email,
      password,
      folders,
    });
    await newUser.save();
    res.status(200).json({ message: "Data saved successfully", data: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default userRouter;

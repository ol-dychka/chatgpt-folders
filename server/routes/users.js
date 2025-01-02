import express from "express";
import { userModel } from "../schemas/User.js";
import { OAuth2Client } from "google-auth-library";

const userRouter = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

userRouter.post("/auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("ticket: ", ticket);

    const payload = ticket.getPayload();
    // User's unique Google ID
    // const userId = payload["sub"];
    const email = payload["email"]; // User's email

    // have a user already registered
    const user = await userModel.findOne({ email }).exec();
    if (user) {
      res.status(200).json({
        message: "Authentication successful",
        id: user._id,
      });
    } else {
      // user is new
      const newUser = new userModel({
        mimeType: "user",
        email,
        folders: [],
      });
      await newUser.save();

      res.status(200).json({
        message: "Authentication successful",
        id: newUser._id,
        email,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

userRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    res.status(200).json(user.email);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;

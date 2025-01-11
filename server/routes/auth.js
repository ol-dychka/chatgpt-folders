import express from "express";
import { userModel } from "../schemas/User.js";
import { OAuth2Client } from "google-auth-library";

const authRouter = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.post("/google/callback", async (req, res) => {
  const { redirect_url } = req.body;

  const urlParams = new URLSearchParams(
    new URL(redirect_url).hash.substring(1)
  );
  const idToken = urlParams.get("id_token"); // ID Token is in the hash fragment

  console.log("ID Token:", idToken);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
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
        email,
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
    console.log("callback error: ", error.message);
    res.status(500).json({ error: error.message });
  }
});

authRouter.post("/google", async (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    client_id: process.env.GOOGLE_CLIENT_ID,
    // access_type: "offline", // To get refresh tokens
    scope: ["email", "profile"],
    // prompt: "consent", // Always ask user to re-consent
    response_type: "id_token",
  });

  res.json({ url: authorizeUrl });
});

export default authRouter;

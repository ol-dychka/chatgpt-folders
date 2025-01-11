import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import folderRouter from "./routes/folders.js";
import conversationRouter from "./routes/conversations.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";

const allowedOrigins = [
  "https://chatgpt.com",
  "chrome-extension://goegajhjmmncdfohmekhkdepnfalgkof",
];

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Chrome extensions) or from your allowedOrigins
      console.log("origin: ", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Use the API routes
app.use("/api/folders", folderRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/auth", authRouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

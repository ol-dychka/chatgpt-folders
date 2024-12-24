import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import folderRouter from "./routes/folders.js";
import conversationRouter from "./routes/conversations.js";
import userRouter from "./routes/users.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the API routes
app.use("/api/folders", folderRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/users", userRouter);

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

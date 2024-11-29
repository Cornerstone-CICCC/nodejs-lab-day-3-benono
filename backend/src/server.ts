import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.routes";
import chatSocket from "./sockets/chat.socket";
import dotenv from "dotenv";
dotenv.config();

// Create server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRouter);

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4321", // Your frontend url here (Astro, React, vanilla HTML)
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!;
console.log(MONGO_URI);
mongoose
  .connect(MONGO_URI, { dbName: "chatroom" })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start Socket.IO
    chatSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
console.log("hogehuga");

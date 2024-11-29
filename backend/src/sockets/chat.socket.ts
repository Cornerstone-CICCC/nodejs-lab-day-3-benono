import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

const setupChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // Listen to 'sendMessage' event
    socket.on("sendMessage", async (data) => {
      const { username, message } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message });
        const savedChat = await chat.save();
        console.log(savedChat);

        // Broadcast the chat object to all connected clients via the newMessage event
        io.emit("newMessage", chat);

        // For room-based broadcast
        // io.to(data.room).emit('newMessage', chat)
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Get all messages
    socket.on("getAllMessages", async () => {
      try {
        const messages = await Chat.find().sort({ createdAt: 1 }).limit(50);
        socket.emit("allMessages", messages);
      } catch (error) {
        console.error("Error getting all messages:", error);
      }
    });
  });
};

export default setupChatSocket;

import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

const setupChatSocket = (io: Server) => {
  const userMap = new Map<string, { username: string; room: string }>();
  io.on("connection", (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // Listen to 'joinRoom' event
    socket.on("joinRoom", async (username, room) => {
      console.log(`${username} joined room: ${room}`);
      socket.join(room);

      // Fetch all messages from the room
      const messages = await Chat.find({ room })
        .sort({ createdAt: 1 })
        .limit(50);

      if (!username) {
        username = "Unknown";
      } else {
        userMap.set(socket.id, { username, room });
      }

      // Broadcast all messages to the joined user
      socket.emit("allMessages", messages);

      // Broadcast to all clients in the room
      io.to(room).emit("userJoined", username);
    });

    // Listen to 'leaveRoom' event
    socket.on("leaveRoom", (username, room) => {
      console.log(`${username} left the room ${room}`);
      if (!username) {
        username = "Unknown";
      } else {
        userMap.delete(socket.id);
      }
      socket.leave(room);
      io.to(room).emit("userLeft", username);
    });

    // Listen to 'sendMessage' event
    socket.on("sendMessage", async (data) => {
      const { username, message, room } = data;
      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();
        // room-based broadcast
        io.to(data.room).emit("newMessage", chat);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      const user = userMap.get(socket.id);
      if (user) {
        console.log(`${user.username} disconnected from ${user.room}`);
        io.to(user.room).emit("userLeft", user.username);
        userMap.delete(socket.id);
      }
    });
  });
};

export default setupChatSocket;

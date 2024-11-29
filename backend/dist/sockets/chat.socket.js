"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    const userMap = new Map();
    io.on("connection", (socket) => {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // Listen to 'joinRoom' event
        socket.on("joinRoom", (username, room) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`${username} joined room: ${room}`);
            socket.join(room);
            // Fetch all messages from the room
            const messages = yield chat_model_1.Chat.find({ room })
                .sort({ createdAt: 1 })
                .limit(50);
            if (!username) {
                username = "Unknown";
            }
            else {
                userMap.set(socket.id, { username, room });
            }
            // Broadcast all messages to the joined user
            socket.emit("allMessages", messages);
            // Broadcast to all clients in the room
            io.to(room).emit("userJoined", username);
        }));
        // Listen to 'leaveRoom' event
        socket.on("leaveRoom", (username, room) => {
            console.log(`${username} left the room ${room}`);
            if (!username) {
                username = "Unknown";
            }
            else {
                userMap.delete(socket.id);
            }
            socket.leave(room);
            io.to(room).emit("userLeft", username);
        });
        // Listen to 'sendMessage' event
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // room-based broadcast
                io.to(data.room).emit("newMessage", chat);
            }
            catch (error) {
                console.error("Error saving chat:", error);
            }
        }));
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
exports.default = setupChatSocket;

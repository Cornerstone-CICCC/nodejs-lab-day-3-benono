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
    io.on("connection", (socket) => {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // Listen to 'sendMessage' event
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message });
                const savedChat = yield chat.save();
                console.log(savedChat);
                // Broadcast the chat object to all connected clients via the newMessage event
                io.emit("newMessage", chat);
                // For room-based broadcast
                // io.to(data.room).emit('newMessage', chat)
            }
            catch (error) {
                console.error("Error saving chat:", error);
            }
        }));
        // On disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
        // Get all messages
        socket.on("getAllMessages", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const messages = yield chat_model_1.Chat.find().sort({ createdAt: 1 }).limit(50);
                socket.emit("allMessages", messages);
            }
            catch (error) {
                console.error("Error getting all messages:", error);
            }
        }));
    });
};
exports.default = setupChatSocket;

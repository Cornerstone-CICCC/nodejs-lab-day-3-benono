"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    room: { type: String },
}, { timestamps: true });
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);

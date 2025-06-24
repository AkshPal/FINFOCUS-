"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = void 0;
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ws = new ws_1.default(process.env.WEBSOCKET_URL);
exports.ws = ws;
ws.on('open', () => {
    console.log("Websocket connection extablished successfully");
});
ws.on('error', () => {
    console.error();
});

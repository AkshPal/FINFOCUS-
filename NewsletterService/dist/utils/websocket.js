"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = __importDefault(require("ws"));
dotenv_1.default.config();
exports.wss = new ws_1.default.Server({
    port: parseInt(process.env.PORT || '6000')
});
exports.wss.on('listening', () => {
    console.log(`WebSocket server is listening on port ${process.env.PORT || '6000'}`);
});

import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const ws = new WebSocket(
    process.env.WEBSOCKET_URL as string
);

ws.on('open', () => {
    console.log("Websocket connection extablished successfully");
});

ws.on('error', () => {
    console.error();
});

export { ws };

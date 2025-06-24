import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();


export const wss = new WebSocket.Server({
    port: parseInt(process.env.PORT || '6000')
});

wss.on('listening', () => {
    console.log(`WebSocket server is listening on port ${process.env.PORT || '6000'}`);
}
)


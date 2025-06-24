import {ws} from '../utils/websocket.js';
import { NewsItem } from './newsFetcher.js';

export interface UserNewsPayload {
    user_id: number;
    email: string;
    name: string;
    news : NewsItem[];
}

export function sendUserNews(payload: UserNewsPayload) {
    const msg = JSON.stringify(payload);
    if(ws.readyState === ws.OPEN) {
        ws.send(msg);
    }else {
        ws.on('open', () => {
            ws.send(msg);
        });
    }
}

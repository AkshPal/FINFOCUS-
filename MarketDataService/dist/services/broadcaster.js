"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserNews = sendUserNews;
const websocket_js_1 = require("../utils/websocket.js");
function sendUserNews(payload) {
    const msg = JSON.stringify(payload);
    if (websocket_js_1.ws.readyState === websocket_js_1.ws.OPEN) {
        websocket_js_1.ws.send(msg);
    }
    else {
        websocket_js_1.ws.on('open', () => {
            websocket_js_1.ws.send(msg);
        });
    }
}

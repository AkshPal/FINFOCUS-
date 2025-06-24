"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllUserTickets = fetchAllUserTickets;
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("../utils/db.js");
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
async function fetchAllUserTickets() {
    try {
        const users = await db_js_1.sequelize.query(`SELECT id as user_id, name, email FROM users`, { type: sequelize_1.QueryTypes.SELECT });
        const map = new Map();
        users.forEach(u => map.set(u.user_id, { ...u, symbols: new Set() }));
        const holdings = await db_js_1.sequelize.query(`SELECT user_id, holding_symbol FROM portfolio_holdings`, { type: sequelize_1.QueryTypes.SELECT });
        holdings.forEach(h => map.get(h.user_id)?.symbols.add(h.holding_symbol));
        // 3) Watchlist
        const watch = await db_js_1.sequelize.query(`SELECT user_id, stock_symbol FROM watchlist_items`, { type: sequelize_1.QueryTypes.SELECT });
        watch.forEach(w => map.get(w.user_id)?.symbols.add(w.stock_symbol));
        return Array.from(map.values());
    }
    catch (err) {
        console.log(err);
        throw new Error('Error fetching user tickets');
    }
}

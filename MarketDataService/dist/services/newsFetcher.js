"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNewsFromFH = fetchNewsFromFH;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const redis_js_1 = require("../utils/redis.js");
dotenv_1.default.config();
// const NEWS_API_KEY_AV = process.env.NEWS_API_KEY_AV;
const NEWS_API_KEY_FH = process.env.NEWS_API_KEY_FH;
// https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2025-01-15&to=2025-02-20&token=d1ansnpr01qjhvtq9d60d1ansnpr01qjhvtq9d6g
async function fetchNewsFromFH(symbol) {
    try {
        const cacheKey = `news:${symbol}`;
        // try redis cache
        const cached = await redis_js_1.redisClient.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const toDate = new Date();
        const fromDate = new Date(toDate);
        fromDate.setDate(toDate.getDate() - 1);
        const from = fromDate.toISOString().slice(0, 10);
        const to = toDate.toISOString().slice(0, 10);
        const response = await axios_1.default.get(`https://finnhub.io/api/v1/company-news`, {
            params: {
                symbol: symbol,
                from: from,
                to: to,
                token: NEWS_API_KEY_FH
            }
        });
        const seen = new Set();
        const items = [];
        const data = response.data;
        for (const x of data) {
            if (seen.has(x.id))
                continue;
            seen.add(x.id);
            items.push({
                id: x.id.toString(),
                symbol: symbol,
                headline: x.headline,
                summary: x.summary,
                url: x.url,
                datetime: x.datetime,
                source: x.source,
                related: x.related,
                category: x.category,
                image: x.image
            });
            if (items.length >= 3)
                break;
        }
        await redis_js_1.redisClient.set(cacheKey, JSON.stringify(items), {
            EX: 60 * 60 * 2
        });
        return items;
    }
    catch (err) {
        console.log(err);
        throw new Error("Error fetching news from Fin Hub");
    }
}

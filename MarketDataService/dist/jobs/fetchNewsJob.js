"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFetchNewsJob = runFetchNewsJob;
const userData_js_1 = require("../services/userData.js");
const newsFetcher_js_1 = require("../services/newsFetcher.js");
const broadcaster_js_1 = require("../services/broadcaster.js");
async function runFetchNewsJob() {
    try {
        const users = await (0, userData_js_1.fetchAllUserTickets)();
        if (users.length === 0) {
            console.log("No users found, skipping news fetch job");
            return;
        }
        for (const user of users) {
            const newsarr = [];
            for (const symbol of user.symbols) {
                try {
                    const news = await (0, newsFetcher_js_1.fetchNewsFromFH)(symbol);
                    if (news && news.length > 0) {
                        newsarr.push(...news);
                    }
                }
                catch (err) {
                    console.log(`Error fetching news for symbol ${symbol} for user ${user.user_id}:`, err);
                }
            }
            (0, broadcaster_js_1.sendUserNews)({
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                news: newsarr
            });
        }
        console.log("News fetch job completed successfully");
    }
    catch (err) {
        console.log(err);
        throw new Error("Error running fetch news job");
    }
}

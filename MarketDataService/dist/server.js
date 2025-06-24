"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const fetchNewsJob_1 = require("./jobs/fetchNewsJob");
const cron_1 = require("cron");
dotenv_1.default.config();
(async () => {
    try {
        await db_1.sequelize.authenticate();
        console.log('Postgres Database connected Successfully.');
    }
    catch (err) {
        console.error('Unable to connect to Postgres Database:', err);
        process.exit(1); // Exit if DB connection fails
    }
    new cron_1.CronJob('28 21 * * * *', () => {
        (0, fetchNewsJob_1.runFetchNewsJob)().catch(console.error);
    }, null, true);
    await (0, fetchNewsJob_1.runFetchNewsJob)();
})();

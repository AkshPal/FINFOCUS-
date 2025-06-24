"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUserNewsletter = sendUserNewsletter;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//for Full SMTP server setup 
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: +process.env.SMTP_PORT,
//     secure: 'false',
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD
//     }
// })
// For Gmail SMTP setup
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});
async function sendUserNewsletter(payload) {
    const { user_id, email, name, news } = payload;
    let htmlContent = `<h1>NewsLetter for ${name}</h1>`;
    if (news.length == 0) {
        htmlContent += `<p>No news available for you at this time.</p>`;
    }
    else {
        htmlContent += `<p>Here are your Latest News:</p>`;
        htmlContent += `<ul>`;
        for (const item of news) {
            htmlContent += `<li>`;
            htmlContent += `<strong>${item.symbol}</strong>: `;
            if (item.headline) {
                htmlContent += `<p>${item.headline}</p>`;
            }
            if (item.timestamp) {
                htmlContent += `<p>Published on: ${new Date(item.timestamp).toLocaleDateString()}</p>`;
            }
            if (item.summary) {
                htmlContent += `<p>${item.summary}</p>`;
            }
            if (item.url) {
                htmlContent += `<a href="${item.url}" target="_blank">Read more</a>`;
            }
            htmlContent += `</li>`;
        }
        htmlContent += `</ul>`;
        await transporter.sendMail({
            from: `"Market Data Service" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Your Market Data Newsletter`,
            html: htmlContent
        });
    }
}

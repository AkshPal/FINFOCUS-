import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
})

export interface NewsItem {
    symbol: string;
    headline?: string;
    summary?: string;
    url?: string;
    timestamp?: string;
}

export interface UserNewsPayload {
    user_id: number;
    email: string;
    name: string;
    news: NewsItem[];
}

export async function sendUserNewsletter(payload: UserNewsPayload) {
    const {user_id, email, name, news} = payload;

    let htmlContent = `<h1>NewsLetter for ${name}</h1>`;
    if(news.length == 0){
        htmlContent += `<p>No news available for you at this time.</p>`;
    } else {
        htmlContent += `<p>Here are your Latest News:</p>`;
        htmlContent += `<ul>`;
        for(const item of news) {
            htmlContent += `<li>`;
            htmlContent += `<strong>${item.symbol}</strong>: `;
            if(item.headline) {
                htmlContent += `<p>${item.headline}</p>`;
            }
            if(item.timestamp) {
                htmlContent += `<p>Published on: ${new Date(item.timestamp).toLocaleDateString()}</p>`;
            }
            if(item.summary) {
                htmlContent += `<p>${item.summary}</p>`;
            }
            if(item.url) {
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

        })

    }
}



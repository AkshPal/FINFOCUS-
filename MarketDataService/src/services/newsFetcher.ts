import dotenv from 'dotenv';
import {Request,Response} from 'express';
import axios from 'axios';
import {redisClient} from '../utils/redis.js';


dotenv.config();

// const NEWS_API_KEY_AV = process.env.NEWS_API_KEY_AV;
const NEWS_API_KEY_FH = process.env.NEWS_API_KEY_FH;

export interface NewsItem {
    id: string;
    symbol?:string;
    headline: string;
    summary: string;
    url: string;
    datetime: number;
    source: string;
    related: string;
    category?: string;
    image?: string;
}




// https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2025-01-15&to=2025-02-20&token=d1ansnpr01qjhvtq9d60d1ansnpr01qjhvtq9d6g

async function fetchNewsFromFH(symbol: string): Promise<any> {
    try {
        const cacheKey = `news:${symbol}`;

        // try redis cache
        const cached = await redisClient.get(cacheKey);
        if(cached){
            return JSON.parse(cached) as NewsItem[];
        }

        const toDate = new Date();
        const fromDate = new Date(toDate);
        fromDate.setDate(toDate.getDate()-1);

        const from = fromDate.toISOString().slice(0,10);
        const to = toDate.toISOString().slice(0,10);

        const response = await axios.get(`https://finnhub.io/api/v1/company-news`,{
            params: {
                symbol: symbol,
                from: from,
                to: to,
                token: NEWS_API_KEY_FH
            }
        });

        const seen = new Set<number>();
        const items: NewsItem[] = [];

        const data = response.data as any[];
        for(const x of data) {
            if(seen.has(x.id))continue;
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

            if(items.length >= 3) break; 
        }

        await redisClient.set(cacheKey, JSON.stringify(items), {
            EX: 60 * 60 * 2 
        });

        return items;


    }catch(err) {
        console.log(err);
        throw new Error("Error fetching news from Fin Hub");
    }
}

export {fetchNewsFromFH}

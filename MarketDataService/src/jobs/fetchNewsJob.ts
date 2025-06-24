import  {fetchAllUserTickets}  from "../services/userData.js";
import { fetchNewsFromFH } from "../services/newsFetcher.js";
import { redisClient } from "../utils/redis.js";
import { sendUserNews } from "../services/broadcaster.js";

async function runFetchNewsJob() {
    try {

        const users = await fetchAllUserTickets();

        if(users.length === 0) {
            console.log("No users found, skipping news fetch job");
            return;
        }

        for(const user of users){

            const newsarr = [];

            for( const symbol of user.symbols){
                try{ 
                    const news = await fetchNewsFromFH(symbol);
                    if(news && news.length > 0) {
                        newsarr.push(...news);
                        
                    }
                }catch(err){
                    console.log(`Error fetching news for symbol ${symbol} for user ${user.user_id}:`, err);
                }
            }

            sendUserNews({
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                news: newsarr
            });
        }

        console.log("News fetch job completed successfully");

    }catch(err) {
        console.log(err);
        throw new Error("Error running fetch news job");
    }
}

export {runFetchNewsJob};
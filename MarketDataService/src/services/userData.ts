import dotenv from 'dotenv';
import { Request, Response , NextFunction } from 'express';
import { sequelize } from '../utils/db.js'
import { QueryTypes} from 'sequelize';

dotenv.config();

export interface UserTicket {
    user_id: number;
    name: string;
    email: string;
    symbols: Set<string>;

}

export async function fetchAllUserTickets(): Promise<UserTicket[]> {
    try {
        const users = await sequelize.query<{user_id: number;name: string; email: string}>(
            `SELECT id as user_id, name, email FROM users`,
            { type: QueryTypes.SELECT }
        );

        const map = new Map<number, UserTicket>();
        users.forEach(u=> map.set(u.user_id, {...u, symbols: new Set()}));

        const holdings = await sequelize.query<{ user_id: number; holding_symbol: string }>(
            `SELECT user_id, holding_symbol FROM portfolio_holdings`,
            { type: QueryTypes.SELECT }
        );
        holdings.forEach(h => map.get(h.user_id)?.symbols.add(h.holding_symbol));

  // 3) Watchlist
        const watch = await sequelize.query<{ user_id: number; stock_symbol: string }>(
          `SELECT user_id, stock_symbol FROM watchlist_items`,
          { type: QueryTypes.SELECT }
        );
        watch.forEach(w => map.get(w.user_id)?.symbols.add(w.stock_symbol));

        return Array.from(map.values());
    }catch(err){
        console.log(err);
        throw new Error('Error fetching user tickets');
    }
}


import User from '../models/user.js';
import PortfolioHolding from '../models/portfolioHolding.js';
import WatchlistItem from '../models/watchlistItem.js';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = (req as any).user.email as string;

        // find the single user record whose email matches
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email', 'phone', 'portfolio_id', 'watchlist_id']
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPortfolio = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rows = await PortfolioHolding.findAll({
            where: { user_id: user.getDataValue('id') }
        });
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const getWatchlist = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rows = await WatchlistItem.findAll({
            where: { user_id: user.getDataValue('id') }
        });
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const addHolding = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { holding_symbol, quantity, purchase_price, purchase_date } = req.body;
        if (!holding_symbol || !quantity || !purchase_price || !purchase_date) {
            return res.status(400).json({ message: 'all fields needed' });
        }

        const newHolding = await PortfolioHolding.create({
            user_id: user.getDataValue('id'),
            portfolio_id: user.getDataValue('portfolio_id'),
            holding_symbol,
            quantity,
            purchase_price,
            purchase_date
        });

        res.status(201).json(newHolding);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'internal server error' });
    }
};

export const addWatchlist = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { stock_symbol } = req.body;
        if (!stock_symbol) {
            res.status(400).json({ message: 'stock symbol is needed' });
            return;
        }

        const newWatchlistItem = await WatchlistItem.create({
            user_id: user.getDataValue('id'),
            watchlist_id: user.getDataValue('watchlist_id'),
            stock_symbol
        });

        res.status(201).json(newWatchlistItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
        return;
    }
};

export const removeHolding = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stock_symbol = req.params.symbol;
        const holding = await PortfolioHolding.findOne({
            where: {
                user_id: user.getDataValue('id'),
                holding_symbol: stock_symbol
            }
        });
        if (!holding) {
            res.status(404).json({ message: 'holding not found' });
            return;
        }

        await holding.destroy();
        res.status(204).json({ message: 'holding removed' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
        return;
    }
};

export const removeWatchlistItem = async (req: Request, res: Response) => {
    try {
        // Get user by email first
        const email = (req as any).user.email as string;
        const user = await User.findOne({ where: { email } }) as any;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stock_symbol = req.params.symbol;
        const watchlistItem = await WatchlistItem.findOne({
            where: {
                user_id: user.getDataValue('id'),
                stock_symbol: stock_symbol
            }
        });
        if (!watchlistItem) {
            res.status(404).json({ message: 'watchlist item not found' });
            return;
        }

        await watchlistItem.destroy();
        res.status(204).json({ message: 'watchlist item removed' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'internal server error' });
        return;
    }
};

export const addUser = async (req: Request, res: Response) => {
    const {name, email} = (req as any).body;
    if(!name || !email) {
        return res.status(400).json({message: 'Name and Email are required'});
    }

    let user = await User.findOne({where: {email}});
    if(user) {
        return res.status(400).json({message: 'User already exists'});
    }
    user = await User.create({
        name,
        email

    })

    res.status(201).json(user);
}


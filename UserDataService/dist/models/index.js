import { db } from '../utils/db.js';
import User from './user.js';
import PortfolioHolding from './portfolioHolding.js';
import WatchlistItem from './watchlistItem.js';
User.hasMany(PortfolioHolding, { foreignKey: 'user_id' });
PortfolioHolding.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(WatchlistItem, { foreignKey: 'user_id' });
WatchlistItem.belongsTo(User, { foreignKey: 'user_id' });
export { db, User, PortfolioHolding, WatchlistItem };

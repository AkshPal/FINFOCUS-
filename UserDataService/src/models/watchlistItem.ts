import { DataTypes, Model } from "sequelize";
import { db } from '../utils/db.js';

class WatchlistItem extends Model {}

WatchlistItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_symbol: {  
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'WatchlistItem',
    tableName: 'watchlist_items'
});

export default WatchlistItem;

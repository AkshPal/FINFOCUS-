import { DataTypes, Model } from "sequelize";
import { db } from '../utils/db.js';
class PortfolioHolding extends Model {
}
PortfolioHolding.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    holding_symbol: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    purchase_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'PortfolioHolding',
    tableName: 'portfolio_holdings'
});
export default PortfolioHolding;

import { DataTypes, Model } from "sequelize";
import { db } from '../utils/db.js';

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER, 
        primaryKey:true, 
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    portfolio_id: {
        type: DataTypes.INTEGER,
        
    },
    watchlist_id: {
        type: DataTypes.INTEGER,
        
        
    }
},{
    sequelize: db,
    modelName:'User',
    tableName:'users'
});

export default User;
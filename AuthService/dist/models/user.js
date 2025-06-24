import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/db.js';
class User extends Model {
}
User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    googleId: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});
export default User;

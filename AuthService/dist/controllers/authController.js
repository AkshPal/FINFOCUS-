import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const generateToken = (user) => {
    return jwt.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};
export const googleCallbackHandler = (req, res) => {
    const user = req.user; // You may define a better type for user
    const token = generateToken(user);
    res.json({ token, user: { name: user.name, email: user.email } });
};
export const authTest = (req, res) => {
    res.send('Auth service running.');
};

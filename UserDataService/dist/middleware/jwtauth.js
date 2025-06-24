import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authen = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.sub, email: payload.email };
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
export default authen;

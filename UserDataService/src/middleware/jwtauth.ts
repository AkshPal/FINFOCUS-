import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const authen = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    const token = auth.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        (req as any).user = { id: payload.sub, email: payload.email };
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authen;
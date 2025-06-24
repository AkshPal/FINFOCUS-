import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { Request, Response } from 'express';

dotenv.config();

const generateToken = (user: any) => {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
};

export const googleCallbackHandler = (req: Request, res: Response) => {
  const user = req.user as any; // You may define a better type for user
  const token = generateToken(user);

  res.json({ token, user: { name: user.name, email: user.email } });
};

export const authTest = (req: Request, res: Response) => {
  res.send('Auth service running.');
};
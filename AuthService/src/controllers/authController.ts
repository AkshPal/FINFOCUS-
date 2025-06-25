import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';

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

export const googleCallbackHandler = async (req: Request, res: Response) => {
  const user = req.user as any; 
  const token = generateToken(user);

  try {
    await axios.post('http://localhost:3000/users', {
      name: user.name,
      email: user.email
    });
  } catch (err: any) {
    // If user already exists, ignore the error and continue
    if (err.response && err.response.status === 400 && err.response.data?.message === 'User already exists') {
      // proceed
    } else {
      console.error('Failed to create user in UserDataService', err);
      res.status(500).json({ message: 'Failed to create user in UserDataService' });
      return;
    }
  }

  res.json({ token, user: { name: user.name, email: user.email } });
};

export const authTest = (req: Request, res: Response) => {
  res.send('Auth service running.');
};
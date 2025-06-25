import express, { Request, Response } from 'express';
import passport from 'passport';
import * as authCtrl from '../controllers/authController.js';

const router = express.Router();

router.get('/', authCtrl.authTest);

// Start Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Handle OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  authCtrl.googleCallbackHandler
);

router.get('/failure', (req:Request, res:Response) => {
    res.status(401).send('Authentication Failed')
}
);

export default router;

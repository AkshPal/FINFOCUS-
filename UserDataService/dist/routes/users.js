import express from 'express';
import * as ctl from '../controller/userController.js';
import authen from '../middleware/jwtauth.js';
const router = express.Router();
router.post('/users', ctl.addUser);
// Cast authentication middleware to RequestHandler
router.use(authen);
// Cast controller functions to RequestHandler
router.get('/me', ctl.getProfile);
router.get('/me/portfolio', ctl.getPortfolio);
router.get('/me/watchlist', ctl.getWatchlist);
router.post('/me/portfolio', ctl.addHolding);
router.delete('/me/portfolio/:symbol', ctl.removeHolding);
router.post('/me/watchlist', ctl.addWatchlist);
router.delete('/me/watchlist/:symbol', ctl.removeWatchlistItem);
export default router;

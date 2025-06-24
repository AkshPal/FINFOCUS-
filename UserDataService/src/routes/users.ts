import express, { Router, Request, Response, RequestHandler } from 'express';
import * as ctl from '../controller/userController.js';
import authen from '../middleware/jwtauth.js';

const router: Router = express.Router();

// Cast authentication middleware to RequestHandler
router.use(authen as RequestHandler);

// Cast controller functions to RequestHandler
router.get('/me', ctl.getProfile as RequestHandler);
router.get('/me/portfolio', ctl.getPortfolio as RequestHandler);
router.get('/me/watchlist', ctl.getWatchlist as RequestHandler);

router.post('/me/portfolio', ctl.addHolding as RequestHandler);
router.delete('/me/portfolio/:symbol', ctl.removeHolding as RequestHandler);

router.post('/me/watchlist', ctl.addWatchlist as RequestHandler);
router.delete('/me/watchlist/:symbol', ctl.removeWatchlistItem as RequestHandler);

export default router;
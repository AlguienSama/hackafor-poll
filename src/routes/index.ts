import express from 'express';
import { login } from '@src/controllers/auth.controller';
import { decriptJwt } from '@src/middlewares/auth.middleware';
import * as routerPoll from './polls.routes';

export const router = express.Router();

router.post('/login', login);
router.use(decriptJwt);
router.use('/polls', routerPoll.router);
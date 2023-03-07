import { createPoll, deletePoll, editPoll, getListPolls, getPollById, votePoll } from '@controllers/poll.controller';
import express from 'express';

export const router = express.Router();

router.get('/', getListPolls);
router.get('/:poll_id', getPollById);
router.post('/', createPoll);
router.put('/:poll_id', editPoll);
router.delete('/:poll_id', deletePoll);
router.post('/vote/:poll_id', votePoll)
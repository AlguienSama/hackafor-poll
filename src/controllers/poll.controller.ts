import { Request, Response } from 'express';
import { IPollApiRequest, PollApiRequestSchema } from '@schemas/poll.schema';
import { PollEntity, PollRelationshipEntity } from '@entities/poll.entity';
import { UserEntity } from '@entities/user.entity';

export const createPoll = async (req: Request, res: Response) => {
  try {
    const data: IPollApiRequest = await PollApiRequestSchema.validateAsync(req.body);

    for (let i = 0; i < data.options.length; i++) {
      for (let j = i+1; j < data.options.length; j++) {
        if (data.options[i].id == data.options[j].id) {
          return res.status(400).send({message: 'Invalid id'})
        }
      }
    }

    let poll = new PollEntity();
    Object.assign(poll, data);
    poll.owner = res.locals.jwt.user_id;
    poll = await poll.save();

    res.status(201).send(poll);
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
}

export const editPoll = async (req: Request, res: Response) => {}

export const getPollById = async (req: Request, res: Response) => {
  const pollId = req.params.poll_id;

  try {
    const poll = await PollEntity.findOneOrFail({
      where: {
        poll_id: pollId
      },
      relations: {
        owner: true
      }
    });

    if (poll.user_registred && !res.locals.jwt.user_id) {
      return res.status(401).send({message: 'Unauthorized'});
    }

    return res.status(202).send(poll);
  } catch (e) {
    res.status(404).send({message: 'Not Found'});
  }
}

export const deletePoll = async (req: Request, res: Response) => {}

export const getUserParticipatedPolls = async (req: Request, res: Response) => {}

export const getListPolls = async (req: Request, res: Response) => {
  const userId = res.locals.jwt.user_id;
  console.log(userId)

  const whereOptions: { user_registred?: boolean } = {};
  if (!userId) { whereOptions.user_registred = false; }

  try {
    const polls = await PollEntity.findAndCount({
      where: {
        public_poll: true,
        ...whereOptions
      },
      relations: {
        owner: true
      }
    });
    res.status(202).send(polls);
  } catch (e) {
    res.status(404).send({message: 'Not Found'});
  }
}

export const votePoll = async (req: Request, res: Response) => {
  const userId = res.locals.jwt.user_id;
  const pollId = req.params.poll_id;
  const option = req.body.option;

  try {

    const poll = await PollEntity.findOne({
      where: {
        poll_id: pollId
      }
    });
    const user = await UserEntity.findOne({
      where: {
        user_id: userId
      }
    });

    if (!(poll && user && option)) {
      return res.status(404).send({message: 'Not Found'});
    }

    if (!(poll.options.find((o) => { if (o.id === option) return true }))) {
      return res.status(404).send({message: 'Not Found'});
    }

    if (!poll.votes.includes(user)) {
      poll.votes ? poll.votes.push(user) : poll.votes = [user];

      const relation = new PollRelationshipEntity()
      relation.poll = poll.poll_id;
      relation.user = user.user_id;
      relation.option = option;

      await relation.save();
      await poll.save()
    } else {
      poll.votes = poll.votes.filter(v => v.user_id !== user.user_id);

      await PollRelationshipEntity.delete({poll: poll.poll_id, user: user.user_id});
      await poll.save();
    }

  } catch (e) {
    res.status(500).send({message: 'Internal Server Error'});
  }
}

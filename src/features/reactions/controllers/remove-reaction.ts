import HTTP_STATUS from 'http-status-codes';
import { reactionQueue } from '@service/queues/reaction.queue';
import { Request, Response } from 'express';
import { ReactionCache } from '@service/redis/reaction.cache';
import { Helper } from '@global/helpers/helpers';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';

export const reactionCache: ReactionCache = new ReactionCache();

export class Remove {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { postId, previousReaction, postReactions } = req.params;
    await reactionCache.removePostReactionFromCache(postId, req.currentUser!.username, Helper.parseJson(postReactions));

    const databaseReactionData: IReactionJob = { postId, previousReaction, username: req.currentUser!.username };

    reactionQueue.addReactionJob('removeReactionFromDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({
      message: 'Reaction remove from post'
    });
  }
}

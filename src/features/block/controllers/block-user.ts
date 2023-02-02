import HTTP_STATUS from 'http-status-codes';
import { blockQueue } from './../../../shared/services/queues/block.queue';
import { BlockCache } from '@service/redis/block.cache';
import { Request, Response } from 'express';

const blockCache: BlockCache = new BlockCache();

export class BlockUser {
  public async block(req: Request, res: Response): Promise<void> {
    const { followerId } = req.params;
    BlockUser.prototype.updateBlockedUser(followerId, `${req.currentUser?.userId}`, 'block');
    blockQueue.addBlockUserJob('addBlockToDB', {
      keyOne: `${req.currentUser?.userId}`,
      keyTwo: followerId,
      type: 'block'
    });

    res.status(HTTP_STATUS.OK).json({ message: 'User blocked successfully' });
  }

  public async unblock(req: Request, res: Response): Promise<void> {
    const { followerId } = req.params;
    BlockUser.prototype.updateBlockedUser(followerId, `${req.currentUser?.userId}`, 'unblock');
    blockQueue.addBlockUserJob('removeBlockFromDB', {
      keyOne: `${req.currentUser?.userId}`,
      keyTwo: followerId,
      type: 'unblock'
    });

    res.status(HTTP_STATUS.OK).json({ message: 'User unblock successfully' });
  }

  private async updateBlockedUser(followerId: string, userId: string, type: 'block' | 'unblock'): Promise<void> {
    const blocked: Promise<void> = blockCache.updateBlockedUserPropInCache(`${userId}`, 'blocked', `${followerId}`, type);
    const blockedBy: Promise<void> = blockCache.updateBlockedUserPropInCache(`${followerId}`, 'blockedBy', `${userId}`, type);
    await Promise.all([blocked, blockedBy]);
  }
}

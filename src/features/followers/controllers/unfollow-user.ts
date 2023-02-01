import HTTP_STATUS from 'http-status-codes';
import { followerQueue } from '@service/queues/follower.queue';
import { FollowerCache } from '@service/redis/follower.cache';
import { Request, Response } from 'express';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async unfollower(req: Request, res: Response): Promise<void> {
    const { followerId, followeeId } = req.params;
    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${followerId}`, followeeId);
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);

    const followerCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);

    await Promise.all([removeFollowerFromCache, removeFolloweeFromCache, followerCount, followeeCount]);

    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: `${followeeId}`,
      keyTwo: `${followerId}`
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Unfollowed user now' });
  }
}

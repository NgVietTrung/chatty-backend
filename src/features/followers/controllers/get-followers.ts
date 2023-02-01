import HTTP_STATUS from 'http-status-codes';
import { followerService } from './../../../shared/services/db/follower.service';
import { IFollowerData } from './../interfaces/follower.interface';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { FollowerCache } from '@service/redis/follower.cache';

const followerCache: FollowerCache = new FollowerCache();

export class Get {
  public async userFollowing(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(`${req.currentUser?.userId}`);
    const cachedFollowees: IFollowerData[] = await followerCache.getFollowersFromCache(`following:${req.currentUser?.userId}`);
    const following: IFollowerData[] = cachedFollowees.length ? cachedFollowees : await followerService.getFolloweeData(userObjectId);
    res.status(HTTP_STATUS.OK).json({ message: 'User following', following });
  }

  public async userFollowers(req: Request, res: Response): Promise<void> {
    const userObjectId: ObjectId = new mongoose.Types.ObjectId(`${req.params.userId}`);
    const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`follower:${req.params.userId}`);
    const followers: IFollowerData[] = cachedFollowers.length ? cachedFollowers : await followerService.getFollowerData(userObjectId);
    res.status(HTTP_STATUS.OK).json({ message: 'User followers', followers });
  }
}
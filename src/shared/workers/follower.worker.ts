import { followerService } from './../services/db/follower.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('followerWorker');

class FollowerWorker {
  async addFollowerToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo, username, followerDocumentId } = job.data;
      await followerService.addFollowerToDB(keyOne, keyTwo, username, followerDocumentId);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }

  async removeFollowerFromDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo } = job.data;
      await followerService.removeFollowerToDB(keyOne, keyTwo);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const followerWorker: FollowerWorker = new FollowerWorker();

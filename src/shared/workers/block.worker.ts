import { config } from '@root/config';
import { blockService } from '@service/db/block.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('blockWorker');

class BlockWorker {
  async addBlockToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo, type } = job.data;
      if (type === 'block') {
        await blockService.blockUser(keyOne, keyTwo);
      } else {
        await blockService.unblockUser(keyOne, keyTwo);
      }

      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const blockWorker: BlockWorker = new BlockWorker();

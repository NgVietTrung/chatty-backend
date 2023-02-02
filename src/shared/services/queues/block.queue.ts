import { IBlockedUserJobData } from '@block/interfaces/block.interface';
import { blockWorker } from '@worker/block.worker';
import { BaseQueue } from './base.queue';

class BlockQueue extends BaseQueue {
  constructor() {
    super('block');
    this.processJob('addBlockToDB', 5, blockWorker.addBlockToDB);
    this.processJob('removeBlockFromDB', 5, blockWorker.addBlockToDB);
  }

  public addBlockUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const blockQueue: BlockQueue = new BlockQueue();

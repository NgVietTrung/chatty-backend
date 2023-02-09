import { IFileImageJobData } from './../../../features/images/interfaces/image.interface';
import { IFollowerJobData } from './../../../features/followers/interfaces/follower.interface';
import { IEmailJob } from './../../../features/user/interfaces/user.interface';
import { IAuthJob } from './../../../features/auth/interfaces/auth.interface';
import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IPostJobData } from '@post/interfaces/post.interface';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ICommentJob } from '@comment/interfaces/comment.interface';
import { IBlockedUserJobData } from '@block/interfaces/block.interface';
import { INotificationJobData } from '@notification/interfaces/notification.interface';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';

type IBaseJobData =
  | IAuthJob
  | IEmailJob
  | IPostJobData
  | IReactionJob
  | ICommentJob
  | IFollowerJobData
  | IBlockedUserJobData
  | INotificationJobData
  | IFileImageJobData
  | IChatJobData
  | IMessageData;

let bullAdapter: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;
  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapter.push(new BullAdapter(this.queue));
    bullAdapter = [...new Set(bullAdapter)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapter,
      serverAdapter
    });

    this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 5000
      }
    });
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}

import { IEmailJob } from '@user/interfaces/user.interface';
import { emailWorker } from '@worker/email.worker';
import { BaseQueue } from './base.queue';

class EmailQueue extends BaseQueue {
  constructor() {
    super('emails');
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificationEmail);
    this.processJob('commentsEmail', 5, emailWorker.addNotificationEmail);
    this.processJob('followersEmail', 5, emailWorker.addNotificationEmail);
    this.processJob('reactionsEmail', 5, emailWorker.addNotificationEmail);
  }

  public addEmailJob(name: string, data: IEmailJob) {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();

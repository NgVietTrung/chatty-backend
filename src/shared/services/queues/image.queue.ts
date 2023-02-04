import { IFileImageJobData } from '@image/interfaces/image.interface';
import { imageWorker } from '@worker/image.worker';
import { BaseQueue } from './base.queue';

class ImageQueue extends BaseQueue {
  constructor() {
    super('images');
    this.processJob('addImageToDB', 5, imageWorker.addImageToDB);
    this.processJob('updateBGImageInDB', 5, imageWorker.updateBGImageInDB);
    this.processJob('addUserProfileImageToDB', 5, imageWorker.addUserProfileImageToDB);
    this.processJob('removeImageFromDB', 5, imageWorker.removeImageFromDB);
  }

  public addImageJob(name: string, data: IFileImageJobData): void {
    this.addJob(name, data);
  }
}

export const imageQueue: ImageQueue = new ImageQueue();

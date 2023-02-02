import { ServerError } from '@global/helpers/error-handler';
import { Helper } from '@global/helpers/helpers';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { remove } from 'lodash';

const log: Logger = config.createLogger('commentsCache');

export class BlockCache extends BaseCache {
  constructor() {
    super('commentsCache');
  }

  public async updateBlockedUserPropInCache(key: string, prop: string, value: string, type: 'block' | 'unblock'): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
      const response: string = (await this.client.HGET(`users:${key}`, prop)) as string;
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      let blocked: string[] = Helper.parseJson(response) as string[];
      if (type === 'block') {
        blocked = [...blocked, value];
      } else {
        remove(blocked, (id: string) => id === value);
        blocked = [...blocked];
      }

      const dataToSave: string[] = [`${prop}`, JSON.stringify(blocked)];
      multi.HSET(`users:${key}`, dataToSave);
      await multi.exec();
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}

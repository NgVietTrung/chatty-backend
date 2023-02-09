import HTTP_STATUS from 'http-status-codes';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { chatQueue } from '@service/queues/chat.queue';
import { MessageCache } from '@service/redis/message.cache';
import { socketIOChatObject } from '@socket/chat';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const messageCache: MessageCache = new MessageCache();

export class Delete {
  public async markMessageAsDeleted(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId, messageId, type } = req.params;
    const updateMessage: IMessageData = await messageCache.markMessageAsDeleted(senderId, receiverId, messageId, type);
    socketIOChatObject.emit('message read', updateMessage);
    socketIOChatObject.emit('markMessageAsDeletedInDB', {
      messageId: new mongoose.Types.ObjectId(messageId),
      type
    });

    chatQueue.addChatJob('markMessageAsDeleted', updateMessage);

    res.status(HTTP_STATUS.OK).json({
      message: 'Message marked as read'
    });
  }
}

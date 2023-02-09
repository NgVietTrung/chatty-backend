import HTTP_STATUS from 'http-status-codes';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { chatQueue } from '@service/queues/chat.queue';
import { MessageCache } from '@service/redis/message.cache';
import { socketIOChatObject } from '@socket/chat';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { markChatSchema } from '@chat/schemes/chat';
import { joiValidation } from '@global/decorators/joi-validation.decorators';

const messageCache: MessageCache = new MessageCache();

export class Update {
  @joiValidation(markChatSchema)
  public async markMessageAsRead(req: Request, res: Response): Promise<void> {
    const { senderId, receiverId } = req.body;
    const updateMessage: IMessageData = await messageCache.updateChatMessages(senderId, receiverId);
    socketIOChatObject.emit('message read', updateMessage);
    socketIOChatObject.emit('chat list', updateMessage);

    chatQueue.addChatJob('markMessageAsReadInDB', {
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId)
    });
    res.status(HTTP_STATUS.OK).json({
      message: 'Message marked as deleted'
    });
  }
}

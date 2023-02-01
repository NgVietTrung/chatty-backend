import { IFollower } from '@root/features/followers/interfaces/follower.interface';
import { Server, Socket } from 'socket.io';

export let socketIOFollowerObject: Server;

export class SocketIOFollowerHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOFollowerObject = io;
  }

  public listen() {
    this.io.on('connection', (socket: Socket) => {
      socket.on('unfollow user', (data: IFollower) => {
        this.io.emit('remove follower', data);
      });
    });
  }
}

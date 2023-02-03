import { Server, Socket } from 'socket.io';

let socketIONotificationObject: Server;

export class SocketIONotificationHandler {
  public listen(io: Server) {
    socketIONotificationObject = io;
  }
}

export { socketIONotificationObject };

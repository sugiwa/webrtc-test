import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8001, {
  namespace: 'chat',
  cors: { origin: '*' },
  // transports: ['websocket'],
})
export class WebrtcGateway {
  readonly log = new Logger(WebSocketGateway.name);
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket) {
    this.log.log(client.id + 'message');
  }
}

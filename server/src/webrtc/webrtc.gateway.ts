import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { subscribeOn } from 'rxjs';

@WebSocketGateway(8001, {
  namespace: 'chat',
  cors: { origin: '*' },
  transports: ['websocket'],
})
export class WebrtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  readonly log = new Logger(WebSocketGateway.name);

  private clients: Socket[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.log.log(`client[${client.id}] enter the room.`);
    this.clients.push(client);
    this.log.log(
      `the number of currently connected clients is ${this.clients.length}`,
    );
  }

  handleDisconnect(client: any) {
    this.log.log(`client[${client.id}] has left the room.`);
    this.clients = this.clients.filter((c) => c.id != client.id);
  }

  @SubscribeMessage('send')
  handleMessage(client: Socket) {
    for (const c of this.clients) {
      c.emit('message', `Broadcast from ${client.id}`);
    }
  }

  @SubscribeMessage('start')
  handleStart(client: Socket, data: string) {
    this.log.debug('client', client);
    this.log.debug('data', data);
  }

  @SubscribeMessage('offer')
  handleOffer(client: Socket, data: string) {
    this.log.debug(`offer: ${data}`);
    for (const c of this.clients) {
      this.log.log(`offer to ${c.id}`);
      if (client.id === c.id) {
        this.log.log(`skip ${c.id}`);
        continue;
      }
      c.emit('offer', data);
    }
  }

  @SubscribeMessage('answer')
  handleAnswer(client: Socket, data: string) {
    this.log.debug(`answer: ${data}`);
    for (const c of this.clients) {
      if (client.id === c.id) continue;
      c.emit('answer', data);
    }
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(client: Socket, data: string) {
    this.log.debug(`ice candidate: ${data}`);
    for (const c of this.clients) {
      if (client.id === c.id) continue;
      c.emit('ice-candidate', data);
    }
  }
}

import { GameEventQueueService } from '@card-game/game-engine-old';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/game-events', cors: true })
export class GameEventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly tickEventQueueService: GameEventQueueService) {}

  afterInit() {
    // Optionally, subscribe to backend events and broadcast to clients
    // this.tickEventQueueService.onEvent((event) => {
    //   this.server.emit('gameEvent', event);
    // });
  }

  handleConnection(client: any) {
    // Optionally send initial state or welcome message
  }

  handleDisconnect(client: any) {
    // Handle client disconnect
  }

  @SubscribeMessage('playerEvent')
  handlePlayerEvent(@MessageBody() event: any) {
    this.tickEventQueueService.emit([event]);
    return { status: 'Event received' };
  }
}

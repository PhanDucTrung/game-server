import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaroService } from '../services/caro.service';

@WebSocketGateway()
export class CaroGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly caroService: CaroService) {}

  afterInit(server: Server) {
    this.caroService.server = server;
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId?: string,
  ) {
    this.caroService.handleJoin(client, roomId);
  }

  @SubscribeMessage('move')
  handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() move: { row: number; col: number; gameId: string },
  ) {
    this.caroService.handleMove(client, move);
  }
}

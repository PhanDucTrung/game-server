import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Line98Service } from './line98.service';

@WebSocketGateway()
export class Line98Gateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly line98Service: Line98Service) {}

  @SubscribeMessage('getState')
  handleGetState() {
    const state = this.line98Service.getGameState();
    this.server.emit('state', state);
  }

  @SubscribeMessage('reset')
handleReset() {
  this.line98Service.resetGame();
  const state = this.line98Service.getGameState();
  this.server.emit('state', state);
}

 @SubscribeMessage('moveBall')
handleMoveBall(
  client: Socket,
  payload: { from: [number, number]; to: [number, number] },
) {
  const { from, to } = payload;

  const path = this.line98Service.findPath(from, to);
  if (!path) {
    client.emit('invalidMove');
    return;
  }

  this.line98Service.moveBall(from, to, path);

  const state = this.line98Service.getGameState();

  client.emit('moveResult', { board: state.board, path });
  this.server.emit('state', state);
}

}

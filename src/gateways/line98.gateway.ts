import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Line98Service } from '../services/line98.service';

@WebSocketGateway()
export class Line98Gateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly line98Service: Line98Service) {}

  @SubscribeMessage('getState')
  getState() {
    this.server.emit('state', this.line98Service.getGameState());
  }

  @SubscribeMessage('reset')
  reset() {
    this.line98Service.resetGame();
    this.server.emit('state', this.line98Service.getGameState());
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

  const ok = this.line98Service.moveBall(from, to, path);
  if (!ok) {
    client.emit('invalidMove');
    return;
  }

  const state = this.line98Service.getGameState();

  client.emit('moveResult', { board: state.board, path });
  this.server.emit('state', state);
}
@SubscribeMessage('getHelp')
handleGetHelp(client: Socket) {
  const moves = this.line98Service.findPotentialMoves();

  if (moves.length > 0) {
    const bestPriority = moves[0].priority;
    const recommended = moves.filter(m => m.priority === bestPriority);
    client.emit('helpSuggestion', recommended);
  } else {
    client.emit('helpSuggestion', []);
  }
}


@SubscribeMessage('postMove')
handlePostMove() {
  this.line98Service.postMove();
  const state = this.line98Service.getGameState();
  this.server.emit('state', state);
}

}

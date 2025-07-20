import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@Injectable()
export class CaroService {
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  handleJoin(client: Socket, roomId?: string) {
    const { newRoomId, symbol } = this.roomService.addPlayer(client.id, roomId);

    client.join(newRoomId);

    client.emit('player', { symbol, roomId: newRoomId });

    if (this.roomService.isReady(newRoomId)) {
      this.server.to(newRoomId).emit('start', 'Game Start! X goes first.');
    }

    this.server.emit('rooms', this.roomService.getAllRooms());
  }

  handleMove(
    client: Socket,
    move: { row: number; col: number; gameId: string },
  ) {
    const result = this.roomService.makeMove(
      move.gameId,
      client.id,
      move.row,
      move.col,
    );

    if (!result) return;

    const { board, lastMove, winner } = result;

    this.server.to(move.gameId).emit('board', { board, lastMove });

    if (winner) {
      this.server.to(move.gameId).emit('win', `${winner} wins!`);
      this.roomService.resetRoom(move.gameId);
    this.server.to(move.gameId).emit('reset');
    }
  }
}

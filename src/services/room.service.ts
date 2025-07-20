import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private rooms = new Map<
    string,
    {
      board: string[][];
      turn: 'X' | 'O';
      players: { socketId: string; symbol: string }[];
    }
  >();

  addPlayer(socketId: string, roomId?: string) {
    if (!roomId || !this.rooms.has(roomId)) {
      roomId = Date.now().toString();
      this.rooms.set(roomId, {
        board: Array.from({ length: 15 }, () => Array(15).fill('')),
        turn: 'X',
        players: [],
      });
    }

    const room = this.rooms.get(roomId);
    const symbol = room.players.length === 0 ? 'X' : 'O';
    room.players.push({ socketId, symbol });

    return { newRoomId: roomId, symbol };
  }

  isReady(roomId: string) {
    return this.rooms.get(roomId)?.players.length === 2;
  }

  getAllRooms() {
    return Array.from(this.rooms.keys());
  }

  makeMove(roomId: string, socketId: string, row: number, col: number) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const player = room.players.find(p => p.socketId === socketId);
    if (!player || room.turn !== player.symbol) return null;

    if (room.board[row][col] !== '') return null;

    room.board[row][col] = player.symbol;

    const winner = this.checkWin(room.board, row, col, player.symbol)
      ? player.symbol
      : null;

    if (!winner) {
      room.turn = room.turn === 'X' ? 'O' : 'X';
    }

    return {
      board: room.board,
      lastMove: { row, col, player: player.symbol },
      winner,
    };
  }

  checkWin(board: string[][], r: number, c: number, symbol: string): boolean {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let k = 1; k <= 4; k++) {
        if (board[r + k * dr]?.[c + k * dc] === symbol) count++;
        else break;
      }
      for (let k = 1; k <= 4; k++) {
        if (board[r - k * dr]?.[c - k * dc] === symbol) count++;
        else break;
      }
      if (count >= 5) return true;
    }
    return false;
  }

  resetRoom(roomId: string) {
  const room = this.rooms.get(roomId);
  if (!room) return;

  room.board = Array.from({ length: 15 }, () => Array(15).fill(''));
  room.turn = 'X';
}

}

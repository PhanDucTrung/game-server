import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

export type Room = {
  id: string;
  players: { socket: Socket; symbol: string }[];
  board: string[][];
  turn: string;
  gameOver: boolean;
};

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  getRooms() {
    // chỉ trả về những room có < 2 người chơi
    return [...this.rooms.values()]
      .filter(room => room.players.length < 2)
      .map(room => room.id);
  }

  createRoom(): Room {
    const id = Math.random().toString(36).substr(2, 6);
    const room: Room = {
      id,
      players: [],
      board: Array.from({ length: 15 }, () => Array(15).fill('')),
      turn: 'X',
      gameOver: false,
    };
    this.rooms.set(id, room);
    return room;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  addPlayerToRoom(room: Room, socket: Socket, symbol: string) {
    if (room.players.length >= 2) {
      throw new Error('Room full');
    }
    room.players.push({ socket, symbol });
  }

  removePlayerFromRoom(socket: Socket) {
    for (const room of this.rooms.values()) {
      const idx = room.players.findIndex(p => p.socket === socket);
      if (idx >= 0) {
        room.players.splice(idx, 1);

        if (room.players.length === 0) {
          this.rooms.delete(room.id);
        } else {
          room.board = Array.from({ length: 15 }, () => Array(15).fill(''));
          room.turn = 'X';
          room.gameOver = false;
        }

        break;
      }
    }
  }
}

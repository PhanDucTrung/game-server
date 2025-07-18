import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/services/room.service';

type Game = {
  id: string;
  players: { socket: Socket; symbol: string }[];
  board: string[][];
  turn: string;
  gameOver: boolean;
};

@WebSocketGateway()
export class CaroGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  /**
   * Khi client mới kết nối: gửi danh sách phòng đang mở
   */
  handleConnection(client: Socket) {
    const openRooms = this.roomService.getRooms();
    client.emit('rooms', openRooms);
  }

  /**
   * Khi client yêu cầu join phòng
   */
  @SubscribeMessage('join')
  handleJoin(client: Socket, roomId?: string) {
    let room = roomId ? this.roomService.getRoom(roomId) : undefined;

    if (!room) {
      room = this.roomService.createRoom();
    }

    if (room.players.length >= 2) {
      client.emit('error', 'Room full');
      return;
    }

    const symbol = room.players.length === 0 ? 'X' : 'O';
    room.players.push({ socket: client, symbol });

    client.data.roomId = room.id;
    client.emit('player', { symbol, roomId: room.id });
    client.join(room.id);

    if (room.players.length === 2) {
      this.server.to(room.id).emit('start', 'Game Start! X goes first.');
    }

    this.server.emit('rooms', this.roomService.getRooms());
  }

  /**
   * Khi client ngắt kết nối
   */
  handleDisconnect(client: Socket) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    const room = this.roomService.getRoom(roomId);
    if (!room) return;

    room.players = room.players.filter(p => p.socket !== client);

    if (room.players.length === 0) {
      this.roomService.removePlayerFromRoom(roomId);
    } else {
      this.resetGame(room);
      this.server.to(room.id).emit('reset');
    }

    this.server.emit('rooms', this.roomService.getRooms());
  }

  /**
   * Khi client gửi nước đi
   */
  @SubscribeMessage('move')
  handleMove(client: Socket, data: { row: number; col: number; gameId: string }) {
    const game = this.roomService.getRoom(data.gameId);
    if (!game || game.gameOver) return;

    const playerObj = game.players.find(p => p.socket === client);
    if (!playerObj || playerObj.symbol !== game.turn) return;

    const { row, col } = data;
    if (game.board[row][col] !== '') return;

    game.board[row][col] = playerObj.symbol;

    this.server.to(game.id).emit('board', {
      board: game.board,
      lastMove: { row, col, player: playerObj.symbol },
    });

    if (this.checkWin(game.board, row, col, playerObj.symbol)) {
      game.gameOver = true;
      this.server.to(game.id).emit('win', `${playerObj.symbol} wins!`);
      this.resetGame(game);
      return;
    }

    game.turn = game.turn === 'X' ? 'O' : 'X';
  }

  /**
   * Reset bàn cờ
   */
  resetGame(game: Game) {
    game.board = Array.from({ length: 15 }, () => Array(15).fill(''));
    game.turn = 'X';
    game.gameOver = false;
  }

  /**
   * Kiểm tra thắng
   */
  checkWin(board: string[][], r: number, c: number, p: string): boolean {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    for (const { dr, dc } of directions) {
      let count = 1;
      for (let d = 1; d <= 4; d++) {
        if (board[r + dr * d]?.[c + dc * d] === p) count++;
        else break;
      }
      for (let d = 1; d <= 4; d++) {
        if (board[r - dr * d]?.[c - dc * d] === p) count++;
        else break;
      }
      if (count >= 5) return true;
    }
    return false;
  }
}

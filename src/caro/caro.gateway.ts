import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class CaroGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  players: Socket[] = [];
  board: string[][] = Array.from({ length: 15 }, () => Array(15).fill(''));
  turn = 'X';
  gameOver = false;

  handleConnection(client: Socket) {
    if (this.players.length < 2) {
      this.players.push(client);
      client.emit('player', this.players.length === 1 ? 'X' : 'O');
      if (this.players.length === 2) {
        this.server.emit('start', 'Game Start! X goes first.');
      }
    } else {
      client.emit('full', 'Game room is full.');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.players = this.players.filter((c) => c !== client);
    this.resetGame();
    this.server.emit('reset');
  }

  @SubscribeMessage('move')
  handleMove(client: Socket, data: { row: number; col: number; player: string }) {
    if (this.gameOver) return;
    if (data.player !== this.turn) return;

    const { row, col, player } = data;
    if (this.board[row][col] !== '') return;

    this.board[row][col] = player;
    this.server.emit('board', { board: this.board, lastMove: { row, col, player } });

    if (this.checkWin(row, col, player)) {
      this.gameOver = true;
      this.server.emit('win', `${player} wins!`);
      return;
    }

    this.turn = this.turn === 'X' ? 'O' : 'X';
  }

  resetGame() {
    this.board = Array.from({ length: 15 }, () => Array(15).fill(''));
    this.turn = 'X';
    this.gameOver = false;
  }

  checkWin(r: number, c: number, p: string): boolean {
    const directions = [
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 1, dc: 1 },
      { dr: 1, dc: -1 },
    ];
    for (const { dr, dc } of directions) {
      let count = 1;
      for (let d = 1; d <= 4; d++) {
        if (this.board[r + dr * d]?.[c + dc * d] === p) count++;
        else break;
      }
      for (let d = 1; d <= 4; d++) {
        if (this.board[r - dr * d]?.[c - dc * d] === p) count++;
        else break;
      }
      if (count >= 5) return true;
    }
    return false;
  }
}

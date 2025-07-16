import { Injectable } from '@nestjs/common';

@Injectable()
export class CaroService {
  private boards: Map<string, string[][]> = new Map();

  createBoard(roomId: string): string[][] {
    const board = Array.from({ length: 15 }, () => Array(15).fill(''));
    this.boards.set(roomId, board);
    return board;
  }

  play(roomId: string, x: number, y: number, player: string): boolean {
    const board = this.boards.get(roomId);
    if (!board) return false;

    if (board[x][y] === '') {
      board[x][y] = player;
      return true;
    }

    return false;
  }

  checkWin(board: string[][], player: string): boolean {
    // TODO: implement thuật toán check thắng
    return false;
  }

  getBoard(roomId: string): string[][] | undefined {
    return this.boards.get(roomId);
  }
}

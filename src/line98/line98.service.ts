import { Injectable } from '@nestjs/common';

@Injectable()
export class Line98Service {
  private gameState: { board: number[][]; nextBalls: number[] ;isFirstMove};

  constructor() {
    this.resetGame();
  }
resetGame() {
  this.gameState = {
    board: this.createEmptyBoard(),
    nextBalls: this.generateNextBalls(),
    isFirstMove: true,
  };

  // Lượt đầu: đặt 3 bóng TO
  this.placeRandomBalls(this.gameState.nextBalls, false);

  // chuẩn bị nextBalls mới cho lượt sau
  this.gameState.nextBalls = this.generateNextBalls();
}



  createEmptyBoard(): number[][] {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  generateNextBalls(): number[] {
    return [this.randomColor(), this.randomColor(), this.randomColor()];
  }

  randomColor(): number {
    return Math.floor(Math.random() * 7) + 1; // 1-7 màu
  }

 placeRandomBalls(colors: number[], isPreview = false) {
  colors.forEach((color) => {
    let placed = false;
    while (!placed) {
      const x = Math.floor(Math.random() * 9);
      const y = Math.floor(Math.random() * 9);
      if (this.gameState.board[x][y] === 0) {
        this.gameState.board[x][y] = isPreview ? -color : color;
        placed = true;
      }
    }
  });
}


isWalkable(x: number, y: number): boolean {
  return this.gameState.board[x][y] === 0 || this.gameState.board[x][y] < 0;
}
checkAndClearLines() {
  const board = this.gameState.board;
  const directions = [
    [1, 0],  // ngang
    [0, 1],  // dọc
    [1, 1],  // chéo \
    [1, -1], // chéo /
  ];

  const toClear: [number, number][] = [];

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      const color = board[x][y];
      if (color <= 0) continue; // bỏ qua ô trống hoặc bóng nhỏ

      directions.forEach(([dx, dy]) => {
        const line: [number, number][] = [[x, y]];
        let nx = x + dx;
        let ny = y + dy;

        while (
          nx >= 0 &&
          nx < 9 &&
          ny >= 0 &&
          ny < 9 &&
          board[nx][ny] === color
        ) {
          line.push([nx, ny]);
          nx += dx;
          ny += dy;
        }

        if (line.length >= 5) {
          toClear.push(...line);
        }
      });
    }
  }

  // Xóa các ô
  toClear.forEach(([x, y]) => {
    board[x][y] = 0;
  });
}
findPath(from: [number, number], to: [number, number]): [number, number][] | null {
  const board = this.gameState.board;

  const isWalkable = (x: number, y: number) => {
    return board[x][y] === 0 || board[x][y] < 0;
  };

  const queue: [number, number][] = [from];
  const visited = Array.from({ length: 9 }, () => Array(9).fill(false));
  const cameFrom = Array.from({ length: 9 }, () => Array<[number, number] | null>(9).fill(null));

  visited[from[0]][from[1]] = true;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === to[0] && y === to[1]) {
      // reconstruct path
      const path: [number, number][] = [];
      let curr: [number, number] | null = [x, y];
      while (curr) {
        path.push(curr);
        curr = cameFrom[curr[0]][curr[1]];
      }
      path.reverse();
      return path;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && !visited[nx][ny] && isWalkable(nx, ny)) {
        visited[nx][ny] = true;
        cameFrom[nx][ny] = [x, y];
        queue.push([nx, ny]);
      }
    }
  }

  return null; // không tìm thấy đường
}


moveBall(from: [number, number], to: [number, number], path: [number, number][]): boolean {
  const board = this.gameState.board;

  const [fx, fy] = from;
  const [tx, ty] = to;

  if (board[fx][fy] <= 0) {
    return false;
  }

  board[tx][ty] = board[fx][fy];
  board[fx][fy] = 0;

  if (!this.gameState.isFirstMove) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] < 0) {
          board[i][j] = -board[i][j];
        }
      }
    }
  } else {
    this.gameState.isFirstMove = false;
  }

  this.checkAndClearLines();
  this.placeRandomBalls(this.gameState.nextBalls, true);
  this.gameState.nextBalls = this.generateNextBalls();

  return true;
}




  getGameState() {
    return this.gameState;
  }
}

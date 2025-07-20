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

moveBall(from: [number, number], to: [number, number], path: [number, number][]): boolean {
  const board = this.gameState.board;

  const [fx, fy] = from;
  const [tx, ty] = to;

  if (board[fx][fy] <= 0) {
    return false;
  }

  const movingValue = board[fx][fy];

  // Nếu đích đang là bóng nhỏ (<0), ghi đè lên
  if (board[tx][ty] < 0) {
    board[tx][ty] = movingValue;
  } else {
    board[tx][ty] = movingValue;
  }

  board[fx][fy] = 0;

  // Lật lại preview bóng nhỏ thành bóng to nếu chưa
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

  // Thêm bóng preview cho lượt sau
  this.placeRandomBalls(this.gameState.nextBalls, true);
  this.gameState.nextBalls = this.generateNextBalls();

  return true;
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
checkAndClearLines(): boolean {
  const board = this.gameState.board;
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];
  const toClear: [number, number][] = [];

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      const color = board[x][y];
      if (color <= 0) continue;

      directions.forEach(([dx, dy]) => {
        const line: [number, number][] = [[x, y]];
        let nx = x + dx, ny = y + dy;

        while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && board[nx][ny] === color) {
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

  toClear.forEach(([x, y]) => board[x][y] = 0);
  return toClear.length > 0;
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


moveBallOnly(from: [number, number], to: [number, number]) {
  const board = this.gameState.board;

  const [fx, fy] = from;
  const [tx, ty] = to;

  if (board[fx][fy] <= 0) return false;

  board[tx][ty] = board[fx][fy];
  board[fx][fy] = 0;

  return true;
}

postMove() {
  if (!this.gameState.isFirstMove) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.gameState.board[i][j] < 0) {
          this.gameState.board[i][j] = -this.gameState.board[i][j];
        }
      }
    }
  } else {
    this.gameState.isFirstMove = false;
  }

  this.checkAndClearLines();
  this.placeRandomBalls(this.gameState.nextBalls, true);
  this.gameState.nextBalls = this.generateNextBalls();
}

checkLinesAt([x, y]: [number, number], color: number): number {
  const directions = [[1,0], [0,1], [1,1], [1,-1]];
  let max = 1;

  for (const [dx, dy] of directions) {
    let count = 1;

    for (let dir = -1; dir <=1; dir+=2) {
      let nx = x + dx*dir;
      let ny = y + dy*dir;
      while (nx >=0 && nx<9 && ny>=0 && ny<9 && this.gameState.board[nx][ny] === color) {
        count++;
        nx += dx*dir;
        ny += dy*dir;
      }
    }

    max = Math.max(max, count);
  }

  return max;
}

potentialScoreAt([x, y]: [number, number], color: number): number {
  // đếm tổng các ô đồng màu liền kề
  let score = 0;
  const directions = [[1,0], [0,1], [1,1], [1,-1]];

  for (const [dx, dy] of directions) {
    let count = 1;

    for (let dir = -1; dir <=1; dir+=2) {
      let nx = x + dx*dir;
      let ny = y + dy*dir;
      while (nx >=0 && nx<9 && ny>=0 && ny<9 && this.gameState.board[nx][ny] === color) {
        count++;
        nx += dx*dir;
        ny += dy*dir;
      }
    }

    score += count;
  }

  return score;
}


findBestMove(): { from: [number, number], to: [number, number], path: [number, number][] } | null {
  const board = this.gameState.board;

  let bestMove: any = null;
  let bestScore = -Infinity;

  for (let x1 = 0; x1 < 9; x1++) {
    for (let y1 = 0; y1 < 9; y1++) {
      const color = board[x1][y1];
      if (color <= 0) continue;

      for (let x2 = 0; x2 < 9; x2++) {
        for (let y2 = 0; y2 < 9; y2++) {
          if (board[x2][y2] !== 0) continue;

          const path = this.findPath([x1, y1], [x2, y2]);
          if (!path) continue;

          // Giả lập
          board[x2][y2] = color;
          board[x1][y1] = 0;

          let score = 0;

          if (this.checkLinesAt([x2, y2], color) >= 5) {
            score = 1000; // ưu tiên cao nhất
          } else {
            score = this.potentialScoreAt([x2, y2], color);
          }

          // Undo
          board[x1][y1] = color;
          board[x2][y2] = 0;

          if (score > bestScore) {
            bestScore = score;
            bestMove = { from: [x1, y1], to: [x2, y2], path };
          }
        }
      }
    }
  }

  return bestMove;
}
findPotentialMoves(): { from: [number, number], to: [number, number], priority: number }[] {
  const board = this.gameState.board;
  const moves: { from: [number, number], to: [number, number], priority: number }[] = [];

  for (let x1 = 0; x1 < 9; x1++) {
    for (let y1 = 0; y1 < 9; y1++) {
      const color = board[x1][y1];
      if (color <= 0) continue;

      for (let x2 = 0; x2 < 9; x2++) {
        for (let y2 = 0; y2 < 9; y2++) {
          if (!this.isWalkable(x2, y2)) continue;
          const path = this.findPath([x1, y1], [x2, y2]);
          if (!path) continue;

          // giả lập di chuyển
          board[x1][y1] = 0;
          board[x2][y2] = color;

          const lineLen = this.countLineLength(x2, y2, color);

          board[x2][y2] = 0;
          board[x1][y1] = color;

          let priority = 4;
          if (lineLen >= 5) priority = 1;
          else if (lineLen === 4) priority = 2;
          else if (lineLen === 3) priority = 3;

          if (priority < 4) {
            moves.push({ from: [x1, y1], to: [x2, y2], priority });
          }
        }
      }
    }
  }

  moves.sort((a, b) => a.priority - b.priority);
  return moves;
}

countLineLength(x: number, y: number, color: number): number {
  const board = this.gameState.board;
  let max = 1;

  const directions = [
    [[1, 0], [-1, 0]],
    [[0, 1], [0, -1]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]],
  ];

  for (const [dir1, dir2] of directions) {
    let count = 1;

    for (const [dx, dy] of [dir1, dir2]) {
      let nx = x + dx, ny = y + dy;
      while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && Math.abs(board[nx][ny]) === color) {
        count++;
        nx += dx;
        ny += dy;
      }
    }

    max = Math.max(max, count);
  }

  return max;
}




  getGameState() {
    return this.gameState;
  }
}

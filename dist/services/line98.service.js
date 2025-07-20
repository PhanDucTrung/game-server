"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line98Service = void 0;
const common_1 = require("@nestjs/common");
let Line98Service = class Line98Service {
    constructor() {
        this.resetGame();
    }
    resetGame() {
        this.gameState = {
            board: this.createEmptyBoard(),
            nextBalls: this.generateNextBalls(),
            isFirstMove: true,
        };
        this.placeRandomBalls(this.gameState.nextBalls, false);
        this.gameState.nextBalls = this.generateNextBalls();
    }
    moveBall(from, to, path) {
        const board = this.gameState.board;
        const [fx, fy] = from;
        const [tx, ty] = to;
        if (board[fx][fy] <= 0) {
            return false;
        }
        const movingValue = board[fx][fy];
        if (board[tx][ty] < 0) {
            board[tx][ty] = movingValue;
        }
        else {
            board[tx][ty] = movingValue;
        }
        board[fx][fy] = 0;
        if (!this.gameState.isFirstMove) {
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (board[i][j] < 0) {
                        board[i][j] = -board[i][j];
                    }
                }
            }
        }
        else {
            this.gameState.isFirstMove = false;
        }
        this.checkAndClearLines();
        this.placeRandomBalls(this.gameState.nextBalls, true);
        this.gameState.nextBalls = this.generateNextBalls();
        return true;
    }
    createEmptyBoard() {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }
    generateNextBalls() {
        return [this.randomColor(), this.randomColor(), this.randomColor()];
    }
    randomColor() {
        return Math.floor(Math.random() * 7) + 1;
    }
    placeRandomBalls(colors, isPreview = false) {
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
    isWalkable(x, y) {
        return this.gameState.board[x][y] === 0 || this.gameState.board[x][y] < 0;
    }
    checkAndClearLines() {
        const board = this.gameState.board;
        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];
        const toClear = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                const color = board[x][y];
                if (color <= 0)
                    continue;
                directions.forEach(([dx, dy]) => {
                    const line = [[x, y]];
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
    findPath(from, to) {
        const board = this.gameState.board;
        const isWalkable = (x, y) => {
            return board[x][y] === 0 || board[x][y] < 0;
        };
        const queue = [from];
        const visited = Array.from({ length: 9 }, () => Array(9).fill(false));
        const cameFrom = Array.from({ length: 9 }, () => Array(9).fill(null));
        visited[from[0]][from[1]] = true;
        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            if (x === to[0] && y === to[1]) {
                const path = [];
                let curr = [x, y];
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
        return null;
    }
    moveBallOnly(from, to) {
        const board = this.gameState.board;
        const [fx, fy] = from;
        const [tx, ty] = to;
        if (board[fx][fy] <= 0)
            return false;
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
        }
        else {
            this.gameState.isFirstMove = false;
        }
        this.checkAndClearLines();
        this.placeRandomBalls(this.gameState.nextBalls, true);
        this.gameState.nextBalls = this.generateNextBalls();
    }
    checkLinesAt([x, y], color) {
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        let max = 1;
        for (const [dx, dy] of directions) {
            let count = 1;
            for (let dir = -1; dir <= 1; dir += 2) {
                let nx = x + dx * dir;
                let ny = y + dy * dir;
                while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && this.gameState.board[nx][ny] === color) {
                    count++;
                    nx += dx * dir;
                    ny += dy * dir;
                }
            }
            max = Math.max(max, count);
        }
        return max;
    }
    potentialScoreAt([x, y], color) {
        let score = 0;
        const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (const [dx, dy] of directions) {
            let count = 1;
            for (let dir = -1; dir <= 1; dir += 2) {
                let nx = x + dx * dir;
                let ny = y + dy * dir;
                while (nx >= 0 && nx < 9 && ny >= 0 && ny < 9 && this.gameState.board[nx][ny] === color) {
                    count++;
                    nx += dx * dir;
                    ny += dy * dir;
                }
            }
            score += count;
        }
        return score;
    }
    findBestMove() {
        const board = this.gameState.board;
        let bestMove = null;
        let bestScore = -Infinity;
        for (let x1 = 0; x1 < 9; x1++) {
            for (let y1 = 0; y1 < 9; y1++) {
                const color = board[x1][y1];
                if (color <= 0)
                    continue;
                for (let x2 = 0; x2 < 9; x2++) {
                    for (let y2 = 0; y2 < 9; y2++) {
                        if (board[x2][y2] !== 0)
                            continue;
                        const path = this.findPath([x1, y1], [x2, y2]);
                        if (!path)
                            continue;
                        board[x2][y2] = color;
                        board[x1][y1] = 0;
                        let score = 0;
                        if (this.checkLinesAt([x2, y2], color) >= 5) {
                            score = 1000;
                        }
                        else {
                            score = this.potentialScoreAt([x2, y2], color);
                        }
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
    findPotentialMoves() {
        const board = this.gameState.board;
        const moves = [];
        for (let x1 = 0; x1 < 9; x1++) {
            for (let y1 = 0; y1 < 9; y1++) {
                const color = board[x1][y1];
                if (color <= 0)
                    continue;
                for (let x2 = 0; x2 < 9; x2++) {
                    for (let y2 = 0; y2 < 9; y2++) {
                        if (!this.isWalkable(x2, y2))
                            continue;
                        const path = this.findPath([x1, y1], [x2, y2]);
                        if (!path)
                            continue;
                        board[x1][y1] = 0;
                        board[x2][y2] = color;
                        const lineLen = this.countLineLength(x2, y2, color);
                        board[x2][y2] = 0;
                        board[x1][y1] = color;
                        let priority = 4;
                        if (lineLen >= 5)
                            priority = 1;
                        else if (lineLen === 4)
                            priority = 2;
                        else if (lineLen === 3)
                            priority = 3;
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
    countLineLength(x, y, color) {
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
};
exports.Line98Service = Line98Service;
exports.Line98Service = Line98Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Line98Service);
//# sourceMappingURL=line98.service.js.map
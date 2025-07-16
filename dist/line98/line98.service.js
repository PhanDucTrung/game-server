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
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ];
        const toClear = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                const color = board[x][y];
                if (color <= 0)
                    continue;
                directions.forEach(([dx, dy]) => {
                    const line = [[x, y]];
                    let nx = x + dx;
                    let ny = y + dy;
                    while (nx >= 0 &&
                        nx < 9 &&
                        ny >= 0 &&
                        ny < 9 &&
                        board[nx][ny] === color) {
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
        toClear.forEach(([x, y]) => {
            board[x][y] = 0;
        });
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
    moveBall(from, to, path) {
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
        }
        else {
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
};
exports.Line98Service = Line98Service;
exports.Line98Service = Line98Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Line98Service);
//# sourceMappingURL=line98.service.js.map
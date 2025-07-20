"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
let RoomService = class RoomService {
    constructor() {
        this.rooms = new Map();
    }
    addPlayer(socketId, roomId) {
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
    isReady(roomId) {
        return this.rooms.get(roomId)?.players.length === 2;
    }
    getAllRooms() {
        return Array.from(this.rooms.keys());
    }
    makeMove(roomId, socketId, row, col) {
        const room = this.rooms.get(roomId);
        if (!room)
            return null;
        const player = room.players.find(p => p.socketId === socketId);
        if (!player || room.turn !== player.symbol)
            return null;
        if (room.board[row][col] !== '')
            return null;
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
    checkWin(board, r, c, symbol) {
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1],
        ];
        for (const [dr, dc] of directions) {
            let count = 1;
            for (let k = 1; k <= 4; k++) {
                if (board[r + k * dr]?.[c + k * dc] === symbol)
                    count++;
                else
                    break;
            }
            for (let k = 1; k <= 4; k++) {
                if (board[r - k * dr]?.[c - k * dc] === symbol)
                    count++;
                else
                    break;
            }
            if (count >= 5)
                return true;
        }
        return false;
    }
    resetRoom(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.board = Array.from({ length: 15 }, () => Array(15).fill(''));
        room.turn = 'X';
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
//# sourceMappingURL=room.service.js.map
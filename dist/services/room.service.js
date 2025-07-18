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
    getRooms() {
        return [...this.rooms.values()]
            .filter(room => room.players.length < 2)
            .map(room => room.id);
    }
    createRoom() {
        const id = Math.random().toString(36).substr(2, 6);
        const room = {
            id,
            players: [],
            board: Array.from({ length: 15 }, () => Array(15).fill('')),
            turn: 'X',
            gameOver: false,
        };
        this.rooms.set(id, room);
        return room;
    }
    getRoom(id) {
        return this.rooms.get(id);
    }
    addPlayerToRoom(room, socket, symbol) {
        if (room.players.length >= 2) {
            throw new Error('Room full');
        }
        room.players.push({ socket, symbol });
    }
    removePlayerFromRoom(socket) {
        for (const room of this.rooms.values()) {
            const idx = room.players.findIndex(p => p.socket === socket);
            if (idx >= 0) {
                room.players.splice(idx, 1);
                if (room.players.length === 0) {
                    this.rooms.delete(room.id);
                }
                else {
                    room.board = Array.from({ length: 15 }, () => Array(15).fill(''));
                    room.turn = 'X';
                    room.gameOver = false;
                }
                break;
            }
        }
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)()
], RoomService);
//# sourceMappingURL=room.service.js.map
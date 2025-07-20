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
exports.CaroService = void 0;
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
let CaroService = class CaroService {
    constructor(roomService) {
        this.roomService = roomService;
    }
    handleJoin(client, roomId) {
        const { newRoomId, symbol } = this.roomService.addPlayer(client.id, roomId);
        client.join(newRoomId);
        client.emit('player', { symbol, roomId: newRoomId });
        if (this.roomService.isReady(newRoomId)) {
            this.server.to(newRoomId).emit('start', 'Game Start! X goes first.');
        }
        this.server.emit('rooms', this.roomService.getAllRooms());
    }
    handleMove(client, move) {
        const result = this.roomService.makeMove(move.gameId, client.id, move.row, move.col);
        if (!result)
            return;
        const { board, lastMove, winner } = result;
        this.server.to(move.gameId).emit('board', { board, lastMove });
        if (winner) {
            this.server.to(move.gameId).emit('win', `${winner} wins!`);
            this.roomService.resetRoom(move.gameId);
            this.server.to(move.gameId).emit('reset');
        }
    }
};
exports.CaroService = CaroService;
exports.CaroService = CaroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], CaroService);
//# sourceMappingURL=caro.service.js.map
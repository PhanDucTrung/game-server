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
exports.CaroGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const room_service_1 = require("../services/room.service");
let CaroGateway = class CaroGateway {
    constructor(roomService) {
        this.roomService = roomService;
    }
    handleConnection(client) {
        const openRooms = this.roomService.getRooms();
        client.emit('rooms', openRooms);
    }
    handleJoin(client, roomId) {
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
    handleDisconnect(client) {
        const roomId = client.data.roomId;
        if (!roomId)
            return;
        const room = this.roomService.getRoom(roomId);
        if (!room)
            return;
        room.players = room.players.filter(p => p.socket !== client);
        if (room.players.length === 0) {
            this.roomService.removePlayerFromRoom(roomId);
        }
        else {
            this.resetGame(room);
            this.server.to(room.id).emit('reset');
        }
        this.server.emit('rooms', this.roomService.getRooms());
    }
    handleMove(client, data) {
        const game = this.roomService.getRoom(data.gameId);
        if (!game || game.gameOver)
            return;
        const playerObj = game.players.find(p => p.socket === client);
        if (!playerObj || playerObj.symbol !== game.turn)
            return;
        const { row, col } = data;
        if (game.board[row][col] !== '')
            return;
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
    resetGame(game) {
        game.board = Array.from({ length: 15 }, () => Array(15).fill(''));
        game.turn = 'X';
        game.gameOver = false;
    }
    checkWin(board, r, c, p) {
        const directions = [
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 1, dc: 1 },
            { dr: 1, dc: -1 },
        ];
        for (const { dr, dc } of directions) {
            let count = 1;
            for (let d = 1; d <= 4; d++) {
                if (board[r + dr * d]?.[c + dc * d] === p)
                    count++;
                else
                    break;
            }
            for (let d = 1; d <= 4; d++) {
                if (board[r - dr * d]?.[c - dc * d] === p)
                    count++;
                else
                    break;
            }
            if (count >= 5)
                return true;
        }
        return false;
    }
};
exports.CaroGateway = CaroGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CaroGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], CaroGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CaroGateway.prototype, "handleMove", null);
exports.CaroGateway = CaroGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], CaroGateway);
//# sourceMappingURL=caro.gateway.js.map
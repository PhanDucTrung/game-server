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
exports.Line98Gateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const line98_service_1 = require("./line98.service");
let Line98Gateway = class Line98Gateway {
    constructor(line98Service) {
        this.line98Service = line98Service;
    }
    handleGetState() {
        const state = this.line98Service.getGameState();
        this.server.emit('state', state);
    }
    handleReset() {
        this.line98Service.resetGame();
        const state = this.line98Service.getGameState();
        this.server.emit('state', state);
    }
    handleMoveBall(client, payload) {
        const { from, to } = payload;
        const path = this.line98Service.findPath(from, to);
        if (!path) {
            client.emit('invalidMove');
            return;
        }
        this.line98Service.moveBall(from, to, path);
        const state = this.line98Service.getGameState();
        client.emit('moveResult', { board: state.board, path });
        this.server.emit('state', state);
    }
};
exports.Line98Gateway = Line98Gateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], Line98Gateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('getState'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Line98Gateway.prototype, "handleGetState", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Line98Gateway.prototype, "handleReset", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('moveBall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], Line98Gateway.prototype, "handleMoveBall", null);
exports.Line98Gateway = Line98Gateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [line98_service_1.Line98Service])
], Line98Gateway);
//# sourceMappingURL=line98.gateway.js.map
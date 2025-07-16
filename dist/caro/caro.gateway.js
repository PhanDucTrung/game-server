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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaroGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const caro_service_1 = require("./caro.service");
let CaroGateway = class CaroGateway {
    constructor(caroService) {
        this.caroService = caroService;
    }
    handlePlay(data) {
        const roomId = 'default';
        let board = this.caroService.getBoard(roomId);
        if (!board) {
            board = this.caroService.createBoard(roomId);
        }
        const ok = this.caroService.play(roomId, data.x, data.y, data.player);
        if (ok) {
            this.server.emit('board', board);
        }
    }
};
exports.CaroGateway = CaroGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CaroGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('play'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CaroGateway.prototype, "handlePlay", null);
exports.CaroGateway = CaroGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [caro_service_1.CaroService])
], CaroGateway);
//# sourceMappingURL=caro.gateway.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaroModule = void 0;
const common_1 = require("@nestjs/common");
const caro_service_1 = require("../services/caro.service");
const caro_gateway_1 = require("../gateways/caro.gateway");
const room_service_1 = require("../services/room.service");
let CaroModule = class CaroModule {
};
exports.CaroModule = CaroModule;
exports.CaroModule = CaroModule = __decorate([
    (0, common_1.Module)({
        providers: [caro_gateway_1.CaroGateway, caro_service_1.CaroService, room_service_1.RoomService],
    })
], CaroModule);
//# sourceMappingURL=caro.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const users_module_1 = require("./users.module");
const room_module_1 = require("./room.module");
const caro_module_1 = require("./caro.module");
const line98_gateway_1 = require("../gateways/line98.gateway");
const caro_gateway_1 = require("../gateways/caro.gateway");
const line98_service_1 = require("../services/line98.service");
const caro_service_1 = require("../services/caro.service");
const root_cotroller_1 = require("../controllers/root.cotroller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'frontend'),
            }),
            users_module_1.UsersModule,
            room_module_1.RoomModule,
            caro_module_1.CaroModule
        ],
        controllers: [root_cotroller_1.RootController],
        providers: [line98_gateway_1.Line98Gateway, caro_gateway_1.CaroGateway, line98_service_1.Line98Service, caro_service_1.CaroService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
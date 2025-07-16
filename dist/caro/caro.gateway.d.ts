import { Server } from 'socket.io';
import { CaroService } from './caro.service';
export declare class CaroGateway {
    private caroService;
    server: Server;
    constructor(caroService: CaroService);
    handlePlay(data: {
        x: number;
        y: number;
        player: string;
    }): void;
}

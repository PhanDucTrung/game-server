import { OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaroService } from '../services/caro.service';
export declare class CaroGateway implements OnGatewayInit {
    private readonly caroService;
    server: Server;
    constructor(caroService: CaroService);
    afterInit(server: Server): void;
    handleJoin(client: Socket, roomId?: string): void;
    handleMove(client: Socket, move: {
        row: number;
        col: number;
        gameId: string;
    }): void;
}

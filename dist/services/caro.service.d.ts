import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
export declare class CaroService {
    private readonly roomService;
    server: Server;
    constructor(roomService: RoomService);
    handleJoin(client: Socket, roomId?: string): void;
    handleMove(client: Socket, move: {
        row: number;
        col: number;
        gameId: string;
    }): void;
}

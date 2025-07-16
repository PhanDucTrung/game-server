import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from 'src/room/room.service';
type Game = {
    id: string;
    players: {
        socket: Socket;
        symbol: string;
    }[];
    board: string[][];
    turn: string;
    gameOver: boolean;
};
export declare class CaroGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomService;
    server: Server;
    constructor(roomService: RoomService);
    handleConnection(client: Socket): void;
    handleJoin(client: Socket, roomId?: string): void;
    handleDisconnect(client: Socket): void;
    handleMove(client: Socket, data: {
        row: number;
        col: number;
        gameId: string;
    }): void;
    resetGame(game: Game): void;
    checkWin(board: string[][], r: number, c: number, p: string): boolean;
}
export {};

import { Server, Socket } from 'socket.io';
import { Line98Service } from '../services/line98.service';
export declare class Line98Gateway {
    private readonly line98Service;
    server: Server;
    constructor(line98Service: Line98Service);
    getState(): void;
    reset(): void;
    handleMoveBall(client: Socket, payload: {
        from: [number, number];
        to: [number, number];
    }): void;
    handleGetHelp(client: Socket): void;
    handlePostMove(): void;
}

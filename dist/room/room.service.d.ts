import { Socket } from 'socket.io';
export type Room = {
    id: string;
    players: {
        socket: Socket;
        symbol: string;
    }[];
    board: string[][];
    turn: string;
    gameOver: boolean;
};
export declare class RoomService {
    private rooms;
    getRooms(): string[];
    createRoom(): Room;
    getRoom(id: string): Room | undefined;
    addPlayerToRoom(room: Room, socket: Socket, symbol: string): void;
    removePlayerFromRoom(socket: Socket): void;
}

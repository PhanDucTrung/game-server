export declare class RoomService {
    private rooms;
    addPlayer(socketId: string, roomId?: string): {
        newRoomId: string;
        symbol: string;
    };
    isReady(roomId: string): boolean;
    getAllRooms(): string[];
    makeMove(roomId: string, socketId: string, row: number, col: number): {
        board: string[][];
        lastMove: {
            row: number;
            col: number;
            player: "X" | "O";
        };
        winner: "X" | "O";
    };
    checkWin(board: string[][], r: number, c: number, symbol: string): boolean;
    resetRoom(roomId: string): void;
}

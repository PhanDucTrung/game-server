export declare class CaroService {
    private boards;
    createBoard(roomId: string): string[][];
    play(roomId: string, x: number, y: number, player: string): boolean;
    checkWin(board: string[][], player: string): boolean;
    getBoard(roomId: string): string[][] | undefined;
}

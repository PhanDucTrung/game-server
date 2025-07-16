export declare class Line98Service {
    private gameState;
    constructor();
    resetGame(): void;
    createEmptyBoard(): number[][];
    generateNextBalls(): number[];
    randomColor(): number;
    placeRandomBalls(colors: number[], isPreview?: boolean): void;
    isWalkable(x: number, y: number): boolean;
    checkAndClearLines(): void;
    findPath(from: [number, number], to: [number, number]): [number, number][] | null;
    moveBall(from: [number, number], to: [number, number], path: [number, number][]): boolean;
    getGameState(): {
        board: number[][];
        nextBalls: number[];
        isFirstMove: any;
    };
}

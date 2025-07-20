export declare class Line98Service {
    private gameState;
    constructor();
    resetGame(): void;
    moveBall(from: [number, number], to: [number, number], path: [number, number][]): boolean;
    createEmptyBoard(): number[][];
    generateNextBalls(): number[];
    randomColor(): number;
    placeRandomBalls(colors: number[], isPreview?: boolean): void;
    isWalkable(x: number, y: number): boolean;
    checkAndClearLines(): boolean;
    findPath(from: [number, number], to: [number, number]): [number, number][] | null;
    moveBallOnly(from: [number, number], to: [number, number]): boolean;
    postMove(): void;
    checkLinesAt([x, y]: [number, number], color: number): number;
    potentialScoreAt([x, y]: [number, number], color: number): number;
    findBestMove(): {
        from: [number, number];
        to: [number, number];
        path: [number, number][];
    } | null;
    findPotentialMoves(): {
        from: [number, number];
        to: [number, number];
        priority: number;
    }[];
    countLineLength(x: number, y: number, color: number): number;
    getGameState(): {
        board: number[][];
        nextBalls: number[];
        isFirstMove: any;
    };
}

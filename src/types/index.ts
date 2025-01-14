export interface PlayerType {
    name: string;
    score: number;
    tiles: TileType[];
}

export interface TileType {
    letter: string;
    pointValue: number;
}

export interface BoardType {
    tiles: (TileType | null)[][];
    placeTile(tile: TileType, x: number, y: number): boolean;
    isValidMove(tile: TileType, x: number, y: number): boolean;
    display(): void;
}
import { Square, SpecialSquare } from "./Square";
import { Tile } from "./Tile";

export class Board {

    public BOARD_SIZE = 15;

    private grid: (Square | null)[][];
    
    constructor() {
        this.grid = this.initializeBoard();
    }

    private initializeBoard(): Square[][] {
        const specialSquares: SpecialSquare[][] = this.initializeSpecialSquares();
        return Array.from({ length: this.BOARD_SIZE }, (_, x) =>
            Array.from({ length: this.BOARD_SIZE }, (_, y) => new Square(specialSquares[x][y]))
        );
    }

    private initializeSpecialSquares(): SpecialSquare[][] {
        const specialSquares: SpecialSquare[][] = Array.from({ length: this.BOARD_SIZE }, () => Array(this.BOARD_SIZE).fill(null));

        // Triple word squares
        const tripleWordPositions = [
            { x: 0, y: 0 }, { x: 0, y: Math.floor(this.BOARD_SIZE / 2) }, { x: 0, y: this.BOARD_SIZE - 1 },
            { x: Math.floor(this.BOARD_SIZE / 2), y: 0 }, { x: Math.floor(this.BOARD_SIZE / 2), y: this.BOARD_SIZE - 1 },
            { x: this.BOARD_SIZE - 1, y: 0 }, { x: this.BOARD_SIZE - 1, y: Math.floor(this.BOARD_SIZE / 2) }, { x: this.BOARD_SIZE - 1, y: this.BOARD_SIZE - 1 }
        ];

        // Double word squares
        for (let i = 1; i < 5; i++) {
            specialSquares[i][i] = 'double-word';
            specialSquares[i][this.BOARD_SIZE - 1 - i] = 'double-word';
            specialSquares[this.BOARD_SIZE - 1 - i][i] = 'double-word';
            specialSquares[this.BOARD_SIZE - 1 - i][this.BOARD_SIZE - 1 - i] = 'double-word';
        }
        // Center star
        specialSquares[Math.floor(this.BOARD_SIZE / 2)][Math.floor(this.BOARD_SIZE / 2)] = 'center-star';

        tripleWordPositions.forEach(pos => specialSquares[pos.x][pos.y] = 'triple-word');

        return specialSquares;
    }

    public placeTile(x: number, y: number, tile: Tile): boolean {
        const square = this.grid[x][y];
        if (square == null) {
            throw new Error(`Cannot place tile at position (${x}, ${y}) because the square is null.`);
        }
        return square.placeTile(tile);
    }

    public *gridIterator(): IterableIterator<{ x: number, y: number, square: Square }> {
        for (let x = 0; x < this.BOARD_SIZE; x++) {
            for (let y = 0; y < this.BOARD_SIZE; y++) {
                const square = this.grid[x][y];
                if (square === null) {
                    throw new Error(`Square at position (${x}, ${y}) is null.`);
                }
                yield { x, y, square: square };
            }
        }
    }
}
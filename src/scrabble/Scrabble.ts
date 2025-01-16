import { Board } from "./Board";
import { Player } from "./Player";
import { Tile } from './Tile';

class Scrabble {
    private players: Player[];
    private board: Board;
    private currentPlayerIndex: number;
    private gameStarted: boolean;

    constructor(boardSize: number = 15) {
        this.players = [];
        this.board = new Board(boardSize);
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
    }

    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    public startGame(): void {
        if (this.players.length < 2) {
            throw new Error("At least two players are required to start the game.");
        }
        this.gameStarted = true;
        this.currentPlayerIndex = 0;
    }

    public score(): number {
        return this.players[this.currentPlayerIndex].getScore();
    }

    public playTurn(tile: Tile, position: { x: number; y: number }): void {
        if (this.gameStarted === false) {
            throw new Error("At least two players are required to start the game.");
        }
        this.board.placeTile(position.x, position.y, tile);
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    public getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    public getBoard(): Board {
        return this.board;
    }
}

export default Scrabble;
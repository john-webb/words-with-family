// Core Scrabble Game Model

interface Player {
    name: string;
    rack: string[];
    score: number;
}

export class ScrabbleGame {
    private board: string[][];
    private players: Player[];
    private currentPlayerIndex: number;
    private letterBag: string[];
    private dictionary: Set<string>;

    constructor(playerNames: string[], dictionary: string[]) {
        this.board = Array.from({ length: 15 }, () => Array(15).fill(""));
        this.players = playerNames.map(name => ({ name, rack: [], score: 0 }));
        this.currentPlayerIndex = 0;
        this.letterBag = ScrabbleGame.initializeLetterBag();
        this.dictionary = new Set(dictionary.map(word => word.toUpperCase()));
    }

    // Initialize the letter bag with a finite distribution of letters
    private static initializeLetterBag(): string[] {
        const distribution: Record<string, number> = {
            A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1,
            K: 1, L: 4, M: 2, N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6,
            U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1
        };
        const bag: string[] = [];
        for (const [letter, count] of Object.entries(distribution)) {
            bag.push(...Array(count).fill(letter));
        }
        return bag.sort(() => Math.random() - 0.5); // Shuffle the bag
    }

    // Draw a letter from the bag
    private drawLetter(): string | null {
        return this.letterBag.pop() || null;
    }

    // Initialize racks for all players
    initializeRacks(): void {
        this.players.forEach(player => {
            while (player.rack.length < 7 && this.letterBag.length > 0) {
                const letter = this.drawLetter();
                if (letter) player.rack.push(letter);
            }
        });
    }

    // Shuffle the current player's rack
    shuffleRack(): void {
        const player = this.getCurrentPlayer();
        player.rack = player.rack.sort(() => Math.random() - 0.5);
    }

    // Get the current player's rack
    getCurrentPlayerRack(): string[] {
        return [...this.getCurrentPlayer().rack];
    }

    // Place a word on the board
    placeWord(row: number, col: number, word: string, direction: "horizontal" | "vertical"): boolean {
        word = word.toUpperCase();
        if (!this.dictionary.has(word)) {
            console.error(`Word "${word}" is not valid.`);
            return false;
        }

        const impactedWords = this.getImpactedWords(row, col, word, direction);

        if (impactedWords.some(w => !this.dictionary.has(w))) {
            console.error("One or more adjoining words are invalid.");
            return false;
        }

        if (!this.canPlaceWord(row, col, word, direction)) {
            return false;
        }

        for (let i = 0; i < word.length; i++) {
            const r = direction === "horizontal" ? row : row + i;
            const c = direction === "horizontal" ? col + i : col;
            this.board[r][c] = word[i];
        }

        this.updateScore(word);
        impactedWords.forEach(w => this.updateScore(w));

        return true;
    }

    // Get all words impacted by the placement
    private getImpactedWords(row: number, col: number, word: string, direction: "horizontal" | "vertical"): string[] {
        const words: string[] = [];

        const checkWord = (startRow: number, startCol: number, deltaRow: number, deltaCol: number) => {
            let r = startRow, c = startCol;
            let currentWord = "";

            while (r >= 0 && r < 15 && c >= 0 && c < 15 && this.board[r][c] !== "") {
                r -= deltaRow;
                c -= deltaCol;
            }

            r += deltaRow;
            c += deltaCol;

            while (r >= 0 && r < 15 && c >= 0 && c < 15 && this.board[r][c] !== "") {
                currentWord += this.board[r][c];
                r += deltaRow;
                c += deltaCol;
            }

            if (currentWord.length > 1) {
                words.push(currentWord);
            }
        };

        // Main word being placed
        words.push(word);

        for (let i = 0; i < word.length; i++) {
            const r = direction === "horizontal" ? row : row + i;
            const c = direction === "horizontal" ? col + i : col;

            // Check perpendicular words
            if (direction === "horizontal") {
                checkWord(r, c, 1, 0);
            } else {
                checkWord(r, c, 0, 1);
            }
        }

        return words;
    }

    // Check if a word can be placed
    private canPlaceWord(row: number, col: number, word: string, direction: "horizontal" | "vertical"): boolean {
        if (direction === "horizontal" && col + word.length > 15) return false;
        if (direction === "vertical" && row + word.length > 15) return false;

        for (let i = 0; i < word.length; i++) {
            const r = direction === "horizontal" ? row : row + i;
            const c = direction === "horizontal" ? col + i : col;
            if (this.board[r][c] !== "" && this.board[r][c] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    // Update the score for the current player
    private updateScore(word: string): void {
        const player = this.getCurrentPlayer();
        player.score += word.length * 10; // Example scoring: 10 points per letter
    }

    // Get the current score for the current player
    getCurrentPlayerScore(): number {
        return this.getCurrentPlayer().score;
    }

    // Get the current state of the board
    getBoard(): string[][] {
        return this.board.map(row => [...row]);
    }

    // Switch to the next player
    nextPlayer(): void {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // Get the current player's information
    private getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    // Get all players and their scores
    getPlayers(): Player[] {
        return this.players.map(player => ({ ...player }));
    }
}
class Square {
    private letter: string;
    private multiplier: {
        letter: number;
        word: number;
    };

    constructor() {
        this.letter = "";
        this.multiplier = {
            letter: 1,
            word: 1
        };
    }

    setLetter(letter: string): void {
        this.letter = letter.toUpperCase();
    }

    getLetter(): string {
        return this.letter;
    }

    isEmpty(): boolean {
        return this.letter === "";
    }

    setMultiplier(type: 'letter' | 'word', value: number): void {
        this.multiplier[type] = value;
    }

    getMultiplier(): { letter: number; word: number } {
        return { ...this.multiplier };
    }
}

class Board {
    private squares: Square[][];
    private static readonly BOARD_SIZE = 15;

    constructor() {
        this.squares = Array.from({ length: Board.BOARD_SIZE }, () =>
            Array.from({ length: Board.BOARD_SIZE }, () => new Square())
        );
        this.initializeMultipliers();
    }

    private initializeMultipliers(): void {
        // Triple Word Scores
        const tripleWordSquares = [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]];
        tripleWordSquares.forEach(([row, col]) => {
            this.squares[row][col].setMultiplier('word', 3);
        });

        // Double Word Scores
        for (let i = 1; i < 5; i++) {
            this.squares[i][i].setMultiplier('word', 2);
            this.squares[i][14-i].setMultiplier('word', 2);
            this.squares[14-i][i].setMultiplier('word', 2);
            this.squares[14-i][14-i].setMultiplier('word', 2);
        }

        // Triple Letter Scores
        const tripleLetterSquares = [
            [1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [5, 13],
            [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [13, 9]
        ];
        tripleLetterSquares.forEach(([row, col]) => {
            this.squares[row][col].setMultiplier('letter', 3);
        });

        // Double Letter Scores
        const doubleLetterSquares = [
            [0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14],
            [6, 2], [6, 6], [6, 8], [6, 12], [7, 3], [7, 11],
            [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14],
            [12, 6], [12, 8], [14, 3], [14, 11]
        ];
        doubleLetterSquares.forEach(([row, col]) => {
            this.squares[row][col].setMultiplier('letter', 2);
        doubleLetterSquares.forEach(([row, col]) => {
            this.squares[row][col].setMultiplier('letter', 2);
        });
    }

    // Place a letter on the board
    placeLetter(row: number, col: number, letter: string): boolean {
        if (row < 0 || row >= Board.BOARD_SIZE || col < 0 || col >= Board.BOARD_SIZE) {
            return false;
        }
        if (!this.squares[row][col].isEmpty()) {
            return false;
        }
        this.squares[row][col].setLetter(letter);
        return true;
    }

    // Get the letter at a specific position
    getLetter(row: number, col: number): string {
        if (row < 0 || row >= Board.BOARD_SIZE || col < 0 || col >= Board.BOARD_SIZE) {
            return '';
        }
        return this.squares[row][col].getLetter();
    }

    // Get the multiplier at a specific position
    getMultiplier(row: number, col: number): { letter: number; word: number } {
        if (row < 0 || row >= Board.BOARD_SIZE || col < 0 || col >= Board.BOARD_SIZE) {
            return { letter: 1, word: 1 };
        }
        return this.squares[row][col].getMultiplier();
    }

    // Check if a position is empty
    isEmpty(row: number, col: number): boolean {
        if (row < 0 || row >= Board.BOARD_SIZE || col < 0 || col >= Board.BOARD_SIZE) {
            return false;
        }
        return this.squares[row][col].isEmpty();
    }

    // Get the current state of the board
    getState(): string[][] {
        return this.squares.map(row => 
            row.map(square => square.getLetter())
        );
    }
}

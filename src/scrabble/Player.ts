export class Player {
    name: string;
    private score: number;
    tiles: string[];

    constructor(name: string) {
        this.name = name;
        this.score = 0;
        this.tiles = [];
    }

    public getScore(): number {
        return this.score;
    }

    addScore(points: number) {
        this.score += points;
    }

    addTile(tile: string) {
        this.tiles.push(tile);
    }

    removeTile(tile: string) {
        const index = this.tiles.indexOf(tile);
        if (index > -1) {
            this.tiles.splice(index, 1);
        }
    }
}
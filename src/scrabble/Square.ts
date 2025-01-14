import { Tile } from './Tile';

export type SpecialSquare = 
'double-word' | 
'triple-word' | 
'double-letter' | 
'triple-letter' | 
'center-star' | 
null;

export class Square {
    public tile: Tile | null;
    public special: SpecialSquare;

    constructor(special: SpecialSquare = null) {
        this.tile = null;
        this.special = special;
    }

    public placeTile(tile: Tile): boolean {
        if (this.tile === null) {
            this.tile = tile;
            return true;
        }
        return false;
    }
}
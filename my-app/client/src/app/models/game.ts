import { v4 as uuidv4 } from 'uuid';
import { Theme } from './theme';

/*
 * This is the game class. It contains all the information about the game.
 * It also contains the logic for making a move.
*/
export class Game {
    id : string;
    theme : Theme;
    status : String;
    start : String;
    finish : String;
    grid : String[][];

    constructor(theme : Theme, status : String, start : String, finish : String, grid : String[][]){
        this.id = uuidv4();
        this.theme = theme;
        this.status = status;
        this.start = start;
        this.finish = finish;
        this.grid = grid;
    }
}

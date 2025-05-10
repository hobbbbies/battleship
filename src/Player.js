import Gameboard from "./Gameboard";

export default class Player {
    constructor(size = 10) {
        this.gameboard = new Gameboard(size);
    }
}
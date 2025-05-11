import Gameboard from "./Gameboard";

export default class Player {
    constructor(team, size = 10) {
        this.team = team;
        this.gameboard = new Gameboard(size);
    }
}
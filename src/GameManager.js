import Player from './Player';
import render from './render';

export default class GameManager {
    constructor(boardSize) {
        this.player = new Player(boardSize);
        this.computer = new Player(boardSize);
        this.currentPlayer = this.player;
    }

    init() {
        // Initialize game state
        this.render();
    }

    render() {
        // Call your render function with the current game state
        render(this.player.gameboard, this.computer.gameboard);
    }
}
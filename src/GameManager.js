import Player from './Player';
import render from './render';

export default class GameManager {
    constructor(boardSize) {
        this.player = new Player("player", boardSize);
        this.computer = new Player("opponent", boardSize);
        this.turn = this.player;
    }

    init() {
        // Initialize game state
        this.render();
    }

    render() {
        // Call your render function with the current game state
        render(this, this.player, this.computer);
    }

    playTurn(x, y) {
        if(this.turn.gameboard.receiveAttack(x, y) === -1) {
            return -1;
        }
        this.turn = this.turn === this.player ? this.computer : this.player;
    }

    disableBoard(board) {
    }
}
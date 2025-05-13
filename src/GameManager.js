import Player from './Player';
import render from './render';
import findRandom from './findRandom';
import RenderUtils from './renderUtils';

export default class GameManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.player = new Player("player", boardSize);
        this.computer = new Player("opponent", boardSize);
        this.turn = this.player;
        this.gameStarted = false;
    }

    init() {
        // Initialize game state
        this.player.gameboard.init();
        this.computer.gameboard.init();
        this.render();
    }

    render() {
        // Call your render function with the current game state
        render(this, this.player, this.computer);
    }

    playTurn(x, y) {
        this.turn = this.turn === this.player ? this.computer : this.player;
        if(this.turn.gameboard.receiveAttack(x, y) === -1) {
            this.turn = this.turn === this.player ? this.computer : this.player; // Switch turn back
            return -1;
        }
    }

    cpuTurn() {
        if (this.turn !== this.computer) return;
        const { x , y } = findRandom(this.boardSize);
        if (this.playTurn(x, y) === -1) this.cpuTurn();
    }
}
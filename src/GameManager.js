import Player from './Player';
import render from './render';
import findRandom from './findRandom';
import RenderUtils from './renderUtils';
import Gameboard from './Gameboard';

export default class GameManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.player = new Player("player", boardSize);
        this.computer = new Player("opponent", boardSize);
        this.turn = this.player;
        this.gameStarted = false;
        this.playerShips = 0;
        this.computerShips = 0;
        this.winner = null;
    }

    init() {
        // Initialize game state
        this.player.gameboard.init();
        this.computer.gameboard.init();
        this.updateShipCount();
        this.render();
    }

    render() {
        // Call your render function with the current game state
        render(this, this.player, this.computer);
    }

    playTurn(x, y) {
        if(this.turn.gameboard.receiveAttack(x, y) === -1) {
            this.turn = this.turn === this.player ? this.computer : this.player; // Switch turn back
            return -1;
        }
        this.checkWin();
    }

    cpuTurn(lastHit = {}) {
        if (this.turn !== this.computer) return;
        if (Object.keys(lastHit).length > 0) this.smartHit(lastHit.x, lastHit.y);
        else {
            const { x, y } = findRandom(this.boardSize);
            if (this.playTurn(x, y) === -1) this.cpuTurn();
        }
    }

    smartHit(x, y) {
        let xNext = Math.floor(Math.random() * 3) - 1;
        let yNext;
        if (xNext === 0) {
            yNext = Math.random() < 0.5 ? -1 : 1; 
        } else yNext = 0;
        this.playTurn(xNext, yNext);
        if (this.player.gameboard.isShip(xNext, yNext) && !this.player.gameboard.set.has(`(${xNext}, ${yNext})`)) {
               this.cpuTurn({ xNext, yNext });
            }
    }

    updateBoardSize(newSize) {
        this.player.gameboard = new Gameboard(newSize);
        this.computer.gameboard = new Gameboard(newSize); 
        this.init();
    }

    updateShipCount() {
        this.playerShips = this.player.gameboard.getShipCount();
        this.computerShips = this.computer.gameboard.getShipCount();
    }

    checkWin() {
        this.updateShipCount();
        if (this.playerShips === 0 || this.computerShips === 0) {
            this.gameStarted = false;
            const winner = this.playerShips === 0 ? this.computer : this.player;
            this.winner = winner.team;
            return winner
        }
        return -1;
    }
}
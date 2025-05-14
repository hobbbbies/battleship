import Player from './Player';
import render from './render';
import findRandom from './findRandom';
import RenderUtils from './renderUtils';
import Gameboard from './Gameboard';
import Cpu from './Cpu';

export default class GameManager {
    constructor(boardSize) {
        this.boardSize = boardSize;
        this.player = new Player("player", boardSize);
        this.computer = new Player("opponent", boardSize);
        this.cpu = new Cpu(this);
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
        this.turn = this.turn === this.player ? this.computer : this.player;
        if(this.turn.gameboard.receiveAttack(x, y) === -1) {
            this.turn = this.turn === this.player ? this.computer : this.player; // Switch turn back
            return -1;
        }
        this.checkWin();
    }

    // cpuTurn() {
    //     if (this.turn !== this.computer) return;
    //     if (Object.keys(this.cpu.cpuLastHit).length > 0) cpu.smartHit(lastHit.x, lastHit.y);
    //     else {
    //         const { x, y } = findRandom(this.boardSize);
    //         if (this.playTurn(x, y) === -1) this.cpuTurn();
    //     }
    // }    

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
import findRandom from "./findRandom";

export default class Cpu {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    this.moveQueue = [];
    this.lastMove = {};
  }

  cpuTurn() {
        if (this.gameManager.turn !== this.gameManager.computer) return;
        if (this.moveQueue.length) {
            this.smartHit();
        }
        else {
            const { x, y } = findRandom(this.gameManager.boardSize);
            if (this.gameManager.playTurn(x, y) === -1) this.cpuTurn();
            else if (this.gameManager.player.gameboard.isShip(x, y, this.gameManager.player.gameboard.board)) {
                this.queueMoves(x, y);
                this.lastMove.x = x;
                this.lastMove.y = y;
            }
        }   
    }

    smartHit() {
        const { x, y } = this.moveQueue.pop();
        this.gameManager.playTurn(x, y);
        if (this.gameManager.player.gameboard.isShip(x, y, this.gameManager.player.gameboard.board)) {
          this.moveQueue = [];
          const direction = {
            x: x - this.lastMove.x,
            y: y - this.lastMove.y,
          };
          this.queueDirection(x, y, direction);

          // Pointer to the last hit ship coordiantes 
          this.lastMove.x = x;
          this.lastMove.y = y;
        }
    }

    // Function that queues next moves once the direction has been discovered
    // how do we get direction ?  
    // -Need difference in x y and last move 
    // -Keep property "last move" that holds only the last move played 
    queueDirection(x, y, direction) {
        const set = this.getSet();
        const newX = x + direction.x;
        const newY = y + direction.y;
        if (this.gameManager.player.gameboard.checkMove(newX, newY, set, this.gameManager.boardSize)) {
            this.moveQueue.push({ x: newX, y : newY });
        }
    }

    queueMoves(x, y) {
        const set = this.getSet();
        for (let i in this.directions) {
            const newX = x + this.directions[i].x;
            const newY = y + this.directions[i].y;
            if (this.gameManager.player.gameboard.checkMove(newX, newY, set, this.gameManager.boardSize)) {
                this.moveQueue.push({ x: newX, y: newY});
            }
        }
    }
  
  // Filters out illegal directions
  removeInvalidDirecitons() {
    for (let i = 0; i < this.directions.length; i++) {
        if (this.gameManager.player.gameboard.set.has(`(${this.directions[i].x}, ${this.directions[i].y})`)
            || this.gameManager.player.gameboard.checkCoordinateBounds) {
            this.directions.splice(i, 1);
        }
    }
  }

  randomFromArray(arr) {
    const idx = Math.floor(Math.random() * arr.length); // random index
    return idx
  }

  getSet() {
    return this.gameManager.player.gameboard.set;
  }
}
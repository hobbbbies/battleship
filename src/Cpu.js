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
    this.playerSet = gameManager.player.gameboard.set;
  }

  cpuTurn() {
        if (this.gameManager.turn !== this.gameManager.computer) return;
        if (this.moveQueue.length) {
            const { x, y } = this.moveQueue.pop();
            this.gameManager.playTurn(x, y);
            if (this.gameManager.player.gameboard.isShip(x, y)) {
              this.moveQueue = [];
              this.queueMoves(x, y);
            }
        }
        else {
            const { x, y } = findRandom(this.gameManager.boardSize);
            if (this.gameManager.playTurn(x, y) === -1) this.cpuTurn();
            else if (this.gameManager.player.gameboard.isShip(x, y)) {
                this.queueMoves(x, y);
            }
        }   
    }

    queueMoves(x, y) {
        for (let i in this.directions) {
            const newX = x + this.directions[i].x;
            const newY = y + this.directions[i].y;
            if (this.gameManager.player.gameboard.checkMove(newX, newY, this.playerSet)) {
                this.moveQueue.push({ x: newX, y: newY});
            }
        }
    }
  
  // Runs when the last cpu hit was a ship. It will try hit all adjascent ships until
  // it has hit every adjascent cell and has missed all shots.
  // If one of its adjascent cells is a ship, that becomes the new coordinates that
  // it will base smartHit off of
  
//   smartHit(x, y) {
//     this.removeInvalidDirecitons(this.directions);
//     const index = this.randomFromArray(this.directions);
//     const nextDirection = this.directions[index].pop();
//     const xNext = nextDirection.x + x;
//     const yNext = nextDirection.y + y;
     
//     this.gameManager.playTurn(xNext, yNext);
//     if (
//       this.gameManager.player.gameboard.isShip(xNext, yNext) &&
//       !this.gameManager.player.gameboard.set.has(`(${xNext}, ${yNext})`)
//     ) {
//       this.lastHit = { x: xNext, y: yNext };
//     } else {
//       this.lastHit = { x: x, y: y };
//     }
//   }

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
}
import findRandom from "./findRandom";

export default class Cpu {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.lastHit = {};
    this.directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];
    this.shipHit = false;
    
  }

  cpuTurn() {
        if (this.gameManager.turn !== this.gameManager.computer) return;
        if (Object.keys(this.lastHit).length > 0) {
            this.smartHit(lastHit.x, lastHit.y);
        }
        else {
            const { x, y } = findRandom(this.gameManager.boardSize);
            if (this.gameManager.playTurn(x, y) === -1) this.cpuTurn();
        }
    }
  
  // Runs when the last cpu hit was a ship. It will try hit all adjascent ships until
  // it has hit every adjascent cell and has missed all shots.
  // If one of its adjascent cells is a ship, that becomes the new coordinates that
  // it will base smartHit off of
  smartHit(x, y) {
    this.removeInvalidDirecitons(this.directions);
    const index = this.randomFromArray(this.directions);
    const nextDirection = this.directions[index].pop();
    const xNext = nextDirection.x + x;
    const yNext = nextDirection.y + y;
     
    this.gameManager.playTurn(xNext, yNext);
    if (
      this.gameManager.player.gameboard.isShip(xNext, yNext) &&
      !this.gameManager.player.gameboard.set.has(`(${xNext}, ${yNext})`)
    ) {
      this.lastHit = { x: xNext, y: yNext };
    } else {
      this.lastHit = { x: x, y: y };
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
}
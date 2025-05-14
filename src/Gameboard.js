import Ship from "./Ship";
import findRandom from "./findRandom";
import BoardUtils from "./BoardUtils";

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.set = new Set(); 
    this.freeSpots = Array.from({ length: size }, () => Array(size).fill(true));
  }

  isShip(x, y) {
    return BoardUtils.isShip(x, y, this.board);
  }

  checkCoordinateBounds(x, y) {
    return BoardUtils.checkCoordinateBounds(x, y, this.size);
  }

  getShipCount() {
    return BoardUtils.getShipCount(this);
  }

  checkMove(x, y, set) {
    return BoardUtils.checkMove(x, y, set);
  }

  init() {
    
    // Resets all local properties 
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.set = new Set();
    this.freeSpots = Array.from({ length: this.size }, () => Array(this.size).fill(true));
    
    const num = this.size / 2;

    const shipSizes = [];
    BoardUtils.calculateShipSizes(num, shipSizes);
    const shipCount = shipSizes.reduce((acc, item) => {
     return acc += item;
    }, 0);

    const tempArr = Array.from({ length: this.size }, () => Array(this.size).fill(true));

    for (let i = 0; i < num; i++) {
        const orientation = findRandom(2);
        const { xBoundry, yBoundry } = BoardUtils.findBoundaries(
            orientation.x,
            shipSizes[i],
            this.size
        );
        const { x, y } = findRandom(xBoundry, yBoundry);

        if (
            this.addShipRecursively(
                x,
                y,
                shipSizes[i],
                orientation.x,
                new Ship(shipSizes[i]),
                tempArr
            ) === -1
        ) {
            i--;
        }
    }
    // Redo everything if there was some bug generating the ships 
    // Terrible idea, I know.
    if (BoardUtils.getShipCount(this) < shipCount) this.init(num);
  }

  addShipRecursively(x, y, length, orientation, ship, tempArr) {
    if (length <= 0) {
      // Merges tempArr into freeSpots - necessary step for when addShip fails 
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          if (tempArr[y][x] === false) {
            this.freeSpots[y][x] = false;
          }
        }
      }
      return 1;
    };
    if (this.checkCoordinateBounds(x, y) || this.isShip(x, y) || this.freeSpots[y][x] === false) {
      if (orientation === 0) {
        this.deleteShip(x - 1, y, orientation);
      } else {
        this.deleteShip(x, y - 1, orientation);
      }
      return -1;
    };
    
    this.board[y][x] = ship;
    BoardUtils.flagSurrounding(tempArr, x, y, 3);

    // orientation 0: horizontal (increment x)
    // orientation 1: vertical (increment y)
    if (orientation === 0) {
      return this.addShipRecursively(x + 1, y, length - 1, orientation, ship, tempArr);
    } else {
      return this.addShipRecursively(x, y + 1, length - 1, orientation, ship, tempArr);
    }
  }

  deleteShip(x, y, orientation) {
    if (this.checkCoordinateBounds(x, y) || !this.isShip(x, y)) return 1;

    this.board[y][x] = null;
    if (orientation === 0) {
      return this.deleteShip(x - 1, y, orientation);
    } else {
      return this.deleteShip(x, y - 1, orientation);
    }

  }

  receiveAttack(x, y) {
    if (!this.checkMove(x, y, this.set))
      return -1;
    this.set.add(`(${x}, ${y})`);
    if (this.isShip(x, y)) {
      this.board[y][x].hit();
      return 1;
    } else {
      this.board[y][x] = "X";
      return 0;
    }
  }
}

import Ship from "./Ship";
import findRandom from "./findRandom";
import BoardManagement from "./boardManagement";

export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(null));
    this.set = new Set();
    this.freeSpots = Array.from({ length: size }, () => Array(size).fill(true));
  }

  isShip(x, y) {
    return BoardManagement.isShip(x, y, this.board);
  }

  checkCoordinateBounds(x, y) {
    return BoardManagement.checkCoordinateBounds(x, y, this.size);
  }

  checkPlacement(x, y, length, orientation) {
    return BoardManagement.checkPlacement(x, y, length, this.freeSpots, orientation);
  }

  init(num) {
    const shipSizes = [5, 4, 3, 2, 1];
    // Testing positions - commented out
    /*
    const fixedPositions = [
      { x: 0, y: 0, orientation: 0 }, // horizontal at top-left
      { x: 0, y: 1, orientation: 0 }, // horizontal, directly below
      { x: 0, y: 2, orientation: 0 }, // horizontal, directly below
      { x: 0, y: 3, orientation: 0 }, // horizontal, directly below
      { x: 0, y: 4, orientation: 0 }, // horizontal, directly below
    ];
    */

    for (let i = 0; i < num; i++) {
      const orientation = findRandom(2);
      const { xBoundry, yBoundry } = BoardManagement.findBoundaries(
        orientation.x,
        shipSizes[i],
        this.size
      );
      const { x, y } = findRandom(xBoundry, yBoundry);

      if (
        !this.checkPlacement(x, y, shipSizes[i], orientation) ||
        this.addShipRecursively(
          x,
          y,
          shipSizes[i],
          orientation.x,
          new Ship(shipSizes[i])
        ) === -1
      ) {
        i--;
      }

      /* Testing code - commented out
      if (
        this.addShipRecursively(
          fixedPositions[i].x,
          fixedPositions[i].y,
          shipSizes[i],
          fixedPositions[i].orientation,
          new Ship(shipSizes[i]) === -1
          || this.checkShipNeighbours(
              fixedPositions[i].x,
              fixedPositions[i].y,
              shipSizes[i],
              fixedPositions[i].orientation
            )
        ) === true
      )
        i--;
      */
    }
  }

  printBoard() {
    return this.board
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null) return ".";
            if (cell === "X") return "X";
            return cell.toString();
          })
          .join("   ")
      )
      .join("\n");
  }

  addShipRecursively(x, y, length, orientation, ship) {
    if (length <= 0) return;
    if (this.checkCoordinateBounds(x, y) || this.isShip(x, y)) return -1;

    this.board[y][x] = ship;
    BoardManagement.flagSurrounding(this.freeSpots, x, y, 3);

    // orientation 0: horizontal (increment x)
    // orientation 1: vertical (increment y)
    if (orientation === 0) {
      return this.addShipRecursively(x + 1, y, length - 1, orientation, ship);
    } else {
      return this.addShipRecursively(x, y + 1, length - 1, orientation, ship);
    }
  }

  receiveAttack(x, y) {
    if (this.set.has(`(${x}, ${y})`) || this.checkCoordinateBounds(x, y))
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

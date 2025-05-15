import Ship from "./Ship";

export default class BoardManagement {
  static checkCoordinateBounds(x, y, size) {
    return x >= size || x < 0 || y >= size || y < 0;
  }

  static isShip(x, y, board) {
    if (this.checkCoordinateBounds(x, y, board.length)) return false;
    return board[y][x] instanceof Ship;
  }

  static flagSurrounding(array, x, y, shipSpacing = 3) {
    for (let i = 0; i < shipSpacing; i++) {
        for (let j = 0; j < shipSpacing; j++) {
            const checkX = x + (-1 + j);  // Offset by -1 to center the square
            const checkY = y + (-1 + i);  // Offset by -1 to center the square
            if (!BoardManagement.checkCoordinateBounds(checkX, checkY, array.length)) {
                array[checkY][checkX] = false;
            }
        }
    }
  }

  static findBoundaries(orientation, shipSizes, size) {
    let xBoundry;
    let yBoundry;
    switch (orientation) {
      case 0: {
        xBoundry = size - shipSizes + 1;
        yBoundry = size + 1;
        break;
      }
      case 1: {
        xBoundry = size + 1;
        yBoundry = size - shipSizes + 1;
        break;
      }
    }
    return { xBoundry, yBoundry };
  }

  static calculateShipSizes(num, array) {
    if (num === 0) return;
    
    array.push(num);
    return this.calculateShipSizes(num - 1, array);
  }

  static getShipCount(gameBoard) {
    let count = 0;
    for (let y = 0; y < gameBoard.size; y++) {
        for (let x = 0; x < gameBoard.size; x++) {
            if (gameBoard.board[y][x] instanceof Ship && !gameBoard.set.has(`(${x}, ${y})`)) {
                count++;
            }
        }
    }
    return count;
  }

  static checkMove(x, y, set, size) {
    return !set.has(`(${x}, ${y})`) && !this.checkCoordinateBounds(x, y, size);
  }
}
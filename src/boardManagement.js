import Ship from "./Ship";

export default class BoardManagement {
  static checkCoordinateBounds(x, y, size) {
    return x >= size || x < 0 || y >= size || y < 0;
  }

  static isShip(x, y, board) {
    if (this.checkCoordinateBounds(x, y)) return false;
    return board[y][x] instanceof Ship;
  }

  static checkPlacement(x, y, length, array, orientation) {
    for (let i = 0; i < length; i++) {
        const checkX = orientation === 0 ? x + i : x;
        const checkY = orientation === 0 ? y : y + i;
        
        if (!array[checkY] || !array[checkY][checkX]) {
            return false;
        }
    }
    return true;
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
}
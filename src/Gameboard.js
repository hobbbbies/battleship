import Ship from "./Ship";
import findRandom from "./findRandom";

export default class Gameboard{
    constructor(size = 10){
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill(null));
        this.set = new Set();
    }

    init(num) {
        const shipSizes = [5, 4, 3, 2, 1];
        for (let i = 0; i < num; i++) {
            const { x, y } = findRandom(this.size - shipSizes[i], this.size);
            const orientation = findRandom(2);
            if(this.addShipRecursively(x, y, shipSizes[i], orientation.x, new Ship(shipSizes[i])) === -1) i--;
        }
    }

    printBoard() {
        return this.board.map(row => 
            row.map(cell => {
                if (cell === null) return '.';
                if (cell === 'X') return 'X';
                return cell.toString();
            }).join('   ')
        ).join('\n');
    }
    
    addShipRecursively(x, y, length, orientation, ship) { 
        if (length <= 0) return;
        if (this.checkCoordinateBounds(x, y) || this.isShip(x ,y)) return -1;
        
        this.board[y][x] = ship;
        
        // orientation 0: horizontal (increment x)
        // orientation 1: vertical (increment y)
        if (orientation === 0) {
            return this.addShipRecursively(x + 1, y, length - 1, orientation, ship);
        } else {
            return this.addShipRecursively(x, y + 1, length - 1, orientation, ship);
        }
    }

    checkCoordinateBounds(x, y){
        return x >= this.size || x < 0 || y >= this.size || y < 0;
    }

    receiveAttack(x, y) {
        if (this.set.has(`(${x}, ${y})`) || this.checkCoordinateBounds(x, y)) return -1;
        this.set.add(`(${x}, ${y})`);
        if (this.isShip(x, y)) {
            this.board[y][x].hit();
            return 1;
        } else {
            this.board[y][x] = 'X';
            return 0;
        }
    }

    isShip(x, y) {
        return (this.board[y][x] instanceof Ship)
    }
}
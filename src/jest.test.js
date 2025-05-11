import Ship from "./Ship";
import Gameboard from "./Gameboard";
import GameManager from "./GameManager";

describe("ship class", () => {
    test("toString returns correct string based on ship state", () => {
        const ship = new Ship(2);
        expect(ship.toString()).toBe('SHIP');
        
        ship.hit();
        ship.hit();
        expect(ship.toString()).toBe('SUNK');
    });
});

describe("GameManager", () => {
    let gameManager;

    beforeEach(() => {
        gameManager = new GameManager(10);
    });

    describe("cpuTurn", () => {
        test("should not play a cell that is out of bounds")
        test("should recursively retry playTurn until it chooses a cell that isn't already marked");
    });

    describe("playTurn", () => {
        test("should switch turns after successful attack", () => {
            const initialPlayer = gameManager.turn;
            gameManager.playTurn(0, 0);
            expect(gameManager.turn).not.toBe(initialPlayer);
        });
    });

    test("should not switch turns after invalid attack", () => {
      // Store initial player
      const initialPlayer = gameManager.turn;

      // Try to attack same spot twice
      gameManager.playTurn(0, 0);
      gameManager.playTurn(0, 0);
      gameManager.playTurn(0, 0);


      // Verify turn is still with second player
      expect(gameManager.turn).toBe(initialPlayer);
    });
});

describe("gameboard", () => {
    let myBoard;

    beforeEach(() => {
        myBoard = new Gameboard();
    });

    describe("addShip", () => {
        test("should fill all required positions with ship", () => {
            const x = 5;
            const y = 5;
            const length = 3;
            const testShip = new Ship();

            // Test horizontal placement (orientation 0)
            myBoard.addShipRecursively(x, y, length, 0, testShip);
            expect(myBoard.board[y][x]).toBe(testShip);
            expect(myBoard.board[y][x + 1]).toBe(testShip);
            expect(myBoard.board[y][x + 2]).toBe(testShip);

            // Test vertical placement (orientation 1)
            const verticalShip = new Ship();
            myBoard.addShipRecursively(x, y, length, 1, verticalShip);
            expect(myBoard.board[y][x]).toBe(verticalShip);
            expect(myBoard.board[y + 1][x]).toBe(verticalShip);
            expect(myBoard.board[y + 2][x]).toBe(verticalShip);
        });

        test("should return -1 if out of bounds", () => {
            const result = myBoard.addShipRecursively(-1, 14, 2, 0, new Ship(2));
            expect(result).toBe(-1);
        });
    });

    describe("receiveAttack", () => {
        test("should mark ship has hit", () => {
            myBoard.addShipRecursively(3, 3, 2, 1, new Ship());
            myBoard.receiveAttack(3, 3);
            expect(myBoard.board[3][3].hits).toBe(1);
        });

        test("should register hits for all ship positions", () => {
            const testShip = new Ship();
            const x = 4;
            const y = 4;
            const length = 3;

            // Place a horizontal ship
            myBoard.addShipRecursively(x, y, length, 0, testShip);

            // Attack each position
            myBoard.receiveAttack(x, y);
        
            // Check that all positions register the same number of hits
            expect(myBoard.board[y][x].hits).toBe(1);
            expect(myBoard.board[y][x + 1].hits).toBe(1);
            expect(myBoard.board[y][x + 2].hits).toBe(1);
        });

        test("should mark missed attack with 'X' when no ship present", () => {
            const x = 7;
            const y = 7;
            
            expect(myBoard.board[y][x]).toBeNull();
            myBoard.receiveAttack(x, y);
            expect(myBoard.board[y][x]).toBe('X');
        });

        test("should display 'SUNK' after ship is destroyed", () => {
            const ship = new Ship(2);
            const x = 6;
            const y = 6;
            
            // Place a horizontal ship of length 2
            myBoard.addShipRecursively(x, y, 2, 0, ship);
            
            // Attack both positions to sink it
            myBoard.receiveAttack(x, y);
            myBoard.receiveAttack(x + 1, y);
            
            // Check that both positions show 'SUNK'
            expect(myBoard.board[y][x].toString()).toBe('SUNK');
            expect(myBoard.board[y][x + 1].toString()).toBe('SUNK');
        });

        test("should not allow hitting the same coordinate twice", () => {
            const x = 5;
            const y = 5;
            const ship = new Ship(2);

            // Place ship and hit it once
            myBoard.addShipRecursively(x, y, 2, 0, ship);
            myBoard.receiveAttack(x, y);
            expect(myBoard.board[y][x].hits).toBe(1);

            // Try to hit the same spot again
            myBoard.receiveAttack(x, y);
            // Hits should still be 1 since second attack should be ignored
            expect(myBoard.board[y][x].hits).toBe(1);

            // Also test with empty coordinates
            const emptyX = 7;
            const emptyY = 7;
            
            myBoard.receiveAttack(emptyX, emptyY);
            expect(myBoard.board[emptyY][emptyX]).toBe('X');
            
            // Try to hit empty spot again
            myBoard.receiveAttack(emptyX, emptyY);
            // Should still be 'X', not changed
            expect(myBoard.board[emptyY][emptyX]).toBe('X');
        });
    });

    test("printBoard should return correct string representation", () => {
        const board = new Gameboard(3); // Use smaller board for testing
        const ship = new Ship(2);
        
        board.addShipRecursively(1, 1, 2, 0, ship);
        console.log(board.printBoard());
        board.receiveAttack(0, 0); // Miss
        
        const expected = 
            "X   .   .\n" +
            ".   SHIP   SHIP\n" +
            ".   .   .";
            
        expect(board.printBoard()).toBe(expected);
    });
});

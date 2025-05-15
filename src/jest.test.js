import Ship from "./Ship";
import Gameboard from "./Gameboard";
import GameManager from "./GameManager";
import Cpu from "../src/Cpu";

let tempArr;

beforeEach(() => {
    tempArr = Array.from({ length: 10 }, () => Array(10).fill(true));
});

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
    describe("checkWin", () => {
        test("should have 15 as the ship count", () => {
        gameManager.player.gameboard.init();
        gameManager.updateShipCount();
        expect(gameManager.playerShips).toBe(15);
        });
        
        test("should decrease ship count on successful hit", () => {
            gameManager.computer.gameboard.addShipRecursively(1, 1, 2, 0, new Ship(), tempArr);
            gameManager.player.gameboard.addShipRecursively(5, 5, 1, 0, new Ship(), tempArr);
            gameManager.playTurn(1, 1);
            gameManager.playTurn(3,3);
            gameManager.playTurn(2, 1);
            gameManager.updateShipCount();
            expect(gameManager.computerShips).toBe(0);
        });

        test("should change game state to finished when ships on either side are 0", () => {
          gameManager.gameStarted = true;
          gameManager.computer.gameboard.addShipRecursively(1, 1, 2, 0, new Ship(), tempArr);
          gameManager.computer.gameboard.addShipRecursively(1, 1, 2, 0, new Ship(), tempArr);
          gameManager.player.gameboard.addShipRecursively(5, 5, 1, 0, new Ship(), tempArr);
          gameManager.playTurn(1, 1);
          gameManager.playTurn(3,3);
          gameManager.playTurn(2, 1);
          gameManager.checkWin();
          console.log("Player Ships", gameManager.playerShips, "Computer ships: ", gameManager.computerShips);
          expect(gameManager.gameStarted).toBe(false);
        });
    });

    describe("cpuTurn", () => {
        describe("cpuTurn", () => {
          test("should not play a cell that is out of bounds", () => {
            let callCount = 0;
            const mockMath = Object.create(global.Math);
            mockMath.random = () => {
              callCount++;
              if (callCount > 3) {
                // Prevent infinite recursion in test
                return 0.5; // Return valid coordinates after 3 attempts
              }
              return 1.1; // Return out of bounds coordinates
            };
            global.Math = mockMath;

            gameManager.turn = gameManager.computer;
            gameManager.cpu.cpuTurn();

            // Verify that multiple attempts were made
            expect(callCount).toBe(6);

            // Restore original Math
            global.Math = Object.create(global.Math);
            });
        });

        test("should mark the correct cell on the playerBoard", () => {
          jest.spyOn(global.Math, "random").mockReturnValue(0.5); // or any fixed value

          gameManager.turn = gameManager.computer;
          gameManager.cpu.cpuTurn();

          const markedCells = gameManager.player.gameboard.board
            .flat()
            .filter((cell) => cell === "X").length;
          expect(markedCells).toBe(1);

          jest.spyOn(global.Math, "random").mockRestore(); // restore original
        });

        test("should hit specific coordinates", () => {
            // Mock Math.random to return values that will give us x=1, y=1
            const spy = jest.spyOn(global.Math, 'random')
                .mockReturnValueOnce(0.1)  // For x coordinate
                .mockReturnValueOnce(0.1); // For y coordinate

            gameManager.turn = gameManager.computer;
            gameManager.cpu.cpuTurn();

            // Verify the correct cell was hit
            expect(gameManager.player.gameboard.board[1][1]).toBe('X');

            // Restore original Math.random
            spy.mockRestore();
        });
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

    describe("init", () => {

      test("should not create ships that are neighbouring", () => {
        myBoard.init(5);

        // Check each cell on the board
        for (let y = 0; y < myBoard.size; y++) {
          for (let x = 0; x < myBoard.size; x++) {
            // Only check cells that contain ships
            if (myBoard.isShip(x, y)) {
              const currentShip = myBoard.board[y][x];

              // Check all 8 surrounding positions
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  // Skip the current cell
                  if (dx === 0 && dy === 0) continue;

                  const neighborX = x + dx;
                  const neighborY = y + dy;

                  // Skip out of bounds checks
                  if (
                    neighborX < 0 ||
                    neighborX >= myBoard.size ||
                    neighborY < 0 ||
                    neighborY >= myBoard.size
                  )
                    continue;

                  // If neighbor is a ship, it must be the same ship instance
                  if (myBoard.isShip(neighborX, neighborY)) {
                    expect(myBoard.board[neighborY][neighborX]).toBe(
                      currentShip
                    );
                  }
                }
              }
            }
          }
        }
      });

        test("should fill all required positions for vertical ship", () => {
            const verticalShip = new Ship(3);
            myBoard.addShipRecursively(3, 3, 3, 1, verticalShip, tempArr);
            expect(myBoard.board[3][3]).toEqual({
                length: 3,
                hits: 0,
                sunk: false
            });
            expect(myBoard.board[4][3]).toEqual({
                length: 3,
                hits: 0,
                sunk: false
            });
            expect(myBoard.board[5][3]).toEqual({
                length: 3,
                hits: 0,
                sunk: false
            });
        });

        test("should return -1 if out of bounds", () => {
            const result = myBoard.addShipRecursively(-1, 14, 2, 0, new Ship(2), tempArr);
            expect(result).toBe(-1);
        });

        test("should maintain spacing between perpendicular ships", () => {
            const ship1 = new Ship(3);
            const ship2 = new Ship(3);
            
            // Place horizontal ship
            myBoard.addShipRecursively(3, 3, 3, 0, ship1, tempArr);
            
            // Try to place vertical ship touching the first one
            const result = myBoard.addShipRecursively(3, 2, 3, 1, ship2, tempArr);
            
            // Should fail to place second ship
            expect(result).toBe(-1);
        });
    });

    describe("receiveAttack", () => {
        test("should mark ship has hit", () => {
            myBoard.addShipRecursively(3, 3, 2, 1, new Ship(), tempArr);
            myBoard.receiveAttack(3, 3);
            expect(myBoard.board[3][3].hits).toBe(1);
        });

        test("should register hits for all ship positions", () => {
            const testShip = new Ship(3);
            const x = 4;
            const y = 4;

            // Place a horizontal ship
            myBoard.addShipRecursively(x, y, 3, 0, testShip, tempArr);

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
            myBoard.addShipRecursively(x, y, 2, 0, ship, tempArr);
            
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
            myBoard.addShipRecursively(x, y, 2, 0, ship, tempArr);
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
        
        board.addShipRecursively(1, 1, 2, 0, ship, tempArr);
        console.log(board.printBoard());
        board.receiveAttack(0, 0); // Miss
        
        const expected = 
            "X   .   .\n" +
            ".   SHIP   SHIP\n" +
            ".   .   .";
            
        expect(board.printBoard()).toBe(expected);
    });

    describe("deleteShip" , () => {
        test("should delete all recursively placed ships if addShipRecursively fails", () => {
            const ship1 = new Ship(3);
            const ship2 = new Ship(3);

            // Place horizontal ship
            myBoard.addShipRecursively(3, 3, 3, 0, ship1, tempArr);

            // Try to place vertical ship touching the first one
            const result = myBoard.addShipRecursively(3, 2, 3, 1, ship2, tempArr);

            expect(myBoard.board[2][3]).toBe(null);
        });

        test("should do the same as the other test in reverse order", () => {
            const ship1 = new Ship(3);
            const ship2 = new Ship(3);

            // Place horizontal ship
            myBoard.addShipRecursively(3, 3, 3, 0, ship1, tempArr);

            // Try to place vertical ship touching the first one
            const result = myBoard.addShipRecursively(3, 2, 3, 0, ship2, tempArr);

            expect(myBoard.board[4][3]).toBe(null);
        });

        test("should not allow 'L' shaped ships to occur", () => {
            myBoard.addShipRecursively(4, 0, 5, 1, new Ship(5), tempArr);
            const result = myBoard.addShipRecursively(2, 4, 4, 0, new Ship(4), tempArr);

            expect(myBoard.board[4][2]).toBe(null);
        });

        test("should not allow ships to touch diagonally", () => {
            myBoard.addShipRecursively(4, 0, 5, 1, new Ship(5), tempArr);
            const result = myBoard.addShipRecursively(5, 5, 4, 1, new Ship(4), tempArr);

            expect(myBoard.board[5][5]).toBe(null);
        });
    });
});

describe("Cpu class integration", () => {
  let manager; 
  
  beforeEach(() => {
    manager = new GameManager(10);
    manager.player.gameboard.init();
  });

  describe("queueDirection", () => {
    test("should queue only the next direction" , () => {
      manager.cpu.queueDirection(3, 3, { x: 1, y: 0 });

      expect(manager.cpu.moveQueue).toHaveLength(1);
    });
  });

  describe("smartHit", () => {
    test("Should properly label lastMove", () => {
      manager.cpu.moveQueue.push({ x: 3, y: 3 });

      manager.player.gameboard.board[3][3] = new Ship(2);
      manager.turn = manager.computer;
      manager.cpu.cpuTurn();
      expect(manager.cpu.lastMove).toEqual({ x: 3, y: 3 });

    });
  });

  test("queueMoves pushes all valid adjacent moves", () => {
    // Create a real GameManager with a 10x10 board
    manager.player.gameboard.init(); // Ensure board is initialized

    // Create the Cpu instance
    const cpu = new Cpu(manager);

    // Push adjacent cells around (5,5)
    cpu.queueMoves(5, 5);

    // Since (5,5) is central, all four moves should be valid
    expect(cpu.moveQueue).toHaveLength(4);
    expect(cpu.moveQueue).toContainEqual({ x: 6, y: 5 });
    expect(cpu.moveQueue).toContainEqual({ x: 4, y: 5 });
    expect(cpu.moveQueue).toContainEqual({ x: 5, y: 6 });
    expect(cpu.moveQueue).toContainEqual({ x: 5, y: 4 });
  });

  test("queueMoves should not queue moves outside the board", () => {
    // Create the Cpu instance
    const cpu = new Cpu(manager);

    // Call queueMoves near the top-left corner at (0,0)
    cpu.queueMoves(0, 0);

    // Only valid directions from (0,0) are (1,0) and (0,1)
    expect(cpu.moveQueue).toHaveLength(2);
    expect(cpu.moveQueue).toContainEqual({ x: 1, y: 0 });
    expect(cpu.moveQueue).toContainEqual({ x: 0, y: 1 });
    
    // None of the negative or out-of-bounds coordinates should be added
    expect(cpu.moveQueue).not.toContainEqual({ x: -1, y: 0 });
    expect(cpu.moveQueue).not.toContainEqual({ x: 0, y: -1 });
  });

  test("once CPU hits the first part of a ship, it queues and hits the next segment", () => {
    // Place a 2-cell vertical ship at (3,3) and (4,3)
    manager.player.gameboard.board[3][3] = new Ship(2);
    manager.player.gameboard.board[4][3] = manager.player.gameboard.board[3][3];

    const cpu = new Cpu(manager);
    manager.turn = manager.computer;

    // Force CPU to hit the first coordinate
    cpu.moveQueue.push({ x: 3, y: 3 });

    // CPU hits the first segment
    cpu.cpuTurn();
    expect(manager.playerShips).toBe(1);

    // The CPU should now queue adjacent directions from (3,3), including (4,3)
    expect(cpu.moveQueue).toContainEqual({ x: 4, y: 3 });

    // CPU hits the next segment
    manager.turn = manager.computer;
    cpu.cpuTurn();
    manager.turn = manager.computer;
    cpu.cpuTurn();
    manager.turn = manager.computer;
    cpu.cpuTurn();
    manager.turn = manager.computer;
    cpu.cpuTurn();

    expect(manager.playerShips).toBe(0);
  });

  test("cpuTurn should not queue a move that's already been played", () => {
    const cpu = new Cpu(manager);
    manager.turn = manager.computer;

    // Simulate that (3,3) was already attacked
    // (receiveAttack logs the coordinate in board.set)
    manager.player.gameboard.receiveAttack(3, 3);

    // Now, when queueMoves is called, (3,3) should be rejected
    cpu.queueMoves(4, 3);

    // Ensure (3,3) did not get queued again
    expect(cpu.moveQueue).not.toContainEqual({ x: 3, y: 3 });
  });

  test("cpu should get all 4 turns after hitting a ship", () => {
    manager.player.gameboard.board[3][3] = new Ship(2);
    manager.player.gameboard.board[4][3] = manager.player.gameboard.board[3][3];
    manager.player.gameboard.board[5][3] = manager.player.gameboard.board[3][3];

    manager.computer.gameboard.board[3][3] = new Ship(2);
    manager.computer.gameboard.board[4][3] = manager.computer.gameboard.board[3][3];
    manager.computer.gameboard.board[5][3] = manager.computer.gameboard.board[3][3];
    manager.computer.gameboard.board[6][3] = manager.computer.gameboard.board[3][3];
    manager.computer.gameboard.board[7][3] = manager.computer.gameboard.board[3][3];



    manager.playTurn(3, 3);
    
    cpu.moveQueue.push({ x: 3, y: 3 });
    manager.cpu.cpuTurn();
    manager.playTurn(3, 4);
    manager.cpuTurn();
    manager.playTurn(3, 5);
    manager.cpuTurn();
    manager.playTurn(3, 6);
    manager.cpuTurn();
    manager.playTurn(3, 7);
    manager.cpuTurn();
  });
});

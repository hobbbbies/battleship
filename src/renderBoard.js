export default function renderBoard(gameManager, playerBoard, playerDiv) {
  playerDiv.textContent = "";
  for (let i = 0; i < playerBoard.gameboard.board.length; i++) {
    for (let j = 0; j < playerBoard.gameboard.board[i].length; j++) {
      const cell = createCell(j, i, playerBoard);
      addCellListener(cell, playerBoard, playerDiv);
      playerDiv.append(cell);
    }
  }
}

function addCellListener(cell, playerBoard, playerDiv) {
  cell.addEventListener("click", () => {
    const [x, y] = JSON.parse(cell.dataset.cords);
    gameManager.playTurn(x, y);
    renderBoard(playerBoard, playerDiv);
  });
}

function createCell(x, y, playerBoard) {
  const cell = document.createElement("div");
  cell.classList.add('grid-cell');
  cell.dataset.cords = JSON.stringify([x, y]);
  updateCellDisplay(cell, playerBoard, x, y);
  return cell;
}

function updateCellDisplay(cell, playerBoard, x, y) {
  const cellState = getCellState(playerBoard, x, y);
  cell.textContent = cellState.text;
  cell.classList.add(cellState.className);
}

function getCellState(playerBoard, x, y) {
  if (playerBoard.gameboard.set.has(`(${x}, ${y})`)) {
    if (playerBoard.gameboard.isShip(x, y)) {
      return { text: "", className: "hit" };
    } 
    return { text: "X", className: "miss" };
  }
 
  if (!playerBoard.gameboard.isShip(x, y)) {
    return { text: '', className: 'empty' };
  }
  
  if (playerBoard.gameboard.board[y][x].isSunk()) {
    return { text: '', className: 'sunk' };
  }
  
  return playerBoard.team === "player" ? { text: "", className: "ship" } : { text: "", className: "enemy-ship"};
}

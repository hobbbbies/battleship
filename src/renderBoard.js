export default function renderBoard(gameManager, playerBoard, playerDiv) {
  playerDiv.textContent = "";
  playerDiv.style.setProperty("--grid-size", playerBoard.gameboard.size);
  
  for (let i = 0; i < playerBoard.gameboard.size; i++) {
    for (let j = 0; j < playerBoard.gameboard.size; j++) {
      const cell = createCell(j, i, playerBoard);
      if (playerBoard.team === "opponent") addCellListener(gameManager, cell, playerBoard, playerDiv);
      playerDiv.append(cell);
    }
  }
}

function addCellListener(gameManager, cell) {
  function handleCellClick() {
    const [x, y] = JSON.parse(cell.dataset.cords);
    console.log(gameManager.turn);
    gameManager.playTurn(x, y);
    gameManager.cpu.cpuTurn();
    gameManager.render();
  }

  cell.addEventListener("click", handleCellClick, { once: true });
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
    if (playerBoard.gameboard.isShip(x, y, playerBoard.gameboard.board)) {
      return { text: "", className: "hit" };
    } 
    return { text: "X", className: "miss" };
  }
 
  if (!playerBoard.gameboard.isShip(x, y, playerBoard.gameboard.board)) {
    return { text: "", className: "empty" };
  }
  
  if (playerBoard.gameboard.board[y][x].isSunk()) {
    return { text: '', className: 'sunk' };
  }
  
  return playerBoard.team === "player" ? { text: "", className: "ship" } : { text: "", className: "enemy-ship"};
}


export default function renderBoard(playerBoard, playerDiv) {
  playerDiv.textContent = "";
  for (let i = 0; i < playerBoard.board.length; i++) {
    for (let j = 0; j < playerBoard.board[i].length; j++) {
      const cell = createCell(j, i);
      addCellListener(cell, playerBoard);
    //   let cellText = playerBoard.board[i][j];
    //   cell.dataset.cords = JSON.stringify([j, i]);
    //   if (playerBoard.isShip(j, i)) {
    //     if (playerBoard.set.has(`(${j}, ${i})`)) {
    //       cell.style.backgroundColor = "red";
    //     }
    //     if (playerBoard.board[i][j].isSunk()) {
    //       cellText = "SUNK";
    //     } else cellText = "SHIP";
    //   }

    //   cell.textContent = cellText;
    //   cell.addEventListener("click", () => {
    //     const [x, y] = JSON.parse(cell.dataset.cords);
    //     playerBoard.receiveAttack(x, y);
    //   });
    playerDiv.append(cellfunction updateCellDisplay(cell, playerBoard, x, y) {
    const cellState = getCellState(playerBoard, x, y);
    cell.textContent = cellState.text;
    if (cellState.className) {
        cell.classList.add(cellState.className);
    }
}

function getCellState(playerBoard, x, y) {
    if (!playerBoard.isShip(x, y)) {
        return { text: '', className: '' };
    }
    
    if (playerBoard.set.has(`(${x}, ${y})`)) {
        return { text: 'X', className: 'hit' };
    }
    
    if (playerBoard.board[y][x].isSunk()) {
        return { text: '', className: 'sunk' };
    }
    
    return { text: '', className: 'ship' };
});
    // }
  }

  function createCell(x, y) {
    const cell = document.createElement("div");
    let cellText = playerBoard.board[y][x];
    cell.dataset.cords = JSON.stringify([x, y]);
    if (playerBoard.isShip(x, y)) {
      if (playerBoard.set.has(`(${x}, ${y})`)) {
        cell.style.backgroundColor = "red";
      }
      if (playerBoard.board[y][x].isSunk()) {
        cellText = "SUNK";
      } else cellText = "SHIP";
    }

    cell.textContent = cellText;
    return cell;
  }

  function addCellListener(cell, playerBoard) {
    cell.addEventListener("click", () => {
      const [x, y] = JSON.parse(cell.dataset.cords);
      playerBoard.receiveAttack(x, y);
    });
  }

  function updateCellDisplay(cell, playerBoard, x, y) {
    const cellState = getCellState(playerBoard, x, y);
    cell.textContent = cellState.text;
    if (cellState.className) {
        cell.classList.add(cellState.className);
    }
}

function getCellState(playerBoard, x, y) {
    if (!playerBoard.isShip(x, y)) {
        return { text: '', className: '' };
    }
    
    if (playerBoard.set.has(`(${x}, ${y})`)) {
        return { text: 'X', className: 'hit' };
    }
    
    if (playerBoard.board[y][x].isSunk()) {
        return { text: '', className: 'sunk' };
    }
    
    return { text: '', className: 'ship' };
    }
}

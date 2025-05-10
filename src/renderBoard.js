export default function renderBoard(playerBoard, playerDiv) {
    playerBoard.init();
    playerDiv.textContent = '';
    for (let i = 0; i < playerBoard.board.length; i++) {
      for (let j = 0; j < playerBoard.board[i].length; j++) {
        const grid = document.createElement("div");
        grid.dataset.cords = JSON.stringify([j,i]);
        if (playerBoard.isShip(j, i) && playerBoard.set.has(`(${j}, ${i})`)) {
            grid.style.backgroundColor = 'red';
        }
        grid.textContent = playerBoard.board[i][j];
        grid.addEventListener('click', () => {
            // Dont let the user click the same one twice 
            const [x, y] = JSON.parse(grid.dataset.cords); 
            playerBoard.receiveAttack(x, y);
            renderBoard(playerBoard, playerDiv) === 1
        });
        playerDiv.append(grid);
      }
    }
}
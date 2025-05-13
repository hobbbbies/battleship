import renderBoard from "./renderBoard";
import RenderUtils from "./renderUtils";

export default function render(gameManager, pOne, pTwo) {
    const gameStatus = document.querySelector("#status-message");

    const pOneDiv = document.querySelector("#player-board");
    const pTwoDiv = document.querySelector("#opponent-board");

    // buttons
    const newBoard = document.querySelector("#new-board")
    const resetBtn = document.querySelector("#reset-game");
    const startBtn = document.querySelector("#start-game");
        
    if (!gameManager.gameStarted) {
        RenderUtils.initDisable(pOneDiv, pTwoDiv);
        gameStatus.textContent = "Waiting for the game to start";
    }

    newBoard.addEventListener('click', () => {
        if (gameManager.gameStarted) {
            alert("Wait until the game is over!");
        } else {
            pOne.gameboard.init();
            renderBoard(gameManager, pOne, pOneDiv);
        }
    });

    resetBtn.addEventListener("click", () => {
      gameStatus.textContent = "Waiting for the game to start";
      gameManager.gameStarted = false;
      RenderUtils.initDisable(pOneDiv, pTwoDiv);
      pOne.gameboard.init();
      pTwo.gameboard.init();
      renderBoard(gameManager, pOne, pOneDiv);
      renderBoard(gameManager, pTwo, pTwoDiv);
    });

    startBtn.addEventListener("click", () => {
      gameStatus.textContent = "Place your ships!";
      RenderUtils.enableBoard(pOneDiv);
      RenderUtils.enableBoard(pTwoDiv);
      gameManager.gameStarted = true;
    });

    renderBoard(gameManager, pOne, pOneDiv);
    renderBoard(gameManager, pTwo, pTwoDiv);
}


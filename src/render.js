import renderBoard from "./renderBoard";
import RenderUtils from "./renderUtils";

export default function render(gameManager, pOne, pTwo) {
    const gameStatus = document.querySelector("#status-message");
    const pOneDiv = document.querySelector("#player-board");
    const pTwoDiv = document.querySelector("#opponent-board");
    const newBoard = document.querySelector("#new-board");
    const resetBtn = document.querySelector("#reset-game");
    const startBtn = document.querySelector("#start-game");
    const sizeSelector = document.querySelector("#board-size");
    console.log(sizeSelector.value);

    // Clear old listeners first
    newBoard.replaceWith(newBoard.cloneNode(true));
    resetBtn.replaceWith(resetBtn.cloneNode(true));
    startBtn.replaceWith(startBtn.cloneNode(true));
    // Re-query elements after replacing
    const newBoardBtn = document.querySelector("#new-board");
    const resetButton = document.querySelector("#reset-game");
    const startButton = document.querySelector("#start-game");
    // const sizeSelect = document.querySelector("#board-size");

    if (!gameManager.gameStarted) {
        RenderUtils.initDisable(pOneDiv, pTwoDiv);
        if (gameManager.winner) {
            gameStatus.textContent = gameManager.winner === "player" 
                ? "PLAYER wins!!!" 
                : "CPU wins :(\nBetter luck next time!";
        } else {
            gameStatus.textContent = "Waiting for the game to start";
        }
    }

    function addNewBoardListener(gameManager, pOne, pOneDiv) {
        function handleNewBoard() {
            if (gameManager.gameStarted) {
                alert("Wait until the game is over!");
            } else {
                pOne.gameboard.init();
                renderBoard(gameManager, pOne, pOneDiv);
            }
        }
        newBoardBtn.addEventListener('click', handleNewBoard);
    }

    function addResetListener(gameManager, pOne, pTwo, pOneDiv, pTwoDiv, gameStatus) {
        function handleReset() {
            gameStatus.textContent = "Waiting for the game to start";
            gameManager.gameStarted = false;
            RenderUtils.initDisable(pOneDiv, pTwoDiv);
            pOne.gameboard.init();
            pTwo.gameboard.init();
            renderBoard(gameManager, pOne, pOneDiv);
            renderBoard(gameManager, pTwo, pTwoDiv);
        }
        resetButton.addEventListener('click', handleReset);
    }

    function addStartListener(gameManager, pOneDiv, pTwoDiv, gameStatus) {
        function handleGameStart() {
            gameStatus.textContent = "Game started - Make your move!";
            gameManager.gameStarted = true;
            RenderUtils.enableBoard(pOneDiv);
            RenderUtils.enableBoard(pTwoDiv);
        }
        startButton.addEventListener('click', handleGameStart);
    }

    const sizeChangeListener = (e) => {
        RenderUtils.handleSizeChange(e, gameManager, sizeSelector);
    };

    function addSizeListener(sizeSelector) {
        sizeSelector.addEventListener('change', sizeChangeListener);
    }

    function removeSizeListener(gameManager, sizeSelector) {
        sizeSelector.removeEventListener('change', sizeChangeListener);
    }

    removeSizeListener(gameManager, sizeSelector);

    addNewBoardListener(gameManager, pOne, pOneDiv);
    addResetListener(gameManager, pOne, pTwo, pOneDiv, pTwoDiv, gameStatus);
    addStartListener(gameManager, pOneDiv, pTwoDiv, gameStatus);
    addSizeListener(gameManager, sizeSelector);

    renderBoard(gameManager, pOne, pOneDiv);
    renderBoard(gameManager, pTwo, pTwoDiv);
}



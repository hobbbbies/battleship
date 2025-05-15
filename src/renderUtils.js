export default class RenderUtils {
    static disableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "none";
        boardDiv.style.opacity = "50%";
    }

    static enableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "auto";
        boardDiv.style.opacity = "100%";
    } 

    static initDisable(pOneDiv, pTwoDiv) {
        RenderUtils.disableBoard(pOneDiv);
        RenderUtils.disableBoard(pTwoDiv);
    }

    static handleSizeChange(e, gameManager, sizeSelector) {
        if (!gameManager.gameStarted) {
            const newSize = parseInt(e.target.value);
            gameManager.updateBoardSize(newSize);
            gameManager.init();
        } else {
            alert("Cannot change board size while game is in progress!");
            sizeSelector.value = gameManager.boardSize;
        }
    }  
}